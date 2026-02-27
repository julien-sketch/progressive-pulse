import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRole) {
    throw new Error(
      "Missing Supabase env vars (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)"
    );
  }

  return createClient(url, serviceRole, {
    auth: { persistSession: false },
  });
}

function toInt(v: unknown) {
  const n = typeof v === "string" ? parseInt(v, 10) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : 0;
}

export async function POST(req: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey) return new NextResponse("Missing STRIPE_SECRET_KEY", { status: 500 });
  if (!webhookSecret) return new NextResponse("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2026-01-28.clover",
  });

  const sig = req.headers.get("stripe-signature");
  if (!sig) return new NextResponse("Missing stripe-signature", { status: 400 });

  let event: Stripe.Event;

  try {
    const payload = await req.text();
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err?.message || err);
    return new NextResponse("Webhook Error: Invalid signature", { status: 400 });
  }

  // On ne traite que checkout.session.completed (Payment Links aussi)
  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, ignored: event.type });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Email Stripe (sert à retrouver le user)
  const email =
    session.customer_details?.email ||
    (typeof session.customer_email === "string" ? session.customer_email : "");

  if (!email) {
    // si pas d'email, impossible d’attribuer les crédits
    return new NextResponse("No customer email in session", { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // ✅ 1) Idempotence : si déjà traité => exit OK
  // IMPORTANT : il faut une colonne credit_events.stripe_event_id UNIQUE
  const { data: already, error: alreadyErr } = await supabase
    .from("credit_events")
    .select("id")
    .eq("stripe_event_id", event.id)
    .maybeSingle();

  if (alreadyErr) {
    console.error("credit_events select error:", alreadyErr);
    return new NextResponse(alreadyErr.message, { status: 500 });
  }
  if (already) {
    return NextResponse.json({ ok: true, deduped: true });
  }

  // ✅ 2) Trouver user_id via email
  // => il faut que tu aies une table profiles avec email
  const { data: profile, error: profErr } = await supabase
    .from("profiles")
    .select("user_id,email")
    .eq("email", email)
    .maybeSingle();

  if (profErr) {
    console.error("profiles select error:", profErr);
    return new NextResponse(profErr.message, { status: 500 });
  }
  if (!profile?.user_id) {
    return new NextResponse(`No profile found for email: ${email}`, { status: 404 });
  }

  const userId = String(profile.user_id);

  // ✅ 3) Calculer combien de crédits ajouter
  // -> on préfère la metadata du PRICE : metadata.credits
  // -> fallback: metadata.credits sur la session
  let creditsToAdd = 0;

  try {
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items.data.price"],
    });

    const items = fullSession.line_items?.data || [];

    for (const it of items) {
      const qty = it.quantity || 1;

      // price peut être null selon cas, on sécurise
      const priceObj = it.price as Stripe.Price | null;
      const creditsMeta = priceObj?.metadata?.credits;

      const creditsPerUnit = creditsMeta ? toInt(creditsMeta) : 0;
      creditsToAdd += creditsPerUnit * qty;
    }
  } catch (e) {
    console.error("stripe session retrieve failed:", e);
  }

  // fallback session metadata (si jamais)
  if (creditsToAdd <= 0) {
    creditsToAdd = toInt(session.metadata?.credits);
  }

  if (creditsToAdd <= 0) {
    return new NextResponse("Could not determine credits to add (missing metadata.credits on Price)", {
      status: 400,
    });
  }

  // ✅ 4) Update wallet (upsert + increment)
  const { data: wallet, error: walletSelErr } = await supabase
    .from("credit_wallets")
    .select("credits")
    .eq("user_id", userId)
    .maybeSingle();

  if (walletSelErr) {
    console.error("credit_wallets select error:", walletSelErr);
    return new NextResponse(walletSelErr.message, { status: 500 });
  }

  const currentCredits = Number(wallet?.credits ?? 0);
  const nextCredits = currentCredits + creditsToAdd;

  const { error: walletUpErr } = await supabase.from("credit_wallets").upsert({
    user_id: userId,
    credits: nextCredits,
    updated_at: new Date().toISOString(),
  });

  if (walletUpErr) {
    console.error("credit_wallets upsert error:", walletUpErr);
    return new NextResponse(walletUpErr.message, { status: 500 });
  }

  // ✅ 5) Log credit_event (idempotence)
  const { error: logErr } = await supabase.from("credit_events").insert({
    user_id: userId,
    delta: creditsToAdd,
    reason: "stripe_payment",
    stripe_event_id: event.id,
    stripe_session_id: session.id,
    created_at: new Date().toISOString(),
  });

  if (logErr) {
    console.error("credit_events insert error:", logErr);
    return new NextResponse(logErr.message, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    email,
    userId,
    creditsAdded: creditsToAdd,
    nextCredits,
  });
}