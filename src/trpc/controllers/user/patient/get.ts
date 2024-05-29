import db from "@/db";
import { publicProcedure } from "@/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const getPatient = publicProcedure
    .input(
        z
            .object({
                id: z.string().nullish(),
            })
            .nullish(),
    )
    .query(async ({ input }) => {
        if (input?.id) {
            const patient = db.patient.findFirst({
                where: {
                    id: input.id,
                },
            });

            if (!patient) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            return patient;
        }

        return db.patient.findMany();
    });
