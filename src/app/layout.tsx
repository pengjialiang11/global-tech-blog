import "./globals.css";
import HeaderNav from "@/components/HeaderNav";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import Analytics from "@/components/Analytics";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.sinotechlens.com";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SinoTechLens — China Frontier Tech & Cross-border Trends",
    template: "%s | SinoTechLens",
  },
  description:
    "Independent English blog focused on China's cutting-edge tech industrial landing & cross-border global technology trends.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    siteName: "SinoTechLens",
    url: SITE_URL,
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
