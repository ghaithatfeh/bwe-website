import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";

export const dynamic = "force-static";

const PAGES = ["", "/about", "/products", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
	const href = (locale: string, path: string) => `${SITE_URL}/${locale}${path}/`;

	return PAGES.flatMap((path) =>
		routing.locales.map((locale) => ({
			url: href(locale, path),
			lastModified: new Date(),
			alternates: {
				languages: Object.fromEntries(routing.locales.map((l) => [l, href(l, path)])),
			},
		})),
	);
}
