"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const SearchUsers = () => {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const formData = new FormData(form);
                    const queryTerm = formData.get("search") as string;

                    if (queryTerm.length >= 3) {
                        router.push(pathname + "?search=" + queryTerm);
                    } else {
                        alert("Please enter at least 3 characters.");
                    }
                }}
                className="space-y-2"
            >
                <label htmlFor="search">Search for Users</label>
                <Input id="search" name="search" type="text" />
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
};
