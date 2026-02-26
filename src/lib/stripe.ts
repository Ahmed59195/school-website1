import Stripe from "stripe"

// Lazy initialization to allow builds without STRIPE_SECRET_KEY
// The error will be thrown at runtime when Stripe is actually used
let stripeInstance: Stripe | null = null

function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set in environment variables")
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
    })
  }
  return stripeInstance
}

export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    return getStripe()[prop as keyof Stripe]
  },
})

interface CreateCheckoutSessionParams {
  feeId: string
  studentName: string
  feeDescription: string
  amount: number // Amount in PKR
  studentId: string
  successUrl: string
  cancelUrl: string
}

export async function createCheckoutSession({
  feeId,
  studentName,
  feeDescription,
  amount,
  studentId,
  successUrl,
  cancelUrl,
}: CreateCheckoutSessionParams): Promise<Stripe.Checkout.Session> {
  // Convert PKR to the smallest currency unit (paisa)
  const amountInPaisa = Math.round(amount * 100)

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "pkr",
          product_data: {
            name: feeDescription,
            description: `Fee payment for ${studentName}`,
            metadata: {
              feeId,
              studentId,
            },
          },
          unit_amount: amountInPaisa,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      feeId,
      studentId,
    },
  })

  return session
}

export async function retrieveSession(
  sessionId: string
): Promise<Stripe.Checkout.Session> {
  return await stripe.checkout.sessions.retrieve(sessionId)
}

export async function constructWebhookEvent(
  body: string | Buffer,
  signature: string
): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not set")
  }

  return stripe.webhooks.constructEvent(body, signature, webhookSecret)
}
