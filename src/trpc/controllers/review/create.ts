import db from "@/db";
import { publicProcedure } from "@/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const createReview = publicProcedure
    .input(
        z.object({
            userId: z.string(),
            rating: z.number(),
            comment: z.string().nullish(),
            therapistId: z.string(),
        }),
    )
    .mutation(async ({ input }) => {
        const existingUser = await db.user.findFirst({
            where: {
                id: input.userId,
            },
        });

        if (!existingUser) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "User not found",
            });
        }
        if (existingUser.role !== "Patient") {
            throw new TRPCError({
                code: "BAD_REQUEST",
                message: "Only patients can create reviews",
            });
        }

        const therapist = await db.user.findFirst({
            where: {
                id: input.therapistId,
                role: "Therapist",
            },
        });

        if (!therapist) {
            throw new TRPCError({
                code: "NOT_FOUND",
                message: "Therapist not found",
            });
        }

        return db.review.create({
            data: {
                rating: input.rating,
                comment: input.comment,
                patientId: existingUser.id,
                therapistId: input.therapistId,
            },
        });
    });
