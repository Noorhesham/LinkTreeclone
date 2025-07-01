export default async function AuthLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return <div className="flex flex-col items-center justify-center h-screen">{children}</div>;
}
