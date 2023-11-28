import "./globals.css";
import { Inter } from "next/font/google";

import { auth, ClerkProvider } from "@clerk/nextjs";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin - Alain Farms | Iphone, 2023",
  description: "Admin - Alain Farms, Iphone campaign, 2023",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  const {userId} = auth()
  return (
    <ClerkProvider>
      <html lang="en">
        <link rel="icon" href="/favicon.png" />
        <body className={inter.className}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
