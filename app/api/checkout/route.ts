import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { isPricingPlan, PRICING } from "@/lib/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBaseUrl(req: NextRequest) {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.APP_URL ||
    req.nextUrl.origin
  ).replace(/\/$/, "");
}

export async function POST(req: NextRequest) {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeSecretKey) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY" },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get("authorization");
  const accessToken = authHeader?.replace("Bearer ", "");

  if (!accessToken) {
    return NextResponse.json({ error: "Non connecté" }, { status: 401 });
  }

  const body = await req.json();
  const planParam = body.plan;

  if (!isPricingPlan(planParam)) {
    return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();

  const {
    data: { user },
    error: userError,
  } = await supabaseAdmin.auth.getUser(accessToken);

  if (userError || !user) {
    return NextResponse.json({ error: "Session invalide" }, { status: 401 });
  }

  const price = PRICING[planParam];
  const baseUrl = getBaseUrl(req);

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2026-02-25.clover",
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    locale: "fr",
    customer_email: user.email || undefined,
    line_items: [
      {
        price: price.priceId,
        quantity: 1,
      },
    ],
    metadata: {
      user_id: user.id,
      email: user.email || "",
      plan: planParam,
      price_id: price.priceId,
      credits: String(price.credits),
    },
    success_url: `${baseUrl}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/stripe/cancel`,
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Impossible de créer la session Stripe" },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: session.url });
}