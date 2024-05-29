// import PrintObject from "@/components/stripe/PrintObject";
import { stripe } from "@/lib/stripe";
import type { Stripe } from "stripe";

import ContinueButton from "./ContinueButton";
import SuccessDetails from "./SuccessDetails";

export default async function ResultPage({
    searchParams,
}: {
    searchParams: { session_id: string };
}): Promise<JSX.Element> {
    if (!searchParams.session_id)
        throw new Error("Please provide a valid session_id (`cs_test_...`)");

    const checkoutSession: Stripe.Checkout.Session =
        await stripe.checkout.sessions.retrieve(searchParams.session_id, {
            expand: ["line_items", "payment_intent"],
        });

    const paymentIntent =
        checkoutSession.payment_intent as Stripe.PaymentIntent;

    return (
        <div className="min-h-[calc(100vh-56px)] flex-between flex-col">
            <div className="space-y-8">
                <h1 className="text-2xl font-semibold pt-8 text-center">
                    Congratulations! Your payment was successful!
                </h1>

                <SuccessDetails paymentIntent={paymentIntent} />
            </div>

            <ContinueButton />
        </div>
    );
}

