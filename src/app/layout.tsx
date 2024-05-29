import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import "@uploadthing/react/styles.css";

import React from "react";
import { Metadata } from "next";
import Header from "@/components/Header";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
    title: "Almacura",
    description: "Almacura",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
    other: {
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-status-bar-style": "dark-content",
    },
    manifest: "/manifest.json",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html lang="en" className="bg-white">
                <Providers>
                    <body className={poppins.className}>
                        <Header />
                        <main className="wrapper bg-white">{children}</main>
                        <Toaster />
                    </body>
                </Providers>
            </html>
        </ClerkProvider>
    );
}

