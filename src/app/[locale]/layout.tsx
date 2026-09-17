import type { Metadata } from "next";
import Header from "@/components/Header";
import { balooBhaina2, tajawal } from "@/lib/fonts";
import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { SITE_URL, localeAlternates } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return {
		metadataBase: new URL(SITE_URL),
		title: "Best World Emballage",
		description: "Best World Emballage",
		icons: {
			icon: "/favicon.ico",
			apple: "/apple-touch-icon.png",
		},
		alternates: localeAlternates(locale),
	};
}

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;
	setRequestLocale(locale);

	return (
		<html lang={locale}  dir={locale === "ar" ? "rtl" : "ltr"} className="scroll-smooth overflow-x-hidden md:overflow-x-visible">
			<body className={`${balooBhaina2.variable} ${tajawal.variable} overflow-x-hidden md:overflow-x-visible`}>
				<NextIntlClientProvider>
					<Header />
					{children}
					<Toaster position="top-right" />
					<Footer />
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
