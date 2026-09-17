import type { Metadata } from "next";
import Header from "@/components/Header";
import { balooBhaina2, tajawal } from "@/lib/fonts";
import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { SITE_NAME, SITE_URL, pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	const home = await pageMetadata(locale, "home");
	return {
		...home,
		metadataBase: new URL(SITE_URL),
		// Sub-pages set `title` to just the page name; the template appends the brand.
		title: { default: `${home.title} | ${SITE_NAME}`, template: `%s | ${SITE_NAME}` },
		icons: {
			icon: "/favicon.ico",
			apple: "/apple-touch-icon.png",
		},
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
