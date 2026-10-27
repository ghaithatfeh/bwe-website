const PRICE_LOCALES: Record<string, string> = {
	en: "en-MA",
	ar: "ar-MA",
	fr: "fr-MA",
};

/** Formats a product price in Moroccan dirhams for the given site locale. */
export const formatPrice = (price: number, locale: string): string =>
	new Intl.NumberFormat(PRICE_LOCALES[locale] ?? locale, {
		style: "currency",
		currency: "MAD",
		minimumFractionDigits: Number.isInteger(price) ? 0 : 2,
		maximumFractionDigits: 2,
	}).format(price);
