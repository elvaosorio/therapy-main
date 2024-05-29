import db from "@/db";
import { publicProcedure } from "@/trpc/trpc";
import { z } from "zod";

export const createUser = publicProcedure
    .input(
        z.object({
            id: z.string(),
        }),
    )
    .mutation(async ({ input }) => {
        const existingUser = await db.user.findFirst({
            where: {
                id: input.id,
            },
        });

        if (existingUser) {
            return existingUser;
        }

        return db.user.create({
            data: {
                id: input.id,
            },
        });
    });
