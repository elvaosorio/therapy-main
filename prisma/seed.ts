import db from "@/db";
import logger from "@/trpc/util/logger";
import { Prisma } from "@prisma/client";
import { createSendBirdUser } from "@/actions/sendbird";

const users = [
    {
        id: "1",
        role: "Therapist"
    },
    {
        id: "2",
        role: "Therapist"
    },
    {
        id: "3",
        role: "Patient"
    },
    {
        id: "4",
        role: "Patient"
    },
    {
        id: "5",
        role: null
    }
] satisfies Prisma.UserCreateManyInput[];

const therapists = [
    {
        id: "1",
        userId: "1",
        name: "Dr. Therapist One",
        bio: "I am a therapist!",
        imagePath: "/img/profiles/default.jpg",
        ethnicity: "Venezuelan",
        country: "Venezuela",
        credentials: "PhD",
        yearsOfExperience: 10,
        languages: ["Spanish", "English"],
        focusTags: ["Relationships"]
    },
    {
        id: "2",
        userId: "2",
        name: "Dr. Therapist Two",
        bio: "I am also a therapist!",
        imagePath: "/img/profiles/default.jpg",
        ethnicity: "Ecuadorian",
        country: "Ecuador",
        credentials: "LCSW",
        yearsOfExperience: 5,
        languages: ["English", "Spanish"],
        focusTags: ["Anxiety"]
    }
] satisfies Prisma.TherapistCreateManyInput[];

const patients = [
    {
        id: "3",
        userId: "3",
        name: "Patient One",
        ageRangeStart: 18,
        ageRangeEnd: 24,
        gender: "Female",
        preferredLanguage: "English"
    },
    {
        id: "4",
        userId: "4",
        name: "Patient Two",
        ageRangeStart: 25,
        ageRangeEnd: 35,
        gender: "Male",
        preferredLanguage: "Spanish"
    }
] satisfies Prisma.PatientCreateManyInput[];

const appointments = [
    {
        id: 1,
        therapistId: "1",
        patientId: "3",
        isApproved: true,
        appointmentType: "Consultation",
        startTime: new Date(1704105600000), // January 1, 2024
        endTime: new Date(new Date(1704105600000).getTime() + 60 * 60000),
        notes: "This is a consultation!",
        meetingLink: "https://meet.google.com/abc-defg-hij"
    },
    {
        id: 2,
        therapistId: "2",
        patientId: "4",
        isApproved: false,
        appointmentType: "Therapy",
        startTime: new Date(),
        endTime: new Date(new Date().getTime() + 60 * 60000),
        notes: "This is a therapy session!",
        meetingLink: "https://meet.google.com/klm-nopq-rst"
    }
] satisfies Prisma.AppointmentCreateManyInput[];

const payments = [
    {
        id: 1,
        amount: 10.0,
        description: "This is a payment!",
        appointmentId: 1
    }
] satisfies Prisma.PaymentCreateManyInput[];

const reviews = [
    {
        id: 1,
        therapistId: "1",
        patientId: "3",
        rating: 5,
        comment: "This therapist is great!"
    }
] satisfies Prisma.ReviewCreateManyInput[];

async function assignSendbirdIds() {
    const createdUsers = await db.user.findMany(
        {
            include: {
                therapistData: true,
                patientData: true
            }
        }
    );

    for (const user of createdUsers) {
        let sendbirdUserName: string = "";
        if (user.therapistData?.name) {
            sendbirdUserName = user.therapistData?.name;
        } else if (user.patientData?.name) {
            sendbirdUserName = user.patientData?.name;
        }
        const sendbirdUser = await createSendBirdUser({ name: sendbirdUserName });

        await db.user.update({
            where: {
                id: user.id
            },
            data: {
                sendbirdId: sendbirdUser.user_id
            }
        });

        logger.info(`Assigned Sendbird ID ${sendbirdUser.user_id} to user: ${user.id}`);
    }
}

async function seed() {
    logger.info("Seeding database...");

    await db.user.createMany({ data: users });

    await db.therapist.createMany({ data: therapists });
    await db.patient.createMany({ data: patients });
    await db.appointment.createMany({ data: appointments });
    await db.payment.createMany({ data: payments });
    await db.review.createMany({ data: reviews });

    await assignSendbirdIds()
}

seed().then();

