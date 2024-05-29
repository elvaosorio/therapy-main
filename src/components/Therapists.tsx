"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { Therapist } from "@prisma/client";
import { FaCalendarPlus, FaMessage } from "react-icons/fa6";

import TherapistImage from "../../public/img/profiles/therapistDefault.jpg";
import { Button } from "./ui/button";

// interface Therapist {
//     id: string;
//     name: string;
//     languages: string[];
//     bio: string;
//     credentials: string;
// }

// const THERAPIST_DATA: Therapist[] = [
//     {
//         name: "Jasmine Wu",
//     },
//     { name: "Kevin Wu" },
//     { name: "Jack" },
//     { name: "XYZ" },
//     { name: "ABC" },
// ];

const TherapistCard = ({
    therapist,
    loggedIn,
    userId,
}: {
    therapist: Therapist;
    loggedIn: boolean;
    userId: string | null;
}) => {
    const router = useRouter();

    const handleClick = () => {
        if (!userId) {
            router.push("/sign-in");
        }

        if (!chatData || !chatData.url) {
            console.log("No chat url found...");
            return;
        }

        router.push(`/chat?chatId=${chatData ? chatData.url : ""}`);
    };

    const handleSchedule = () => {
        if (loggedIn) {
            router.push(`/booking/${therapist.id}`);
        } else {
            router.push(`/sign-in?therapist=${therapist.id}`);
        }
    };

    const { data: chatData } = trpc.getChat.useQuery(
        { patientId: userId ?? "-1", therapistId: therapist.id },
        {
            refetchInterval: (data) => (data || data == null ? false : 500),
        },
    );

    return (
        <div className={cn("my-4 min-w-full snap-center relative mx-12")}>
            <div
                className="flex flex-col overflow-scroll max-h-[calc(100vh-144px-24px-36px)] scrollbar-hide border-3 border p-3 rounded-3xl"
                style={{ border: "3px solid #E3E3E3" }}
            >
                <div>
                    {therapist.imagePath !== "" &&
                    therapist.imagePath !== "/img/profiles/default.jpg" ? ( // seed value
                        <img
                            src={therapist.imagePath}
                            className="min-h-[calc(100vh-150px-56px-48px-100px)] h-[calc(100vh-150px-56px-48px-100px)] object-cover rounded-lg mb-4"
                            alt="therapist profile image"
                        />
                    ) : (
                        <Image
                            src={TherapistImage}
                            className="min-h-[calc(100vh-150px-56px-48px-100px)] h-[calc(100vh-150px-56px-48px-100px)] object-cover rounded-lg mb-4"
                            alt="therapist profile image"
                        />
                    )}
                    <div className="">
                        <div className="flex space-y-3 my-4 flex-col items-start">
                            <div className="flex space-x-2 items-center">
                                <h1 className="text-4xl">{therapist.name}</h1>
                                {/* <div>
                                    <img
                                        src="/usa.webp"
                                        alt="usa"
                                        className="rounded-full w-6 aspect-square object-left object-cover"
                                    />
                                </div> */}
                            </div>
                            <div>
                                <p
                                    className="text-lg font-normal"
                                    style={{ color: "var(--lightGray)" }}
                                >
                                    {therapist.credentials}
                                </p>
                            </div>
                        </div>
                        <div className="text-base font-normal my-4 space-y-5">
                            {/* languages */}
                            <div className="flex flex-row space-x-2 items-center">
                                <p
                                    className="min-w-fit"
                                    style={{ color: "var(--lightGray)" }}
                                >
                                    Languages:
                                </p>
                                <div className="flex flex-row space-x-2 scrollbar-hide first-letter:rounded-3xl">
                                    {therapist.languages.map((item) => (
                                        <div
                                            className="rounded-full px-[10px] py-[6px] w-full min-w-fit"
                                            style={{
                                                boxShadow:
                                                    "4px 4px 0px #413D45",
                                                border: "2px solid #413D45",
                                                backgroundColor: "#F4F6FC",
                                            }}
                                            key={item}
                                        >
                                            <p
                                                className="text-sm whitespace-nowrap"
                                                key={item}
                                            >
                                                {item}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* about
                            <div className="flex flex-row space-x-2 items-center">
                                <p
                                    className="min-w-fit"
                                    style={{ color: "var(--lightGray)" }}
                                >
                                    About:
                                </p>
                                <div className="flex flex-row space-x-4 overflow-scroll scrollbar-hide">
                                    <div
                                        className="rounded-full px-[10px] py-[6px] w-full min-w-fit"
                                        style={{
                                            boxShadow: "4px 4px 0px #413D45",
                                            border: "2px solid #413D45",
                                            backgroundColor: "#F4F6FC",
                                        }}
                                    >
                                        <p className="text-sm whitespace-nowrap">
                                            ⛪️ &nbsp; Catholic
                                        </p>
                                    </div>
                                    <div
                                        className="rounded-full px-[10px] py-[6px] w-full min-w-fit"
                                        style={{
                                            boxShadow: "4px 4px 0px #413D45",
                                            border: "2px solid #413D45",
                                            backgroundColor: "#F4F6FC",
                                        }}
                                    >
                                        <p className="text-sm whitespace-nowrap">
                                            🍕 &nbsp;Foodie
                                        </p>
                                    </div>
                                    <div
                                        className="rounded-full px-[10px] py-[6px] w-full min-w-fit"
                                        style={{
                                            boxShadow: "4px 4px 0px #413D45",
                                            border: "2px solid #413D45",
                                            backgroundColor: "#F4F6FC",
                                        }}
                                    >
                                        <p className="text-sm whitespace-nowrap">
                                            💕&nbsp; Patient
                                        </p>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>

                <Separator className="my-4" />

                <div>
                    <div className="space-y-2">
                        <h3 className="text-2xl">About me</h3>
                        <p className="text-base font-normal leading-tight">
                            {therapist.bio}
                        </p>
                    </div>
                </div>

                <Separator className="my-4" />

                {/* <div className="mb-8">
                    <div className="space-y-2">
                        <h3 className="text-2xl">Background</h3>
                        <div className="w-full h-20 py-2 px-4 rounded-md border-2 flex flex-row items-center space-x-3">
                            <img
                                src="/usa.webp"
                                className="w-12 aspect-square object-cover"
                            />
                            <div>
                                <h6 className="font-bold text-lg">
                                    PhD. Neuroscience
                                </h6>
                                <p className="text-base font-normal">
                                    University of Spain
                                </p>
                            </div>
                        </div>
                        <div className="w-full h-20 py-2 px-4 rounded-md border-2 flex flex-row items-center space-x-3">
                            <img
                                src="/usa.webp"
                                className="w-12 aspect-square object-cover"
                            />
                            <div>
                                <h6 className="font-bold text-lg">
                                    PhD. Neuroscience
                                </h6>
                                <p className="text-base font-normal">
                                    University of Spain
                                </p>
                            </div>
                        </div>
                        <div className="w-full h-20 py-2 px-4 rounded-md border-2 flex flex-row items-center space-x-3">
                            <img
                                src="/usa.webp"
                                className="w-12 aspect-square object-cover"
                            />
                            <div>
                                <h6 className="font-bold text-lg">
                                    PhD. Neuroscience
                                </h6>
                                <p className="text-base font-normal">
                                    University of Spain
                                </p>
                            </div>
                        </div>
                    </div>
                </div> */}
            </div>

            {/* TODO: Link to proper sections */}
            <div className="absolute bottom-0 z-20 space-x-4 flex-center w-full bg-white py-4">
                <Button
                    className="flex-center space-x-2 px-2 w-full rounded-full"
                    style={{
                        backgroundColor: "var(--secondary)",
                        color: "#424242",
                    }}
                    onClick={handleClick}
                >
                    <FaMessage />
                    <p className="text-lg">Chat</p>
                </Button>

                <Button
                    className="flex-center space-x-2 px-2 py-4 w-full rounded-full"
                    onClick={handleSchedule}
                    style={{ backgroundColor: "var(--primary)" }}
                >
                    <FaCalendarPlus />
                    <p className="text-lg">Schedule</p>
                </Button>
            </div>
        </div>
    );
};

const Therapists = ({ loggedIn }: { loggedIn: boolean }) => {
    const { data: therapistData, isLoading } = trpc.getTherapist.useQuery(
        undefined,
        {
            refetchInterval: (data) => (data ? false : 500),
        },
    );
    const { userId, isLoaded } = useAuth();

    const cleanedTherapistData = Array.isArray(therapistData)
        ? therapistData
        : [therapistData];

    const [activeTherapist, setActiveTherapist] = useState(0);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            const container = containerRef.current;

            if (!container) {
                return;
            }

            const { scrollLeft, clientWidth } = container;

            const centerPosition = scrollLeft + clientWidth / 2;
            const activeIndex = Math.floor(centerPosition / clientWidth);

            setActiveTherapist(activeIndex);
        };

        const container = containerRef.current
            ? (containerRef.current as HTMLDivElement)
            : null;

        if (!container) {
            return;
        }

        container.addEventListener("scroll", handleScroll);

        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, [therapistData]);

    if (isLoading || !therapistData || !isLoaded) {
        return <p>Loading...</p>;
    }

    return (
        <div
            ref={containerRef}
            className="flex flex-row overflow-x-scroll snap-x snap-mandatory space-x-4 scrollbar-hide"
        >
            {cleanedTherapistData.map((item) =>
                item ? (
                    <TherapistCard
                        therapist={{
                            ...item,
                            availableTimes: item.availableTimes.map(
                                (time) => new Date(time),
                            ),
                        }}
                        key={item.name + item.id}
                        loggedIn={loggedIn}
                        userId={userId}
                    />
                ) : null,
            )}

            <div className="fixed bottom-5 flex flex-row gap-x-2 left-1/2 transform translate-x-[-75%]">
                {cleanedTherapistData.map((_, index) => (
                    <div
                        className={cn(
                            "rounded-full w-3 h-3 bg-gray-200",
                            index === activeTherapist && "bg-black",
                        )}
                        key={index}
                    />
                ))}
            </div>
        </div>
    );
};

export default Therapists;

