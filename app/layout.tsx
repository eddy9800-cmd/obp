import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Te Huur - Oude Brugsepoort 59, Deinze",
  description: "Charmante halfopen woning te huur in Deinze. 2 slaapkamers, 115m² bewoonbare oppervlakte, garage, tuin.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
