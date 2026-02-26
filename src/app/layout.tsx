import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE SIGNAL — AI MARKET INTELLIGENCE",
  description: "Cut through the noise. AI-curated crypto market analysis.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased grain">{children}</body>
    </html>
  );
}
