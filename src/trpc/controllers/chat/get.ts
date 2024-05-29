import db from "@/db";
import { publicProcedure } from "@/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createSendBirdChannel } from "@/actions/sendbird";

export const getChat = publicProcedure
    .input(
        z
            .object({
                patientId: z.string(),
                therapistId: z.string()
            }).strict()
    )
    .query(async ({ input }) => {
        const patient = await db.user.findFirst({
            where: {
                id: input.patientId
            }
        });

        if (!patient) {
            throw new TRPCError({ code: "NOT_FOUND" });
        }

        const therapist = await db.user.findFirst({
            where: {
                id: input.therapistId
            }
        });

        if (!therapist) {
            throw new TRPCError({ code: "NOT_FOUND" });
        }

        const existingChat = await db.chat.findFirst({
            where: {
                patientId: patient.id,
                therapistId: therapist.id
            }
        });

        if (!therapist.sendbirdId || !patient.sendbirdId) {
            throw new TRPCError({ code: "NOT_FOUND", message: "User does not have a Sendbird ID" });
        }

        if (existingChat) {
            return existingChat;
        } else {
            const createChannelResponse = await createSendBirdChannel({
                therapistSendbirdId: therapist.sendbirdId,
                patientSendbirdId: patient.sendbirdId
            });

            const url = createChannelResponse.channel_url;

            return db.chat.create({
                data: {
                    patientId: patient.id,
                    therapistId: therapist.id,
                    url: url
                }
            });
        }
    });
