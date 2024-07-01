export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen py-5 px-10 flex justify-center items-center">{children}</main>;
}
