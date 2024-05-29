import { createAppointment } from "@/trpc/controllers/appointment/create";
import { getAppointment } from "@/trpc/controllers/appointment/get";
import { updateAppointment } from "@/trpc/controllers/appointment/update";
import { createPayment } from "@/trpc/controllers/payment/create";
import { getPayment } from "@/trpc/controllers/payment/get";
import { createReview } from "@/trpc/controllers/review/create";
import { getReview } from "@/trpc/controllers/review/get";
import { createUser } from "@/trpc/controllers/user/create";
import { getUser } from "@/trpc/controllers/user/get";
import { assignUserPatient } from "@/trpc/controllers/user/patient/create";
import { getPatient } from "@/trpc/controllers/user/patient/get";
import { assignUserTherapist } from "@/trpc/controllers/user/therapist/create";
import { getTherapist } from "@/trpc/controllers/user/therapist/get";
import { updateTherapist } from "@/trpc/controllers/user/therapist/update";

import { router } from "./trpc";
import { getChat } from "@/trpc/controllers/chat/get";

export const appRouter = router({
    /**
     * user
     */
    createUser,
    getUser,

    /**
     * create user details
     */
    assignUserPatient,
    assignUserTherapist,

    /**
     * chat
     */
    getChat,

    /**
     * reviews
     */
    createReview,
    getReview,

    /**
     * payment
     */
    createPayment,
    getPayment,

    /**
     * therapists
     */
    getTherapist,
    updateTherapist,

    /**
     * patients
     */
    getPatient,

    /**
     * appointments
     */
    createAppointment,
    getAppointment,
    updateAppointment
});

export type AppRouter = typeof appRouter;
