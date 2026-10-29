import { normalizeColors, type ProductColor } from "@/lib/colors";
import type { Product } from "@/types/product";

/** One cart line. Quantity is a number of boxes; price is the price of one box. */
export interface CartItem {
	productId: number;
	color: ProductColor | null;
	quantity: number;
	// Display snapshot, refreshed from the catalog by `reconcileCart`.
	// The order itself is always priced by the database.
	code: string;
	title_en: string;
	title_ar: string;
	title_fr: string;
	image: string;
	price: number | null;
	quantity_box: number;
}

export const CART_STORAGE_KEY = "bwe-cart-v1";
export const MAX_BOXES = 10000;

export const lineKey = (item: Pick<CartItem, "productId" | "color">) =>
	`${item.productId}|${item.color?.value ?? ""}`;

export const clampQuantity = (quantity: number) =>
	Math.min(MAX_BOXES, Math.max(1, Math.floor(quantity) || 1));

const productSnapshot = (product: Product) => ({
	code: product.code,
	title_en: product.title_en,
	title_ar: product.title_ar,
	title_fr: product.title_fr,
	image: product.primary_image_url || product.images?.[0] || "",
	price: product.price,
	quantity_box: product.quantity_box,
});

export const toCartItem = (product: Product, color: ProductColor | null, quantity: number): CartItem => ({
	productId: product.id,
	color,
	quantity: clampQuantity(quantity),
	...productSnapshot(product),
});

const isCartItem = (value: unknown): value is CartItem => {
	const item = value as CartItem;
	return (
		!!item &&
		typeof item === "object" &&
		typeof item.productId === "number" &&
		typeof item.quantity === "number" &&
		typeof item.code === "string" &&
		(item.color === null || typeof item.color?.value === "string")
	);
};

/** Reads the cart from localStorage, dropping anything malformed. */
export const loadCart = (): CartItem[] => {
	try {
		const raw = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) ?? "[]");
		return Array.isArray(raw)
			? raw.filter(isCartItem).map((item) => ({ ...item, quantity: clampQuantity(item.quantity) }))
			: [];
	} catch {
		return [];
	}
};

export const saveCart = (items: CartItem[]) => {
	try {
		localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
	} catch {
		// Storage full or disabled (e.g. private mode); the cart stays in memory.
	}
};

/**
 * Refreshes each line from the current catalog. Lines whose product was
 * deleted, or whose color is no longer offered, are dropped.
 */
export const reconcileCart = (items: CartItem[], products: Product[]): CartItem[] => {
	const byId = new Map(products.map((p) => [p.id, p]));
	return items.flatMap((item) => {
		const product = byId.get(item.productId);
		if (!product) return [];
		const colors = normalizeColors(product.colors);
		const color = item.color && colors.find((c) => c.value === item.color!.value);
		if (colors.length > 0 && !color) return [];
		return [{ ...item, ...productSnapshot(product), color: color || null }];
	});
};

export const lineTotal = (item: CartItem) => (item.price == null ? null : item.price * item.quantity);
