"use client";

import { useSearchParams } from "next/navigation";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
    const searchParams = useSearchParams();
    const therapist = searchParams.get("therapist");

    return (
        <div className="flex-center py-16">
            <SignUp
                path="/sign-up"
                forceRedirectUrl={`/onboarding?therapist=${therapist}`}
                signInForceRedirectUrl={`/onboarding?therapist=${therapist}`}
                fallbackRedirectUrl={"/onboarding"}
            />
        </div>
    );
}

