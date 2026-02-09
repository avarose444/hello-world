import "./globals.css";

export const metadata = {
  title: "Hello World",
  description: "HW1 + HW2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
