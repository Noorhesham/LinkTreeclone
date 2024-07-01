import { ClerkProvider} from "@clerk/nextjs";
import "./globals.css";
import NavBar from "../components/NavBar";
import { dark } from "@clerk/themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  console.log(locale)
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang={locale}>
        <body style={{ direction: locale === "ar" ? "rtl" : "ltr" }} className={`${locale==='ar'&&"text-right"} dark`}>
          <NextIntlClientProvider messages={messages}>
            <ToastContainer position="top-center" theme="dark" />
            <NavBar />
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
