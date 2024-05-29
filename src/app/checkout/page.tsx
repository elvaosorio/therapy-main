"use client";

import { useState } from "react";
import CheckoutForm from "@/components/stripe/CheckoutForm";
import { cn } from "@/lib/utils";

export default function DonatePage(): JSX.Element {
    const [showCheckout, setShowCheckout] = useState(false);

    const handleClick = () => {
        setShowCheckout(true);
    };

    return (
        <div className="min-h-[calc(100vh-56px)] space-y-14">
            <div
                className={cn(
                    "flex-center flex-col text-center pt-8 mt-[40%] space-y-3",
                    showCheckout && "hidden",
                )}
                style={showCheckout ? { display: "none" } : {}}
            >
                <h1
                    className={cn(
                        "text-2xl font-semibold",
                        showCheckout && "hidden",
                    )}
                >
                    You're almost there! Make a one-time $5 payment
                </h1>
                <p
                    className={cn(
                        "text-sm text-gray-500",
                        showCheckout && "hidden",
                    )}
                >
                    Make a small payment to support our therapists for the best
                    possible session!
                </p>
            </div>

            <CheckoutForm uiMode="embedded" onClick={handleClick} />
        </div>
    );
}
