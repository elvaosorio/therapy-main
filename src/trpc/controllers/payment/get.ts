import db from "@/db";
import { publicProcedure } from "@/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const getPayment = publicProcedure
    .input(
        z
            .object({
                patientId: z.string().nullish(),
                paymentId: z.number().nullish(),
            })
            .strict(),
    )
    .query(async ({ input }) => {
        if (input.patientId) {
            const patient = await db.user.findFirst({
                where: {
                    id: input.patientId,
                },
            });

            if (!patient) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            return db.payment.findMany({
                where: {
                    appointment: {
                        patient: patient,
                    },
                },
            });
        } else if (input.paymentId) {
            const payment = await db.payment.findFirst({
                where: {
                    id: input.paymentId,
                },
            });

            if (!payment) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            return payment;
        }

        return db.payment.findMany();
    });
