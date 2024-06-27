import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import "./globals.css";
import NavBar from "./components/NavBar";
import connect from "./lib/db";
import { auth } from "@clerk/nextjs/server";
import User from "./lib/models/userModel";
import { dark } from "@clerk/themes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await connect();
  const { userId } = await auth();
  console.log(userId);
  const user = await User.findOne({ clerkUserId: userId });
  console.log(user);
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body className=" dark">
          <ToastContainer position="top-center" theme="dark" />

          <NavBar user={user} />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
