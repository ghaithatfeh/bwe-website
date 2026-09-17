import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://bestworldemballage.com").replace(/\/$/, "");
export const SITE_NAME = "Best World Emballage";

/**
 * Builds canonical + hreflang alternates for a page path (e.g. "/about").
 * x-default points to the default locale, matching the root redirect in .htaccess.
 */
export function localeAlternates(locale: string, path = ""): NonNullable<Metadata["alternates"]> {
	const href = (l: string) => `${SITE_URL}/${l}${path}/`;
	return {
		canonical: href(locale),
		languages: {
			...Object.fromEntries(routing.locales.map((l) => [l, href(l)])),
			"x-default": href(routing.defaultLocale),
		},
	};
}

/**
 * Localized title/description (from the `Meta.<page>` namespace in messages/*.json),
 * plus Open Graph and hreflang alternates, for a page under /[locale].
 */
export async function pageMetadata(locale: string, page: "home" | "about" | "products" | "contact", path = ""): Promise<Metadata> {
	const t = await getTranslations({ locale, namespace: `Meta.${page}` });
	const title = t("title");
	const description = t("description");
	const alternates = localeAlternates(locale, path);

	return {
		title,
		description,
		alternates,
		openGraph: {
			title,
			description,
			url: alternates.canonical as string,
			siteName: SITE_NAME,
			locale,
			type: "website",
			images: [{ url: "/og-image.png", width: 1200, height: 630, alt: SITE_NAME }],
		},
	};
}
