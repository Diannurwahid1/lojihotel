import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Loji Hotel Solo — Smart Luxury Hotel di Jantung Kota Solo",
  description:
    "Loji Hotel Solo, hotel bintang tiga berkonsep Smart Luxury di pusat kota Surakarta. Nikmati kenyamanan kamar modern, fasilitas lengkap, dan lokasi strategis dekat Stasiun Solo Balapan.",
  keywords: [
    "hotel solo",
    "loji hotel",
    "smart luxury hotel",
    "hotel surakarta",
    "hotel bintang 3 solo",
    "hotel dekat stasiun solo balapan",
  ],
  openGraph: {
    title: "Loji Hotel Solo — Smart Luxury Hotel",
    description:
      "Pengalaman menginap cerdas di jantung Kota Solo. Hotel bintang tiga dengan konsep Smart Luxury.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
