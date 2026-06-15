
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
        <main className="flex-1 overflow-auto px-4 sm:px-8 pt-5 sm:pt-7 pb-8 bg-gray-50">
            {children}
        </main>
  );
}