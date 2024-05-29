"use client";

import React, { MouseEventHandler, useState } from "react";
import { createCheckoutSession } from "@/actions/stripe";
import CustomDonationInput from "@/components/stripe/CustomDonationInput";
import * as config from "@/config";
import { cn } from "@/lib/utils";
import getStripe from "@/utils/get-stripejs";
import {
    EmbeddedCheckout,
    EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";
import type Stripe from "stripe";

import { Button } from "../ui/button";

interface CheckoutFormProps {
    //@ts-expect-error trust me bro
    uiMode: Stripe.Checkout.SessionCreateParams.UiMode;
    onClick: MouseEventHandler<HTMLButtonElement>;
}

export default function CheckoutForm(props: CheckoutFormProps): JSX.Element {
    const [loading] = useState<boolean>(false);
    const [input, setInput] = useState<{ customDonation: number }>({
        customDonation: 5,
    });
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [clicked, setClicked] = useState(false);

    const handleClick = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        setClicked(true);
        props.onClick(e);
    };

    const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (
        e,
    ): void =>
        setInput({
            ...input,
            [e.currentTarget.name]: e.currentTarget.value,
        });

    const formAction = async (data: FormData): Promise<void> => {
        const uiMode = data.get(
            "uiMode",
            //@ts-expect-error trust me bro
        ) as Stripe.Checkout.SessionCreateParams.UiMode;
        const { client_secret, url } = await createCheckoutSession(data);

        if (uiMode === "embedded") return setClientSecret(client_secret);

        window.location.assign(url as string);
    };

    return (
        <>
            <form action={formAction} className={cn(clicked && "hidden")}>
                <input type="hidden" name="uiMode" value={props.uiMode} />
                <CustomDonationInput
                    className={cn("checkout-style hidden", clicked && "hidden")}
                    name="customDonation"
                    min={config.MIN_AMOUNT}
                    max={config.MAX_AMOUNT}
                    step={config.AMOUNT_STEP}
                    currency={config.CURRENCY}
                    onChange={handleInputChange}
                    value={input.customDonation}
                />

                <div
                    className={cn(
                        "flex-center flex-col space-y-2 mx-4 text-center",
                        clicked && "hidden",
                    )}
                >
                    <Button
                        variant={"secondary"}
                        className={cn(
                            "border-2 border-gray-400 w-full flex items-center space-x-2",
                            clicked && "hidden",
                        )}
                        disabled={loading}
                        type="submit"
                        onClick={handleClick}
                    >
                        <img
                            src="/usa.webp"
                            className="w-6 h-6 object-contain"
                        />
                        <p className="text-lg"> Pay through stripe</p>
                    </Button>
                    <p
                        className={cn(
                            "text-sm text-gray-400",
                            clicked && "hidden",
                        )}
                    >
                        Stripe is a secure platform for all payments
                    </p>
                </div>
            </form>

            <div className="flex justify-start flex-center pb-4">
                {clientSecret ? (
                    <EmbeddedCheckoutProvider
                        stripe={getStripe()}
                        options={{ clientSecret }}
                    >
                        <EmbeddedCheckout />
                    </EmbeddedCheckoutProvider>
                ) : null}
            </div>
        </>
    );
}
