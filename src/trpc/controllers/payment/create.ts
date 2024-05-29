import db from "@/db";
import { publicProcedure } from "@/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const createPayment = publicProcedure
    .input(
        z.object({
            amount: z.number(),
            description: z.string(),
            appointmentId: z.number(),
        }),
    )
    .mutation(async ({ input }) => {
        const appointment = await db.appointment.findFirst({
            where: {
                id: input.appointmentId,
            },
        });

        if (!appointment) {
            throw new TRPCError({ code: "NOT_FOUND" });
        }

        return db.payment.create({
            data: {
                amount: input.amount,
                description: input.description,
                appointmentId: input.appointmentId,
            },
        });
    });
