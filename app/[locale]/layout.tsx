import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import NavBar from "../components/NavBar";
import { dark } from "@clerk/themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Metadata } from "next";
import QueryProvider from "../context/QueryProvider";
import { cookies } from "next/headers";
export const metadata: Metadata = {
  title: "VEGA | NFC CARDS",
  description:
    "Effortlessly create and share your personalized digital profiles with NFC-enabled cards. Experience seamless connectivity and modern convenience in your networking.",
  openGraph: {
    title: "VEGA | NFC CARDS",
    description:
      "Effortlessly create and share your personalized digital profiles with NFC-enabled cards. Experience seamless connectivity and modern convenience in your networking.",
    images: [
      {
        url: "/VEGA.png", // Replace with the correct path to your image
        width: 1200,
        height: 630,
        alt: "VEGA NFC Cards - Digital Profiles",
      },
    ],
    type: "website",
    // Adjust according to your primary locale
  },
  twitter: {
    card: "summary_large_image",
    title: "VEGA | NFC CARDS",
    description:
      "Effortlessly create and share your personalized digital profiles with NFC-enabled cards. Experience seamless connectivity and modern convenience in your networking.",
    images: ["/VEGA.png"], // Replace with the correct path to your image
  },
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();

  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang={locale}>
        <body
          style={{ direction: locale === "ar" ? "rtl" : "ltr" }}
          className={`${locale === "ar" && "text-right"} dark`}
        >
          <QueryProvider>
            <NextIntlClientProvider messages={messages}>
              <ToastContainer position="top-center" theme="dark" />
              <NavBar />

              {children}
            </NextIntlClientProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
