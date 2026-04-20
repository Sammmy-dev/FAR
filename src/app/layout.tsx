import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "FAR — Flavour Airhis Resources",
    template: "%s | Flavour Airhis Resources",
  },
  description:
    "FAR is a Nigerian HR and staffing agency that recruits and deploys talent for client companies.",
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1a1a1a",
              color: "#f8f8f8",
              borderRadius: "8px",
            },
          }}
        />
      </body>
    </html>
  );
}

