"use client";

import { useSearchParams } from "next/navigation";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
    const searchParams = useSearchParams();
    const therapist = searchParams.get("therapist");

    return (
        <div className="flex-center py-16">
            <SignIn
                path="/sign-in"
                forceRedirectUrl={
                    therapist !== "null" && therapist
                        ? `/booking/${therapist}`
                        : "/"
                }
                fallbackRedirectUrl={"/"}
                signUpForceRedirectUrl={`/onboarding?therapist=${therapist}`}
            />
        </div>
    );
}
