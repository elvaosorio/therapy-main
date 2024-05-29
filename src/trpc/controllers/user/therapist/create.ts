import { createSendBirdUser } from "@/actions/sendbird";
import db from "@/db";
import { publicProcedure } from "@/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const assignUserTherapist = publicProcedure
    .input(
        z
            .object({
                userId: z.string(),
                name: z.string(),
                bio: z.string(),
                imagePath: z.string(),
                credentials: z.string(),
                yearsOfExperience: z.number(),
                languages: z.array(z.string()),
                focusTags: z.array(z.string()),
                ethnicity: z.string(),
                country: z.string().nullish(),
                availableTimes: z.array(
                    z.string().transform((str) => new Date(str)),
                ),
            })
            .strict(),
    )
    .mutation(async ({ input }) => {
        const existingUser = await db.user.findFirst({
            where: {
                id: input.userId,
            },
        });

        console.log(input.availableTimes);

        if (!existingUser) {
            throw new TRPCError({ code: "NOT_FOUND" });
        }

        console.log(existingUser);

        // ! talk to andrew about this
        // if (existingUser.role) {
        //     throw new TRPCError({ code: "BAD_REQUEST" });
        // }

        const sendbirdUser = await createSendBirdUser({ name: input.name });

        return db.user.update({
            where: {
                id: input.userId,
            },
            data: {
                sendbirdId: sendbirdUser.user_id,
                role: "Therapist",
                therapistData: {
                    create: {
                        id: input.userId,
                        name: input.name,
                        bio: input.bio,
                        imagePath: input.imagePath,
                        ethnicity: input.ethnicity,
                        country: input.country,
                        credentials: input.credentials,
                        yearsOfExperience: input.yearsOfExperience,
                        languages: input.languages,
                        focusTags: input.focusTags,
                        availableTimes: input.availableTimes,
                    },
                },
            },
        });
    });

