import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE SIGNAL — AI Market Intelligence",
  description: "AI-powered crypto market intelligence dashboard. Real-time DeFi analysis, on-chain signals, and market sentiment tracking.",
  keywords: ["crypto", "DeFi", "market intelligence", "blockchain", "on-chain analysis", "AI"],
  authors: [{ name: "The Signal Team" }],
  openGraph: {
    title: "THE SIGNAL — AI Market Intelligence",
    description: "AI-powered crypto market intelligence dashboard. Real-time DeFi analysis, on-chain signals, and market sentiment tracking.",
    url: "https://the-signal.vercel.app",
    siteName: "The Signal",
    images: [
      {
        url: "/og-image.png", // placeholder
        width: 1200,
        height: 630,
        alt: "The Signal Dashboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "THE SIGNAL — AI Market Intelligence",
    description: "AI-powered crypto market intelligence dashboard",
    images: ["/og-image.png"], // placeholder
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
