import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://bestworldemballage.com").replace(/\/$/, "");

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
