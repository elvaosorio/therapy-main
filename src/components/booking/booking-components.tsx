"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Therapist } from "@prisma/client";

// import { ArrowUpRightFromCircle } from "lucide-react";

// import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

interface BookingComponentProps {
    setData: Dispatch<SetStateAction<string[]>>;
    index: number;
    handleContinue: () => void;
    therapistData: Therapist;
}

export const BookingDate = ({
    setData,
    index,
    therapistData,
}: BookingComponentProps) => {
    const [date, setDate] = useState<Date | undefined>(new Date());

    const handleChange = (date: Date | undefined) => {
        setDate(date);

        setData((prev) => {
            const newData = [...prev];
            newData[index] = date?.toDateString() ?? "";
            return newData;
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex-between rounded-md border border-#E3E3E3 p-2">
                <div className="flex flex-row items-center space-x-2">
                    {/* <img
                        src="/usa.webp"
                        className="w-10 h-10 aspect-square object-cover rounded-full"
                    /> */}
                    <div className="flex flex-col">
                        <div className="flex space-x-2 items-center">
                            <h1 className="text-xl">{therapistData.name}</h1>
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
                                {therapistData.credentials}
                            </p>
                        </div>
                    </div>
                </div>
                {/* <Button className="w-10 h-10 p-3" variant={"secondary"}>
                    <ArrowUpRightFromCircle />
                </Button> */}
            </div>

            <Calendar
                mode="single"
                selected={date}
                onSelect={handleChange}
                required
                //@ts-expect-error Added type; didn't want to extend non-static CalendarProps rn
                disabledBefore={true}
                className="rounded-md border flex-center"
            />
        </div>
    );
};

// const TIMES = [
//     {
//         time: "7:00 AM",
//     },
//     {
//         time: "8:00 AM",
//     },
//     {
//         time: "9:00 AM",
//     },
//     {
//         time: "10:00 AM",
//     },
//     {
//         time: "11:00 AM",
//     },
//     {
//         time: "12:00 PM",
//     },
// ];

export const BookingTime = ({
    setData,
    index,
    therapistData,
}: BookingComponentProps) => {
    const handleChange = (value: string) => {
        setData((prev) => {
            const newData = [...prev];
            newData[index] = value;
            return newData;
        });
    };

    if (therapistData.availableTimes.length <= 0) {
        return <p>No available times found...</p>;
    }

    return (
        <ToggleGroup
            type="single"
            className="grid grid-cols-3 max-h-[480px] overflow-scroll"
            onValueChange={handleChange}
        >
            {therapistData.availableTimes.map((item) => (
                <ToggleGroupItem
                    value={new Date(item).getHours().toString()}
                    className="w-full text-left flex justify-start py-6"
                    variant={"outline"}
                    key={new Date(item).getHours().toString()}
                >
                    <div className="flex items-center space-x-2">
                        <p>
                            {new Date(item).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </p>
                    </div>
                </ToggleGroupItem>
            ))}
        </ToggleGroup>
    );
};

