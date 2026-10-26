import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
	const { locale } = await params;
	return { ...(await pageMetadata(locale, "signin", "/signin")), robots: { index: false, follow: false } };
}

export default function Layout({ children }: { children: React.ReactNode }) {
	return children;
}
