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
import { LoadingProvider } from "../context/LoadingContext";

export const metadata: Metadata = {
  title: {
    default: "VEGA | Smart Technology",
    template: "%s | Smart Technology",
  },
  description:
    "Effortlessly create and share your personalized digital profiles with NFC-enabled cards. Experience seamless connectivity and modern convenience in your networking.",
  openGraph: {
    title: "VEGA | Smart Technology",
    description:
      "Effortlessly create and share your personalized digital profiles with NFC-enabled cards. Experience seamless connectivity and modern convenience in your networking.",
    images: [
      {
        url: "/VEGA.png",
        width: 1200,
        height: 630,
        alt: "VEGA Smart Technology - Digital Profiles",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VEGA | Smart Technology",
    description:
      "Effortlessly create and share your personalized digital profiles with NFC-enabled cards. Experience seamless connectivity and modern convenience in your networking.",
    images: ["/VEGA.png"],
  },
  alternates: {
    canonical: "https://vega-nfc.vercel.app",
    languages: {
      ar: "https://vega-nfc.vercel.app/ar",
      en: "https://vega-nfc.vercel.app/en",
    },
  },
  metadataBase: new URL("https://vega-nfc.vercel.app"),
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
            <LoadingProvider>
              <NextIntlClientProvider messages={messages}>
                <ToastContainer position="top-center" theme="dark" />
                <NavBar />
                {children}
              </NextIntlClientProvider>
            </LoadingProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
