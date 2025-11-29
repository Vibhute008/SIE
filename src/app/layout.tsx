import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Satyam Import and Export - Premium Agricultural Product Exporters",
    default: "Satyam Import and Export | Premium Agricultural Product Exporters from India"
  },
  description: "Export India's finest agricultural products including onions, lemons, rice, lentils, and spices to global markets. Quality certified with on-time delivery and farm-fresh produce.",
  keywords: [
    "agricultural exports", 
    "onion exporter", 
    "lemon exporter", 
    "rice exporter", 
    "India agricultural products",
    "spices exporter",
    "lentils exporter",
    "farm fresh produce",
    "international agricultural trade"
  ],
  authors: [{ name: "Satyam Import and Export" }],
  creator: "Satyam Import and Export",
  publisher: "Satyam Import and Export",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://satyamexport.com'), // Replace with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Satyam Import and Export | Premium Agricultural Product Exporters",
    description: "Export India's finest agricultural products including onions, lemons, rice, lentils, and spices to global markets. Quality certified with on-time delivery.",
    url: 'https://satyamexport.com', // Replace with your actual domain
    siteName: 'Satyam Import and Export',
    images: [
      {
        url: '/og-image.jpg', // You'll need to add this image
        width: 1200,
        height: 630,
        alt: 'Satyam Import and Export - Premium Agricultural Products',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Satyam Import and Export | Premium Agricultural Product Exporters",
    description: "Export India's finest agricultural products including onions, lemons, rice, lentils, and spices to global markets.",
    images: ['/og-image.jpg'], // You'll need to add this image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  other: {
    "permissions-policy": "clipboard-write=(self)",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* <BreakpointTester /> */}
      </body>
    </html>
  );
}