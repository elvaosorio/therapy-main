"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";

const ContinueButton = () => {
    const router = useRouter();
    const { mutate: updateAppointment } = trpc.updateAppointment.useMutation();

    const handleClick = () => {
        const meetingId = window.localStorage.getItem("ac_mid");
        if (!meetingId) {
            alert("Something went wrong...");
        } else {
            updateAppointment({ id: Number(meetingId), isApproved: true });
            window.localStorage.removeItem("ac_mid");

            router.push("/summary");
        }
    };

    return (
        <Button className="w-full mb-8" onClick={handleClick}>
            Continue
        </Button>
    );
};

export default ContinueButton;
