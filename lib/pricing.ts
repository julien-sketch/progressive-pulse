export const PRICING = {
  single: {
    name: "1 dossier",
    priceId: "price_1TZSDwJ97jquAbAV0P47gZQp",
    amount: 3900,
    credits: 1,
  },

  pack5: {
    name: "5 dossiers",
    priceId: "price_1TZSAOJ97jquAbAVwcCKMZN6",
    amount: 14900,
    credits: 5,
  },
} as const;

export type PricingPlan = keyof typeof PRICING;

export function isPricingPlan(plan: string | null): plan is PricingPlan {
  return !!plan && plan in PRICING;
}

export function getCreditsForPriceId(priceId: string | null | undefined) {
  if (!priceId) return 0;

  const plan = Object.values(PRICING).find((item) => item.priceId === priceId);
  return plan?.credits ?? 0;
}