import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import AppContext from "@/components/app";

// Fonts configuration
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Multisend - Zetrix Airdrop Tools",
  description: "Easily airdrop your ZTP-20 tokens with Multisend. This tool simplifies the distribution of token on Zetrix, making it fast and efficient. Perfect for both large and small campaigns.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <AppContext>{children}</AppContext>
      </body>
    </html>
  );
}
