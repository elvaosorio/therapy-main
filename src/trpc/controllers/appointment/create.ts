import { createGCalEvent } from "@/actions/gcal";
import db from "@/db";
import { publicProcedure } from "@/trpc/trpc";
import { $Enums } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const createAppointment = publicProcedure
    .input(
        z
            .object({
                userId: z.string(),
                appointmentType: z.string(),
                therapistId: z.string(),
                startTime: z.coerce.date(),
                endTime: z.coerce.date(),
                notes: z.string().nullish(),
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
        if (existingUser.role !== "Patient") {
            throw new TRPCError({ code: "BAD_REQUEST" });
        }

        const therapist = await db.therapist.findFirst({
            where: {
                id: input.therapistId,
            },
        });

        if (!therapist) {
            throw new TRPCError({ code: "NOT_FOUND" });
        }

        const meetingLink = await createGCalEvent({
            title: "Appointment with " + therapist.name,
            description: input.notes ?? "",
            startTimeUTC: input.startTime,
            endTimeUTC: input.endTime,
        });

        if (!meetingLink) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to create meeting link",
            });
        }

        return db.appointment.create({
            data: {
                appointmentType:
                    input.appointmentType as $Enums.AppointmentType,
                therapistId: input.therapistId,
                startTime: input.startTime,
                endTime: input.endTime,
                notes: input.notes ?? "",
                patientId: existingUser.id,
                meetingLink: meetingLink,
            },
        });
    });
