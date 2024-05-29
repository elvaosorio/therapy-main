import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { checkRole } from "@/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";

import { setRole } from "./_actions";
import { SearchUsers } from "./_search-users";

export default async function AdminDashboard(params: {
    searchParams: { search?: string };
}) {
    if (!checkRole("admin")) {
        redirect("/");
    }

    const query = params.searchParams.search;

    const users = query
        ? (await clerkClient.users.getUserList({ query })).data
        : [];

    return (
        <div className="flex flex-col space-y-2">
            <div>
                <h1>This is the admin dashboard</h1>
                <p>
                    This page is restricted to users with the 'admin' role. You
                    can change account roles here (make someone a therapist or
                    an admin).{" "}
                    <b>You may need to refresh to see changes reflected. </b>
                </p>
            </div>

            <p className="font-semibold">Query: {query}</p>
            <SearchUsers />

            {users && users.length > 0
                ? users?.map((user) => {
                      return (
                          <div key={user.id}>
                              <div className="flex flex-row gap-x-2">
                                  <div className="font-bold">
                                      {user.firstName} {user.lastName}
                                  </div>
                                  |
                                  <div>
                                      {
                                          user.emailAddresses.find(
                                              (email) =>
                                                  email.id ===
                                                  user.primaryEmailAddressId,
                                          )?.emailAddress
                                      }
                                  </div>
                              </div>

                              <div className="flex">
                                  <p className="font-semibold">Role:</p>&nbsp;
                                  {(user.publicMetadata.role as string) ??
                                      "user"}
                              </div>

                              <div className="flex flex-row gap-x-2 mt-2">
                                  <div>
                                      <form action={setRole}>
                                          <input
                                              type="hidden"
                                              value={user.id}
                                              name="id"
                                          />
                                          <input
                                              type="hidden"
                                              value="admin"
                                              name="role"
                                          />
                                          <Button
                                              type="submit"
                                              variant={"destructive"}
                                          >
                                              Make Admin
                                          </Button>
                                      </form>
                                  </div>
                                  <div>
                                      <form action={setRole}>
                                          <input
                                              type="hidden"
                                              value={user.id}
                                              name="id"
                                          />
                                          <input
                                              type="hidden"
                                              value="therapist"
                                              name="role"
                                          />
                                          <Button type="submit">
                                              Make Therapist
                                          </Button>
                                      </form>
                                  </div>
                                  <div>
                                      <form action={setRole}>
                                          <input
                                              type="hidden"
                                              value={user.id}
                                              name="id"
                                          />
                                          <input
                                              type="hidden"
                                              value="user" // matches default for Clerk
                                              name="role"
                                          />
                                          <Button
                                              type="submit"
                                              variant={"outline"}
                                          >
                                              Make User (Patient)
                                          </Button>
                                      </form>
                                  </div>
                              </div>

                              <Separator className="my-4" />
                          </div>
                      );
                  })
                : query && <p>No Users Found</p>}
        </div>
    );
}

