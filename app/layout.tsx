import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // Import the Navbar we just made

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Health Forum",
  description: "A community for health discussions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />  {/* The Navbar sits at the top */}
        <main className="min-h-screen bg-gray-50">
           {children} {/* The page content sits below */}
        </main>
      </body>
    </html>
  );
}