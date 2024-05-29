// import Link from "next/link";
// import Booking from "@/components/Booking";
// import { db } from "@/db";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// import { Loader2, Square } from "lucide-react";

import Therapists from "@/components/Therapists";
import { auth } from "@clerk/nextjs/server";

export default async function Home() {
    // const { getUser } = getKindeServerSession();
    // const user = await getUser();

    // const dbUser = user
    //     ? await db.user.findFirst({
    //           where: {
    //               id: user?.id,
    //           },
    //       })
    //     : null;
    const { userId } = auth();

    return (
        <main className="wrapper flex justify-center text-3xl md:text-5xl font-semibold min-h-[calc(100vh-6rem)] bg-white">
            <Therapists loggedIn={!!userId} />
        </main>
    );
}
