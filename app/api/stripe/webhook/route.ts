import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // important pour Stripe webhook crypto
export const dynamic = "force-dynamic"; // évite certaines optimisations/collectes

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRole) {
    throw new Error("Missing Supabase env vars (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  }

  return createClient(url, serviceRole, {
    auth: { persistSession: false },
  });
}

export async function POST(req: Request) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeSecretKey) {
    return new NextResponse("Missing STRIPE_SECRET_KEY", { status: 500 });
  }
  if (!webhookSecret) {
    return new NextResponse("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2026-01-28.clover",
  });

  const sig = req.headers.get("stripe-signature");
  if (!sig) return new NextResponse("Missing stripe-signature", { status: 400 });

  let event: Stripe.Event;

  try {
    const payload = await req.text(); // raw body
    event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err?.message || err);
    return new NextResponse("Webhook Error: Invalid signature", { status: 400 });
  }

  try {
    // ✅ Exemple de gestion d’event : adapte à ton modèle DB
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // Exemple : email du client Stripe
      const email =
        session.customer_details?.email ||
        (typeof session.customer_email === "string" ? session.customer_email : null);

      // Exemple : metadata
      const pack = session.metadata?.pack ?? null;

      const supabase = getSupabaseAdmin();

      // TODO: adapte à tes tables
      // Exemple (à modifier) : log d’achat
      await supabase.from("stripe_events").insert({
        type: event.type,
        stripe_id: event.id,
        email,
        pack,
        created_at: new Date().toISOString(),
      });
    }

    // tu peux ajouter invoice.payment_succeeded, customer.subscription.created, etc.
  } catch (err: any) {
    console.error("Webhook handler failed:", err?.message || err);
    // Stripe retentera si tu renvoies 500
    return new NextResponse("Webhook handler error", { status: 500 });
  }

  return NextResponse.json({ received: true });
}