import db from "@/db";
import { publicProcedure } from "@/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const getReview = publicProcedure
    .input(
        z
            .object({
                therapistId: z.string(),
            })
            .strict(),
    )
    .query(async ({ input }) => {
        const therapist = await db.therapist.findFirst({
            where: {
                id: input.therapistId,
            },
        });

        if (!therapist) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Therapist not found",
            });
        }

        return db.review.findMany({
            where: {
                therapistId: therapist.id,
            },
            include: {
                patient: {
                    select: {
                        name: true,
                    },
                },
            },
        });
    });
