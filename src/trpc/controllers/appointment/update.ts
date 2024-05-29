import db from "@/db";
import { publicProcedure } from "@/trpc/trpc";
import { TRPCError } from "@trpc/server";
import _ from "lodash";
import { z } from "zod";

export const updateAppointment = publicProcedure
    .input(
        z
            .object({
                id: z.number(),
                startTime: z.date().nullish(),
                endTime: z.date().nullish(),
                notes: z.string().nullish(),
                meetingLink: z.string().nullish(),
                appointmentType: z.string().nullish(),
                isApproved: z.boolean().nullish(),
            })
            .strict(),
    )
    .mutation(async ({ input }) => {
        const appointment = await db.appointment.findFirst({
            where: {
                id: input.id,
            },
        });

        if (!appointment) {
            throw new TRPCError({ code: "NOT_FOUND" });
        }

        const filteredInput = _.omitBy(input, _.isNull);

        return db.appointment.update({
            where: {
                id: input.id,
            },
            data: filteredInput,
        });
    });
