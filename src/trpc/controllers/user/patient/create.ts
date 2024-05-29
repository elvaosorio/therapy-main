import { createSendBirdUser } from "@/actions/sendbird";
import db from "@/db";
import { publicProcedure } from "@/trpc/trpc";
import { $Enums } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const assignUserPatient = publicProcedure
    .input(
        z
            .object({
                userId: z.string(),
                name: z.string(),
                ageRangeStart: z.number(),
                ageRangeEnd: z.number(),
                gender: z.string(),
                preferredLanguage: z.string(),
            })
            .strict(),
    )
    .mutation(async ({ input }) => {
        const existingUser = await db.user.findFirst({
            where: {
                id: input.userId,
            },
        });

        if (!existingUser) {
            throw new TRPCError({ code: "NOT_FOUND" });
        }
        if (existingUser.role) {
            throw new TRPCError({ code: "BAD_REQUEST" });
        }

        const sendbirdUser = await createSendBirdUser({ name: input.name });

        return db.user.update({
            where: {
                id: input.userId,
            },
            data: {
                sendbirdId: sendbirdUser.user_id,
                role: "Patient",
                patientData: {
                    create: {
                        id: input.userId,
                        name: input.name,
                        ageRangeStart: input.ageRangeStart,
                        ageRangeEnd: input.ageRangeEnd,
                        gender: input.gender,
                        preferredLanguage:
                            input.preferredLanguage as $Enums.PreferredLanguage,
                    },
                },
            },
        });
    });
