import type { Metadata } from "next";
import { Exo } from "next/font/google";
import { Suspense } from "react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "./globals.css";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import PageLoader from "@/components/ui/PageLoader";
import { Toaster } from "react-hot-toast";
import NextAuthProvider from "@/components/providers/SessionProvider";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

const exo = Exo({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreshCart",
  description: "Ecommerce website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${exo.className} antialiased`}>
        <Toaster position="top-right" />
        <NextAuthProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <Navbar />
                <Suspense fallback={<PageLoader />}>{children}</Suspense>
                <Footer />
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
