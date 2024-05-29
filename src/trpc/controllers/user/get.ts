import db from "@/db";
import { publicProcedure } from "@/trpc/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const getUser = publicProcedure
    .input(
        z
            .object({
                id: z.string().nullish(),
            })
            .nullish(),
    )
    .query(async ({ input }) => {
        if (input?.id) {
            const user = db.user.findFirst({
                where: {
                    id: input.id,
                },
                include: {
                    therapistData: true,
                    patientData: true,
                },
            });

            if (!user) {
                throw new TRPCError({ code: "NOT_FOUND" });
            }

            return user;
        }

        return db.user.findMany();
    });

