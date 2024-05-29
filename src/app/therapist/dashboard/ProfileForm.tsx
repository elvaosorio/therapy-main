"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ToastAction } from "@/components/ui/toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "@/components/ui/use-toast";
import { UploadButton } from "@/utils/uploadthing";
import { useAuth } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

function timeToDate(time: string) {
    // Create a new Date object
    const date = new Date();

    // Extract hours and minutes from the time string
    const [timePart, period] = time.split(" ");
    // eslint-disable-next-line prefer-const
    let [hours, minutes] = timePart.split(":").map(Number);

    // Convert to 24-hour format if necessary
    if (period === "PM" && hours < 12) {
        hours += 12;
    } else if (period === "AM" && hours === 12) {
        hours = 0;
    }

    // Set the hours and minutes on the Date object
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
}

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    bio: z.string().min(2, {
        message: "Bio must be at least 2 characters.",
    }),
    credentials: z.string().min(2, {
        message: "Credentials must be at least 2 characters.",
    }),
    imagePath: z.string({ message: "Must include image" }),
});

const TIMES = [
    {
        time: "8:00 AM",
    },
    {
        time: "9:00 AM",
    },
    {
        time: "10:00 AM",
    },
    {
        time: "11:00 AM",
    },
    {
        time: "12:00 PM",
    },
    {
        time: "1:00 PM",
    },
    {
        time: "2:00 PM",
    },
    {
        time: "3:00 PM",
    },
];

export function ProfileForm() {
    const router = useRouter();
    const { isLoaded, userId } = useAuth();

    if (!isLoaded || !userId) {
        return null;
    }

    if (!userId) {
        router.push("/");
    }

    const { data: therapistData, isLoading } = trpc.getTherapist.useQuery(
        { id: userId },
        {
            refetchInterval: (data) => (data || data === null ? false : 500),
        },
    );

    const cleanedTherapistData = Array.isArray(therapistData)
        ? therapistData[0]
        : therapistData;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: cleanedTherapistData?.name ?? "",
            bio: cleanedTherapistData?.bio ?? "",
            credentials: cleanedTherapistData?.credentials ?? "",
        },
    });

    const [uploadedImage, setUploadedImage] = useState("");

    const { mutate: createUser } = trpc.createUser.useMutation();
    const { data: userData, isLoading: isLoadingUser } = trpc.getUser.useQuery(
        { id: userId },
        {
            refetchInterval: (data) => (data || data === null ? false : 500),
        },
    );
    const { mutate: addTherapistDetails } =
        trpc.assignUserTherapist.useMutation();
    const { mutate: updateTherapistDetails } =
        trpc.updateTherapist.useMutation();

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (!userId) {
            console.error("No user id");
            return;
        }

        if (!userData) {
            createUser(
                { id: userId },
                {
                    onSuccess: () => {
                        // console.log("Success creating user:", successData);

                        addTherapistDetails(
                            {
                                userId: userId,
                                name: values.name,
                                bio: values.bio,
                                imagePath:
                                    uploadedImage ?? values.imagePath ?? "",
                                credentials: values.credentials,
                                yearsOfExperience: 1,
                                languages: ["English", "Spanish"],
                                focusTags: [],
                                ethnicity: "",
                                country: "",
                                availableTimes: times.map((time) =>
                                    timeToDate(time).toString(),
                                ),
                            },
                            {
                                onSuccess: (data: unknown) => {
                                    console.log(
                                        "Success adding user details:",
                                        data,
                                    );

                                    toast({
                                        variant: "default",
                                        title: "Success!",
                                        description: "Details added.",
                                        action: (
                                            <ToastAction altText="Close">
                                                Close
                                            </ToastAction>
                                        ),
                                    });
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
        } else {
            updateTherapistDetails(
                {
                    id: userId,
                    name: values.name,
                    bio: values.bio,
                    imagePath: uploadedImage ?? values.imagePath ?? "",
                    credentials: values.credentials,
                    yearsOfExperience: 1,
                    languages: ["English", "Spanish"],
                    focusTags: [],
                    ethnicity: "",
                    country: "",
                    availableTimes: times.map((time) =>
                        timeToDate(time).toString(),
                    ),
                },
                {
                    onSuccess: (data: unknown) => {
                        console.log("Success updating user details:", data);
                        toast({
                            variant: "default",
                            title: "Success!",
                            description: "Details updated.",
                            action: (
                                <ToastAction altText="Close">Close</ToastAction>
                            ),
                        });
                    },
                    onError: (err: unknown) => {
                        console.error("Error updating user details:", err);
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
        }
    }

    const [times, setTimes] = useState<string[]>([]);

    const handleChange = (value: string[]) => {
        setTimes(value);
    };

    useEffect(() => {
        if (cleanedTherapistData) {
            form.reset({
                name: cleanedTherapistData.name,
                bio: cleanedTherapistData.bio,
                credentials: cleanedTherapistData.credentials,
                imagePath: cleanedTherapistData.imagePath,
            });
        }
    }, [therapistData, form]);

    if (!isLoaded || isLoading || isLoadingUser) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <h2 className="font-bold">Create/Update Profile:</h2>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-2"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input placeholder="your name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name. Please use
                                    your preferred name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Something about you and your background."
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="credentials"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Credentials</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="ex: Anxiety Therapist, PhD"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Your credentials and/or specific occupation.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <ToggleGroup
                        type="multiple"
                        className="grid grid-cols-3 max-h-[480px] overflow-scroll"
                        onValueChange={handleChange}
                    >
                        {TIMES.map((item) => (
                            <ToggleGroupItem
                                value={item.time}
                                className="w-full text-left flex justify-start py-6"
                                variant={"outline"}
                                key={item.time}
                            >
                                <div className="flex items-center space-x-2">
                                    <p>{item.time}</p>
                                </div>
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>

                    <Button type="submit">Submit</Button>
                </form>
            </Form>

            <h2 className="font-bold mt-8 mb-4">
                Create/Upload Profile Image:
            </h2>

            <UploadButton
                appearance={{
                    button: "ut-ready:bg-green-500 ut-uploading:cursor-not-allowed rounded-r-none bg-red-500 bg-none after:bg-orange-400",
                    container:
                        "w-max flex-row rounded-md border-cyan-300 bg-slate-800 mb-4",
                    allowedContent:
                        "flex h-8 flex-col items-center justify-center px-2 text-white",
                }}
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                    // Do something with the response
                    console.log("Files: ", res);
                    setUploadedImage(res[0].url);

                    if (userData) {
                        updateTherapistDetails(
                            {
                                id: userId,
                                imagePath: res[0].url ?? "",
                            },
                            {
                                onSuccess: (data: unknown) => {
                                    console.log(
                                        "Success updating user profile image to db:",
                                        data,
                                    );
                                },
                                onError: (err: unknown) => {
                                    console.error(
                                        "Error updating user profile image:",
                                        err,
                                    );
                                },
                            },
                        );
                    }

                    // alert("Upload Completed");
                    console.log("Upload completed");
                }}
                onUploadError={(error: Error) => {
                    // Do something with the error.
                    console.error("Error:", error.message);
                    // alert(`ERROR! ${error.message}`);
                }}
            />
        </>
    );
}

