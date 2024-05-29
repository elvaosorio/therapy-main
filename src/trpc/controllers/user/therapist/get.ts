import db from "@/db";
import { publicProcedure } from "@/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const getTherapist = publicProcedure
    .input(
        z
            .object({
                id: z.string().nullish(),
            })
            .nullish(),
    )
    .query(async ({ input }) => {
        if (input?.id) {
            const therapist = db.therapist.findFirst({
                where: {
                    id: input.id,
                },
            });

            if (!therapist) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            return therapist;
        }

        return db.therapist.findMany();
    });
