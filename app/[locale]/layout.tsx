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
export const metadata: Metadata = {
  title: "VEGA | NFC CARDS",
  description: "Create and share your personalized link profiles with NFC support",
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
