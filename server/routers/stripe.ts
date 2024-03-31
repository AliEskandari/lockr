import admin from "@/modules/backend/admin";
import stripe from "@/modules/backend/stripe";
import Stripe from "stripe";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { env } from "@/modules/env";

export const stripeRouter = router({
  /**
   * POST /stripe/webhook
   *
   * Handles Stripe webhook calls for various events.
   * Stripe requires the raw body to construct the event
   * https://stripe.com/docs/billing/subscriptions/webhooks
   */
  webhook: publicProcedure.input(z.any()).mutation(async ({ input, ctx }) => {
    let event: Stripe.Event;
    let signature: string = ctx.req.headers["stripe-signature"] as string;

    try {
      event = stripe.webhooks.constructEvent(
        JSON.stringify(input),
        signature,
        env.STRIPE__ENDPOINT_SECRET
      );
    } catch (err: any) {
      console.error("Error verifying Stripe webhook:", err.message);
      return { success: false, error: err.message };
    }

    console.log(`Handling event type ${event.type}.`);

    switch (event.type) {
      case "checkout.session.completed":
        handleCheckoutSessionCompletedEvent(event);
        break;
      case "invoice.paid":
        handleInvoicePaidEvent(event);
      case "invoice.created":
      case "invoice.updated":
        // Must return successful response
        handleInvoiceCreatedUpdatedPaidEvent(event);
        break;
      case "invoice.payment_failed":
        handleInvoicePaymentFailedEvent(event);
        break;
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        handleCustomerSubscriptionUpdated(event);
        break;
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return { success: true };
  }),
});

async function handleCheckoutSessionCompletedEvent(event: Stripe.Event) {
  const checkoutSession = event.data.object as Stripe.Checkout.Session;
  const { client_reference_id, customer, subscription } = checkoutSession;

  if (!client_reference_id || !customer || !subscription) return;

  await admin.User.update(client_reference_id, {
    stripe: {
      customer: {
        id: customer as string,
      },
      subscription: {
        id: subscription as string,
      },
    },
  });
}

/**
 * Called when subscription is created AND when it is revewed (every month / year).
 * @param {Invoice} event
 * @returns
 */
async function handleInvoicePaidEvent(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  const { customer } = invoice;

  const user = await admin.User.findOne({
    "stripe.customer.id": customer as string,
  });
  if (!user) return;
  await admin.User.update(user.id, {
    subscription: { expiresAt: user.stripe.subscription.current_period_end },
  });
}

/**
 * Called when an invoice is created for a new or renewing subscription. Stores invoice
 * in user doc.
 * @param {Invoice} event
 */
async function handleInvoiceCreatedUpdatedPaidEvent(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice;
  const {
    customer,
    id,
    status,
    period_start,
    hosted_invoice_url,
    invoice_pdf,
    created,
  } = invoice;

  const user = await admin.User.findOne({
    "stripe.customer.id": customer as string,
  });
  if (!user) return;
  await admin.User.update(user.id, {
    stripe: {
      invoices: {
        [id]: {
          id,
          status,
          period_start,
          hosted_invoice_url,
          invoice_pdf,
          created,
        },
      },
    },
  });
}

async function handleCustomerSubscriptionUpdated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription;
  const { id, status, current_period_end, current_period_start } = subscription;

  const user = await admin.User.findOne({ "stripe.subscription.id": id });
  if (!user) return;

  var expiresAt = current_period_end;

  if (status == "canceled" || status == "unpaid") {
    // revoke access
    expiresAt = Date.now();
  }

  if (status == "past_due") {
    // TODO: Notify customer to update payment details
  }

  await admin.User.update(user.id, {
    stripe: {
      subscription: {
        status,
        current_period_end,
        current_period_start,
      },
    },
    subscription: {
      expiresAt,
      status: status,
    },
  });

  await admin.SocialUnlock.updateMany(
    { "user.id": user.id },
    {
      "user.subscription.expiresAt": expiresAt,
    }
  );
}

/**
 * When subscription payment fails in Stripe, sets corresponding supscription
 * status to "incomplete".
 * @param {Stripe Event} event
 */
async function handleInvoicePaymentFailedEvent(event: Stripe.Event) {
  let invoice = event.data.object;
}

export default router;
