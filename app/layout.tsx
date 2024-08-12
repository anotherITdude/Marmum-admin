import "./globals.css";
import { Inter } from "next/font/google";

import { auth, ClerkProvider } from "@clerk/nextjs";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Marmum | Admin, 2024",
  description: "Marmum Return To Adventure, Campaign, 2024",
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
