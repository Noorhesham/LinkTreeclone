import SideBar from "@/app/components/SideBar";
import { ThemeProvider } from "@/app/context/ThemeProvider";

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <ThemeProvider defaultTheme="{}">
      <main className=" pt-20 pb-10 px-10  grid grid-cols-5">
        <div className=" col-span-1">
          <SideBar />
        </div>
        <div className=" col-span-4">{children}</div>
      </main>
    </ThemeProvider>
  );
}
