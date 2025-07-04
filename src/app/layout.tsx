import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Marketplace - Buy and Sell Items",
  description: "A marketplace platform for buying and selling items locally",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="sticky top-0 z-50 bg-white border-b">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                Marketplace
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/create"
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-black rounded-full transition-colors font-semibold text-sm"
              >
                + Create new listing
              </Link>
              <button className="w-10 h-10 rounded-full bg-gray-200">
                <span className="sr-only">Profile</span>
              </button>
            </div>
          </div>
        </header>
        <div className="min-h-[calc(100vh-3.5rem)] bg-gray-50">
          {children}
        </div>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
