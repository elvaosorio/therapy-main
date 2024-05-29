import * as crypto from "node:crypto";
import db from "@/db";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const baseURL = `https://api-${process.env.SENDBIRD_APP_ID}.sendbird.com/v3`;

async function createSendBirdChannel(params: {
    therapistSendbirdId: string;
    patientSendbirdId: string;
}) {
    const therapist = await db.therapist.findFirstOrThrow({
        where: {
            user: {
                sendbirdId: params.therapistSendbirdId,
            },
        },
    });

    const patient = await db.patient.findFirstOrThrow({
        where: {
            user: {
                sendbirdId: params.patientSendbirdId,
            },
        },
    });

    const res = await axios.post(
        baseURL + "/group_channels",
        {
            user_ids: [params.therapistSendbirdId, params.patientSendbirdId],
            name: `${therapist.name} and ${patient.name} chat`,
            is_distinct: true,
        },
        {
            headers: {
                "Content-Type": "application/json",
                "Api-Token": process.env.SENDBIRD_API_KEY,
            },
        },
    );

    return res.data;
}

async function createSendBirdUser(params: { name: string }) {
    const res = await axios.post(
        baseURL + "/users",
        {
            user_id: crypto.randomUUID(),
            nickname: params.name,
            profile_url:
                "https://upload.wikimedia.org/wikipedia/commons/a/aa/Sin_cara.png",
        },
        {
            headers: {
                "Content-Type": "application/json",
                "Api-Token": process.env.SENDBIRD_API_KEY,
            },
        },
    );

    return res.data;
}

async function getSendBirdUser(userId: string) {
    const res = await axios.get(baseURL + `/users/${userId}`, {
        params: {
            include_unread_count: true,
        },
        headers: {
            "Content-Type": "application/json",
            "Api-Token": process.env.SENDBIRD_API_KEY,
        },
    });

    return res.data;
}

export { createSendBirdUser, getSendBirdUser, createSendBirdChannel };
