"use client";

import { useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { formatAmountForDisplay } from "@/utils/stripe-helpers";
import { Banknote, Calendar, Clock, MapPin } from "lucide-react";
import Stripe from "stripe";

const SuccessDetails = ({
    paymentIntent,
}: {
    paymentIntent: Stripe.PaymentIntent;
}) => {
    const router = useRouter();
    const meetingId = window.localStorage.getItem("ac_mid");

    if (!meetingId) {
        router.push("/");
    }

    const { data: meetingData, isLoading } = trpc.getAppointment.useQuery(
        { id: Number(meetingId) },
        {
            refetchInterval: (data) => {
                return data ? false : 500;
            },
        },
    );

    if (!meetingData || isLoading) {
        return <p>Loading...</p>;
    }

    const cleanedMeetingData = Array.isArray(meetingData)
        ? meetingData[0]
        : meetingData;

    return (
        <div className="border-2 border-gray-600 rounded-lg p-4 space-y-4">
            <div className="flex flex-row items-center space-x-2">
                {/* <img
                    src="/usa.webp"
                    className="w-10 h-10 aspect-square object-cover rounded-full"
                /> */}
                <div className="flex flex-col">
                    <div className="flex space-x-2 items-center">
                        <h1 className="text-xl">
                            {cleanedMeetingData?.therapist?.name}
                        </h1>
                        {/* <div>
                            <img
                                src="/usa.webp"
                                alt="usa"
                                className="rounded-full w-4 aspect-square object-left object-cover"
                            />
                        </div> */}
                    </div>
                    <div>
                        <p className="text-sm font-normal text-gray-500">
                            {cleanedMeetingData.therapist.credentials}
                        </p>
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex space-x-2 items-center">
                    <Calendar />
                    <p>
                        {new Date(cleanedMeetingData.startTime).toDateString()}
                    </p>
                </div>
                <div className="flex space-x-2 items-center">
                    <Clock />
                    <p>
                        {new Date(
                            cleanedMeetingData.startTime,
                        ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>
                <div className="flex space-x-2 items-center">
                    <MapPin />
                    <p>Google Meet</p>
                </div>
                <div className="flex space-x-2 items-center">
                    <Banknote />
                    <p>
                        {formatAmountForDisplay(
                            paymentIntent.amount / 100,
                            "USD",
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SuccessDetails;

