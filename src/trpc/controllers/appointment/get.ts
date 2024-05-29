import db from "@/db";
import { publicProcedure } from "@/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const getAppointment = publicProcedure
    .input(
        z
            .object({
                patientId: z.string().nullish(),
                id: z.number().nullish(),
            })
            .nullish(),
    )
    .query(async ({ input }) => {
        if (input?.patientId) {
            const patient = await db.user.findFirst({
                where: {
                    id: input.patientId,
                },
            });

            if (!patient) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            return db.appointment.findMany({
                where: {
                    patientId: patient.id,
                },
                include: {
                    therapist: true,
                    patient: true,
                },
            });
        } else if (input?.id) {
            const appointment = await db.appointment.findFirst({
                where: {
                    id: input.id,
                },
                include: {
                    therapist: true,
                    patient: true,
                },
            });

            if (!appointment) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            return appointment;
        }

        return db.appointment.findMany({
            include: {
                therapist: true,
                patient: true,
            },
        });
    });
