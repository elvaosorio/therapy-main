import React from "react";
import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
// import Logo from "../../public/AlmacuraLogo.png";
import { Menu, MessagesSquare, User2, X } from "lucide-react";

import { Button } from "./ui/button";

// import { Button } from "./ui/button";

// const Logo = () => {
//     return (
//         <a href="/">
//             <div className="flex space-x-1">
//                 <Clover />
//                 <h1 className="flex font-semibold">Almacura</h1>
//             </div>
//         </a>
//     );
// };

const Header = () => {
    const { userId } = auth();

    return (
        <div className="py-2 px-4 h-14 mt-4">
            <div className="flex items-center justify-between h-full">
                <div className="flex flex-row space-x-2 items-center">
                    <div className="flex">
                        <div className="drawer drawer-star w-20">
                            <input
                                id="nav-drawer"
                                type="checkbox"
                                className="drawer-toggle"
                            />

                            <div className="drawer-content flex flex-col h-fit w-fit">
                                <div className="flex-between navbar bg-gray-light h-fit m-0 p-0 max-h-fit min-h-fit aspect-square w-8">
                                    <img src="/AlmacuraLogo.png" />
                                    <label
                                        className="btn btn-square btn-ghost w-8 h-fit aspect-square"
                                        htmlFor="nav-drawer"
                                    >
                                        <Menu className="h-4 w-4" />
                                    </label>
                                </div>
                            </div>

                            {/* nav inside */}
                            <div className="drawer-side z-50 overflow-x-clip">
                                <label
                                    htmlFor="nav-drawer"
                                    aria-label="close sidebar"
                                    className="drawer-overlay"
                                />
                                <div className="flex h-full w-[70%] flex-col bg-white sm:w-[60%] rounded-tr-2xl rounded-br-2xl p-6 gap-3">
                                    <div className="flex items-center justify-end ">
                                        <label
                                            className="p-[5px] place-content-center rounded-md invisible"
                                            style={{
                                                boxShadow:
                                                    "4px 4px 0px #413D45",
                                                border: "2px solid #413D45",
                                                backgroundColor: "#F4F6FC",
                                            }}
                                        >
                                            <X className="h-6 w-6" />
                                        </label>
                                    </div>
                                    <a href="/chat">
                                        <Button
                                            variant={"outline"}
                                            className="btn h-12 w-full justify-start space-x-3 text-2xl border-none bg-transparent text-black font-semibold shadow-none md:text-lg"
                                            style={{
                                                color: "var(--lightGray)",
                                            }}
                                        >
                                            <MessagesSquare />
                                            <p>Messages</p>
                                        </Button>
                                    </a>
                                    <a href="/summary">
                                        <Button
                                            variant={"outline"}
                                            className="btn h-12 w-full justify-start space-x-3 text-2xl border-none bg-transparent text-black font-semibold shadow-none md:text-lg"
                                            style={{
                                                color: "var(--lightGray)",
                                            }}
                                        >
                                            <User2 />
                                            <p>Summary</p>
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="flex-center">
                            <a href="/">
                                <img src="/AlmacuraLogo.svg" className="w-80" />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="flex flex-row items-center space-x-2 px-2 w-full justify-end">
                    {!userId ? <SignInButton /> : <SignOutButton />}
                </div>
            </div>
        </div>
    );
};

export default Header;
