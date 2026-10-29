"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ProductColor } from "@/lib/colors";
import type { Product } from "@/types/product";
import {
	CART_STORAGE_KEY,
	type CartItem,
	clampQuantity,
	lineKey,
	loadCart,
	reconcileCart,
	saveCart,
	toCartItem,
} from "@/lib/cart";

interface CartContextValue {
	items: CartItem[];
	/** False until the cart has been read from localStorage (after mount). */
	hydrated: boolean;
	/** Total number of boxes. */
	count: number;
	/** Sum of the priced lines. */
	subtotal: number;
	/** True when at least one line has no price yet. */
	hasPriceOnRequest: boolean;
	add: (product: Product, color: ProductColor | null, quantity: number) => void;
	setQuantity: (key: string, quantity: number) => void;
	remove: (key: string) => void;
	clear: () => void;
	reconcile: (products: Product[]) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
	const [items, setItems] = useState<CartItem[]>([]);
	const [hydrated, setHydrated] = useState(false);
	// Set when the change came from another tab, so it isn't written back.
	const skipSave = useRef(false);

	// localStorage only exists in the browser, so read it after mount to keep
	// the statically rendered HTML and the first client render identical.
	useEffect(() => {
		setItems(loadCart());
		setHydrated(true);

		const onStorage = (e: StorageEvent) => {
			if (e.key !== CART_STORAGE_KEY && e.key !== null) return;
			skipSave.current = true;
			setItems(loadCart());
		};
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);

	useEffect(() => {
		if (!hydrated) return;
		if (skipSave.current) {
			skipSave.current = false;
			return;
		}
		saveCart(items);
	}, [items, hydrated]);

	const add = useCallback((product: Product, color: ProductColor | null, quantity: number) => {
		const next = toCartItem(product, color, quantity);
		setItems((current) => {
			const key = lineKey(next);
			const existing = current.find((item) => lineKey(item) === key);
			if (!existing) return [...current, next];
			return current.map((item) =>
				lineKey(item) === key ? { ...next, quantity: clampQuantity(item.quantity + next.quantity) } : item
			);
		});
	}, []);

	const setQuantity = useCallback((key: string, quantity: number) => {
		setItems((current) =>
			current.map((item) => (lineKey(item) === key ? { ...item, quantity: clampQuantity(quantity) } : item))
		);
	}, []);

	const remove = useCallback((key: string) => {
		setItems((current) => current.filter((item) => lineKey(item) !== key));
	}, []);

	const clear = useCallback(() => setItems([]), []);

	const reconcile = useCallback((products: Product[]) => {
		setItems((current) => reconcileCart(current, products));
	}, []);

	const value = useMemo<CartContextValue>(() => {
		let count = 0;
		let subtotal = 0;
		let hasPriceOnRequest = false;
		for (const item of items) {
			count += item.quantity;
			if (item.price == null) hasPriceOnRequest = true;
			else subtotal += item.price * item.quantity;
		}
		return { items, hydrated, count, subtotal, hasPriceOnRequest, add, setQuantity, remove, clear, reconcile };
	}, [items, hydrated, add, setQuantity, remove, clear, reconcile]);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
	const context = useContext(CartContext);
	if (!context) throw new Error("useCart must be used inside <CartProvider>");
	return context;
};
