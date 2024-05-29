"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    OnboardingAge,
    OnboardingGender,
    OnboardingLanguageToggleGroup,
    OnboardingName,
} from "@/components/onboarding/onboarding-components";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@clerk/nextjs";

import { trpc } from "../_trpc/client";

const ONBOARDING_STEPS = [
    {
        step: "name",
        title: "What should we call you?",
        subtitle: "enter your nickname or preferred name!",
        component: OnboardingName,
    },
    {
        step: "gender",
        title: "What do you identify as?",
        subtitle: "select an option below",
        component: OnboardingGender,
    },
    {
        step: "age",
        title: "What is your age?",
        subtitle: "select your age range",
        component: OnboardingAge,
    },
    // {
    //     step: "country",
    //     title: "Where are you?",
    //     subtitle: "select the option closest to your location",
    //     component: OnboardingCountry,
    // },
    {
        step: "language",
        title: "What is your preferred language?",
        subtitle: "select the language you speak",
        component: OnboardingLanguageToggleGroup,
    },
    // {
    //     step: "bio",
    //     title: "Tell us a little about yourself?",
    //     subtitle: "write one or two lines",
    //     component: OnboardingBio,
    // },
];

const Page = () => {
    const [stage, setStage] = useState(0);
    /**
     * 0. Name
     * 1. Gender
     * 2. Age
     * 3. Language
     */
    const [data, setData] = useState<string[]>([]);
    const { toast } = useToast();

    const router = useRouter();
    const searchParams = useSearchParams();
    const therapist = searchParams.get("therapist");

    const { isLoaded, userId } = useAuth();
    const { mutate: createUser } = trpc.createUser.useMutation();
    const { mutate: addUserDetails } = trpc.assignUserPatient.useMutation();

    // In case the user signs out while on the page.
    if (!isLoaded || !userId) {
        return null;
    }

    if (!userId) {
        router.push("/");
    }

    const handleClick = () => {
        setStage((prev) => prev + 1);
    };

    const handleComplete = () => {
        createUser(
            { id: userId },
            {
                onSuccess: () => {
                    // console.log("Success creating user:", successData);

                    addUserDetails(
                        {
                            userId: userId,
                            name: data[0],
                            gender: data[1],
                            ageRangeStart: data[2].includes("+")
                                ? 65
                                : Number(data[2].split("-")[0]),
                            ageRangeEnd: data[2].includes("+")
                                ? 100
                                : Number(data[2].split("-")[1]),
                            preferredLanguage: data[3],
                        },
                        {
                            onSuccess: (data: unknown) => {
                                console.log(
                                    "Success adding user details:",
                                    data,
                                );

                                if (therapist !== "null") {
                                    router.push(`/booking/${therapist}`);
                                } else {
                                    router.push("/");
                                }
                            },
                            onError: (err: unknown) => {
                                console.error(
                                    "Error adding user details:",
                                    err,
                                );
                                toast({
                                    variant: "destructive",
                                    title: "Uh oh! Something went wrong.",
                                    description:
                                        "There was a problem with your request.",
                                    action: (
                                        <ToastAction altText="Try again">
                                            Try again
                                        </ToastAction>
                                    ),
                                });
                            },
                        },
                    );
                },
                onError: (err: unknown) => {
                    console.error("Error creating user:", err);
                    toast({
                        variant: "destructive",
                        title: "Uh oh! Something went wrong.",
                        description: "There was a problem with your request.",
                        action: (
                            <ToastAction altText="Try again">
                                Try again
                            </ToastAction>
                        ),
                    });
                },
            },
        );
    };

    const CurrentComponent = ONBOARDING_STEPS[stage].component;

    return (
        <div className="flex-between flex-col p-4 min-h-[calc(100vh-56px)]">
            <div className="w-full flex flex-col justify-start">
                <div className="space-y-2 pt-8 mb-16">
                    <h1 className="text-3xl font-bold">
                        {ONBOARDING_STEPS[stage].title}
                    </h1>
                    <h2 className="text-base text-gray-600 font-normal">
                        {ONBOARDING_STEPS[stage].subtitle}
                    </h2>
                </div>

                <CurrentComponent
                    setData={setData}
                    index={stage}
                    handleContinue={handleClick}
                />
            </div>

            <div className="flex-center flex-col w-full">
                <Button
                    variant={"link"}
                    onClick={() => router.push("/therapist/dashboard")}
                    className="mb-8"
                >
                    If you're a therapist, click here instead
                </Button>
                {stage === ONBOARDING_STEPS.length - 1 ? (
                    <Button
                        disabled={!data[ONBOARDING_STEPS.length - 1]}
                        onClick={handleComplete}
                        className="mb-8"
                    >
                        Complete Sign-in
                    </Button>
                ) : (
                    <Button
                        className="w-full mb-8"
                        onClick={handleClick}
                        disabled={
                            stage === ONBOARDING_STEPS.length - 1 ||
                            !data[stage]
                        }
                    >
                        Continue
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Page;

