import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from './providers';

export const metadata: Metadata = {
  title: "Content Dashboard",
  description: "Personal content dashboard for saving and organizing links, videos, articles, and social posts with personal notes.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script 
          defer 
          src="/analytics/script.js" 
          data-website-id="806dd5e3-15f0-4e4a-81af-c4776ae7624f"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
