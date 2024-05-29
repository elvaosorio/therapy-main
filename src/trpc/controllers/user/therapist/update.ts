import db from "@/db";
import { publicProcedure } from "@/trpc/trpc";
import { TRPCError } from "@trpc/server";
import _ from "lodash";
import { z } from "zod";

export const updateTherapist = publicProcedure
    .input(
        z
            .object({
                id: z.string(),
                name: z.string().nullish(),
                bio: z.string().nullish(),
                imagePath: z.string().nullish(),
                credentials: z.string().nullish(),
                yearsOfExperience: z.number().nullish(),
                languages: z.array(z.string()).nullish(),
                focusTags: z.array(z.string()).nullish(),
                ethnicity: z.string().nullish(),
                country: z.string().nullish().nullish(),
                availableTimes: z
                    .array(z.string().transform((str) => new Date(str)))
                    .nullish(),
            })
            .strict(),
    )
    .mutation(async ({ input }) => {
        const existingUser = await db.therapist.findFirst({
            where: {
                id: input.id,
            },
        });

        if (!existingUser) {
            throw new TRPCError({ code: "NOT_FOUND" });
        }

        const filteredInput = _.omitBy(input, _.isNull);

        return db.therapist.update({
            where: {
                id: input.id,
            },
            data: filteredInput,
        });
    });
