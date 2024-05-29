"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import {
    BookingDate,
    BookingTime,
} from "@/components/booking/booking-components";
import { Button } from "@/components/ui/button";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@clerk/nextjs";

function createDateObjects(dateTimeArray: string[]) {
    const startTime = new Date(dateTimeArray[0]);
    startTime.setHours(Number(dateTimeArray[1]));
    const endTime = new Date(startTime.getTime() + 1 * 60 * 60 * 1000);

    return [startTime, endTime];
}

const BOOKING_STEPS = [
    {
        step: "date",
        title: "Select a date for the session",
        subtitle: "In PST timezone",
        component: BookingDate,
    },
    {
        step: "time",
        title: "Choose a time",
        component: BookingTime,
    },
];

const Page = ({ params }: { params: { slug: string[] } }) => {
    const [stage, setStage] = useState(0);

    const [data, setData] = useState<string[]>([new Date().toDateString()]);
    const { mutate: createAppointment } = trpc.createAppointment.useMutation();
    const [creating, setCreating] = useState(false);

    const { data: therapistData, isLoading } = trpc.getTherapist.useQuery(
        { id: params.slug.toString() },
        {
            refetchInterval: (data) => (data ? false : 500),
        },
    );

    const singleTherapistData = Array.isArray(therapistData)
        ? therapistData[0]
        : therapistData;

    const { userId } = useAuth();

    const router = useRouter();

    if (!userId) {
        router.push("/sign-in");
    }

    const handleClick = () => {
        setStage((prev) => prev + 1);
    };

    const handleComplete = () => {
        setCreating(true);
        const [startTime, endTime] = createDateObjects(data);

        const startDate = new Date(startTime);
        const endDate = new Date(endTime);

        createAppointment(
            {
                userId: userId as string,
                appointmentType: "Consultation",
                therapistId: singleTherapistData?.id ?? "-1", // -1 should raise an error
                startTime: startDate,
                endTime: endDate,
            },
            {
                onSuccess: (successData: { id: number }) => {
                    // * persists state before and after Stripe payment
                    if (window) {
                        window.localStorage.setItem(
                            "ac_mid",
                            successData.id.toString(),
                        );
                    }

                    router.push(
                        `/checkout?meeting=${successData.id?.toString()}`,
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
                onSettled: () => {
                    setCreating(false);
                },
            },
        );
    };

    const CurrentComponent = BOOKING_STEPS[stage].component;

    if (isLoading || !therapistData) {
        return <p>Loading...</p>;
    }

    return (
        <div className="flex-between flex-col p-4 min-h-[calc(100vh-56px)]">
            <div className="w-full flex flex-col justify-start">
                <div className="space-y-2 mb-8">
                    <h1 className="text-3xl font-bold">
                        {BOOKING_STEPS[stage].title}
                    </h1>
                    <h2 className="text-sm text-gray-600 font-normal space-x-4 flex flex-row">
                        <p>
                            {BOOKING_STEPS[stage].subtitle ??
                                new Date(data[0]).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                        </p>

                        {!BOOKING_STEPS[stage].subtitle && (
                            <Button
                                className="text-sm font-semibold p-0 min-h-0 h-fit"
                                variant={"link"}
                                onClick={() => setStage((prev) => prev - 1)}
                            >
                                Update
                            </Button>
                        )}
                    </h2>
                </div>

                <CurrentComponent
                    setData={setData}
                    index={stage}
                    handleContinue={handleClick}
                    // Correct types for availableTimes
                    therapistData={
                        Array.isArray(therapistData)
                            ? {
                                  ...therapistData[0],
                                  availableTimes:
                                      therapistData[0].availableTimes.map(
                                          (item) => new Date(item),
                                      ),
                              }
                            : {
                                  ...therapistData,
                                  availableTimes:
                                      therapistData.availableTimes.map(
                                          (item) => new Date(item),
                                      ),
                              }
                    }
                />
            </div>

            {stage === BOOKING_STEPS.length - 1 ? (
                <Button
                    disabled={!data[BOOKING_STEPS.length - 1] || creating}
                    onClick={handleComplete}
                    className="w-full mb-8"
                >
                    Continue
                </Button>
            ) : (
                <Button
                    className="w-full mb-8"
                    onClick={handleClick}
                    disabled={
                        stage === BOOKING_STEPS.length - 1 || !data[stage]
                    }
                >
                    Continue
                </Button>
            )}
        </div>
    );
};

export default Page;

