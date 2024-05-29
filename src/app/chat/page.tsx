"use client";

import "@sendbird/uikit-react/dist/index.css";

import React from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import GroupChannel from "@sendbird/uikit-react/GroupChannel";
import GroupChannelList from "@sendbird/uikit-react/GroupChannelList";
import SendbirdProvider from "@sendbird/uikit-react/SendbirdProvider";

import { trpc } from "../_trpc/client";
import { APP_ID } from "./const";

const ChatPage = () => {
    const searchParams = useSearchParams();
    const chatId = searchParams.get("chatId");

    const [currentChannelUrl, setCurrentChannelUrl] = React.useState<
        string | undefined
    >(chatId ?? undefined);

    const { userId, isLoaded } = useAuth();

    const { data: userData, isLoading } = trpc.getUser.useQuery(
        { id: userId },
        {
            refetchInterval: (data) => (data ? false : 500),
        },
    );

    const singleUserData = Array.isArray(userData) ? userData[0] : userData;

    if (!isLoaded || !userId || !userData || isLoading || !singleUserData) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <div className="flex min-w-screen h-screen max-h-[calc(100vh-100px)]">
                {/* TODO userId is the sendbirdId on user, nickname is their name */}
                <SendbirdProvider
                    appId={APP_ID}
                    userId={singleUserData.sendbirdId!}
                    nickname={
                        //@ts-expect-error patientData exists
                        userData.patientData
                            ? //@ts-expect-error patientData exists
                              userData.patientData.name
                            : //@ts-expect-error therapistData exists
                              userData.therapistData.name ?? ""
                    }
                >
                    {!currentChannelUrl ? (
                        <GroupChannelList
                            disableAutoSelect={true}
                            selectedChannelUrl={currentChannelUrl}
                            onChannelCreated={(channel) => {
                                setCurrentChannelUrl(channel.url);
                            }}
                            onChannelSelect={(channel) => {
                                setCurrentChannelUrl(channel?.url);
                            }}
                        />
                    ) : (
                        <div className="flex flex-col space-y-2 w-full">
                            <Button
                                className="p-2 w-full"
                                variant={"outline"}
                                onClick={() => setCurrentChannelUrl("")}
                            >
                                Back
                            </Button>
                            <GroupChannel channelUrl={currentChannelUrl!} />
                        </div>
                    )}
                </SendbirdProvider>
            </div>
        </>
    );
};

export default ChatPage;

