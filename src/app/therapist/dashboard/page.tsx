import { Button } from "@/components/ui/button";
import { checkRole } from "@/utils/roles";
import { auth } from "@clerk/nextjs/server";

import { ProfileForm } from "./ProfileForm";

export default async function AdminDashboard() {
    const { userId } = auth();

    if (!checkRole("admin") && !checkRole("therapist")) {
        return (
            <div className="text-left space-y-4">
                <p>
                    You are not authorized to view this page. If you are
                    attempting to view this page as a Therapist, please wait for
                    an admin to validate your account.
                </p>
                <p>User ID: {userId}</p>
                <a href="/">
                    <Button variant={"link"}>Return to Home</Button>
                </a>
            </div>
        );
    }

    return (
        <div className="flex flex-col space-y-8">
            <div className="space-y-4">
                <h1>This is the therapist dashboard</h1>
                <p>
                    This page is restricted to users with the 'therapist' role.
                    You can update your account info here.{" "}
                    <b>You may need to refresh to see changes reflected. </b>
                </p>
                <p>
                    Make sure to also upload your profile image in the separate
                    upload below!
                </p>
                <p>User ID: {userId}</p>
            </div>

            <div>
                <ProfileForm />
            </div>
        </div>
    );
}

