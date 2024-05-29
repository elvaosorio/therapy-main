import { calendar_v3, google } from "googleapis";

// import credentials from "./credentials.json";

import Schema$Event = calendar_v3.Schema$Event;

interface createGCalEventParams {
    title: string;
    description: string;
    startTimeUTC: Date;
    endTimeUTC: Date;
    attendeeEmails?: string[];
}

const createGCalEvent = async (params: createGCalEventParams) => {
    return await createGCalEventHelper({
        summary: params.title,
        description: params.description,
        start: {
            dateTime: params.startTimeUTC.toISOString(),
            timeZone: "UTC",
        },
        end: {
            dateTime: params.endTimeUTC.toISOString(),
            timeZone: "UTC",
        },
        reminders: {
            useDefault: true,
        },
        attendees: params.attendeeEmails?.map((email) => ({
            email,
        })),
        conferenceData: {
            createRequest: {
                requestId: new Date().toISOString(),
                conferenceSolutionKey: {
                    type: "hangoutsMeet",
                },
            },
        },
    });
};

const createGCalEventHelper = async (gCalEvent: Schema$Event) => {
    const client = new google.auth.JWT({
        email: process.env.CLIENT_EMAIL,
        key: process.env.PRIVATE_KEY,
        keyId: process.env.PRIVATE_KEY_ID,
        clientId: process.env.CLIENT_ID,
        scopes: [
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/calendar.events",
            "https://www.googleapis.com/auth/drive.readonly",
            "https://www.googleapis.com/auth/meetings.space.readonly",
            "https://www.googleapis.com/auth/meetings.space.created",
        ],
        subject: "admin@almacura.me",
    });

    const calendar = google.calendar({ version: "v3" });

    const res = await calendar.events.insert({
        calendarId: "admin@almacura.me",
        requestBody: gCalEvent,
        auth: client,
        conferenceDataVersion: 1,
    });

    return res.data.hangoutLink;
};

export { createGCalEvent };

