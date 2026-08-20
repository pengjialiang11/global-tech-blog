import "./globals.css";
import HeaderNav from "@/components/HeaderNav";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import Analytics from "@/components/Analytics";
import { SITE_URL } from "@/lib/site";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SinoTechLens — China Frontier Tech & Cross-border Trends",
    template: "%s | SinoTechLens",
  },
  description:
    "Independent English blog focused on China's cutting-edge tech industrial landing & cross-border global technology trends.",
  keywords: [
    "China tech",
    "semiconductor",
    "AI",
    "green energy",
    "advanced manufacturing",
    "DeepSeek",
    "Huawei",
    "BYD",
    "industrial policy",
  ],
  authors: [{ name: "SinoTechLens Editorial" }],
  creator: "SinoTechLens",
  publisher: "SinoTechLens",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    siteName: "SinoTechLens",
    url: SITE_URL,
    title: "SinoTechLens — China Frontier Tech & Cross-border Trends",
    description:
      "Independent English blog focused on China's cutting-edge tech industrial landing & cross-border global technology trends.",
    locale: "en_US",
    images: [
      {
        url: "/og-default.svg",
        width: 1200,
        height: 630,
        alt: "SinoTechLens — Independent English coverage of China's frontier tech and industrial trends",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@sinotechlens",
    creator: "@sinotechlens",
    title: "SinoTechLens — China Frontier Tech & Cross-border Trends",
    description:
      "Independent English blog focused on China's cutting-edge tech industrial landing & cross-border global technology trends.",
    images: ["/og-default.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <HeaderNav />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}
