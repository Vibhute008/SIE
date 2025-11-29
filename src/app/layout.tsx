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
  metadataBase: new URL('https://satyamexport.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'en-GB': '/en-GB',
      'en-IN': '/en-IN',
      'en': '/en'
    }
  },
  openGraph: {
    title: "Satyam Import and Export | Premium Agricultural Product Exporters",
    description: "Export India's finest agricultural products including onions, lemons, rice, lentils, and spices to global markets. Quality certified with on-time delivery.",
    url: 'https://satyamexport.com',
    siteName: 'Satyam Import and Export',
    images: [
      {
        url: '/hero.png',
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
    images: ['/hero.png'],
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
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
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
  // Add enhanced JSON-LD structured data for Organization with LocalBusiness properties
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "name": "Satyam Import and Export",
    "alternateName": "Satyam Export",
    "url": "https://satyamexport.com",
    "logo": "https://satyamexport.com/logo.png",
    "description": "Premium agricultural product exporters from India, specializing in onions, lemons, rice, lentils, and spices for global markets.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Nirman Sankul Building, Tata Power Netaji Nagar",
      "addressLocality": "Kalyan East",
      "addressRegion": "Maharashtra",
      "postalCode": "421306",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-9004633136",
      "contactType": "sales",
      "availableLanguage": "en"
    },
    "sameAs": [
      // Social media profiles would go here
    ],
    "areaServed": "Global",
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Premium Onions",
          "description": "Freshly harvested yellow onions for export"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Organic Lemons",
          "description": "Juicy organic lemons rich in vitamin C"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "Basmati Rice",
          "description": "Premium quality basmati rice with long grains"
        }
      }
    ]
  };

  // Google Analytics 4 measurement ID - replace with your actual GA4 measurement ID
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Hreflang tags for international SEO */}
        <link rel="alternate" hrefLang="en" href="https://satyamexport.com/" />
        <link rel="alternate" hrefLang="en-US" href="https://satyamexport.com/en-US" />
        <link rel="alternate" hrefLang="en-GB" href="https://satyamexport.com/en-GB" />
        <link rel="alternate" hrefLang="en-IN" href="https://satyamexport.com/en-IN" />
        <link rel="alternate" hrefLang="x-default" href="https://satyamexport.com/" />
        
        {/* Google Analytics 4 */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}