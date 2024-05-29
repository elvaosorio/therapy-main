"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@clerk/nextjs";
import { Calendar, Clock } from "lucide-react";

import { trpc } from "../_trpc/client";

// const SESSIONS = [
//     {
//         id: 1,
//         therapist: "Jasmine Wu",
//         title: "Anxiety Therapist, PhD",
//         date: "Tues, May 02 2024",
//         time: "11:00 AM",
//     },
//     {
//         id: 2,
//         therapist: "Jasmine Wu",
//         title: "Anxiety Therapist, PhD",
//         date: "Tues, May 02 2024",
//         time: "11:00 AM",
//     },
//     {
//         id: 3,
//         therapist: "Jasmine Wu",
//         title: "Anxiety Therapist, PhD",
//         date: "Tues, May 02 2024",
//         time: "11:00 AM",
//     },
//     {
//         id: 4,
//         therapist: "Jasmine Wu",
//         title: "Anxiety Therapist, PhD",
//         date: "Tues, May 02 2024",
//         time: "11:00 AM",
//     },
// ];

const Page = () => {
    const { userId } = useAuth();

    const { data: appointmentData, isLoading } = trpc.getAppointment.useQuery(
        { patientId: userId },
        {
            refetchInterval: (data) => (data ? false : 500),
        },
    );

    if (!appointmentData || isLoading) {
        return <p>Loading...</p>;
    }

    const cleanedAppointmentData = Array.isArray(appointmentData)
        ? appointmentData
        : [appointmentData];

    const upcomingAppointments = cleanedAppointmentData
        .filter((item) => item.isApproved)
        .filter((item) => new Date(item.startTime) >= new Date())
        .sort((a, b) => (a.startTime > b.endTime ? 1 : -1));

    return (
        <div className="py-8 px-4">
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold">
                    Your scheduled sessions
                </h1>

                <h2 className="text-xl font-semibold">Upcoming sessions</h2>

                {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((item) => (
                        <div
                            className="border-2 border-gray-400 rounded-lg p-4 space-y-4"
                            key={item.id}
                        >
                            <div className="flex flex-row items-center space-x-2">
                                <img
                                    src="/usa.webp"
                                    className="w-10 h-10 aspect-square object-cover rounded-full"
                                />
                                <div className="flex flex-col">
                                    <div className="flex space-x-2 items-center">
                                        <h1 className="text-xl">
                                            {item.therapist.name}
                                        </h1>
                                        <div>
                                            <img
                                                src="/usa.webp"
                                                alt="usa"
                                                className="rounded-full w-4 aspect-square object-left object-cover"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-normal text-gray-500">
                                            {item.therapist.credentials}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-2">
                                <div className="flex space-x-2 items-center">
                                    <Calendar />
                                    <p>
                                        {new Date(
                                            item.startTime,
                                        ).toDateString()}
                                    </p>
                                </div>
                                <div className="flex space-x-2 items-center">
                                    <Clock />
                                    <p>
                                        {new Date(
                                            item.startTime,
                                        ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <a href={item.meetingLink}>
                                    <Button className="w-full">
                                        Start session
                                    </Button>
                                </a>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No upcoming appointments</p>
                )}
            </div>
        </div>
    );
};

export default Page;

