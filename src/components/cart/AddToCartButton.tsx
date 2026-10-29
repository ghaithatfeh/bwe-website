"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddToCartDialog from "@/components/cart/AddToCartDialog";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface AddToCartButtonProps {
	product: Product;
	/** "compact" fits inside product cards; "full" is the large dialog button. */
	variant?: "compact" | "full";
	className?: string;
}

const AddToCartButton = ({ product, variant = "compact", className }: AddToCartButtonProps) => {
	const t = useTranslations("Cart");
	const [open, setOpen] = useState(false);

	return (
		// React events bubble through portals, so without this a click on the
		// button or anywhere in the dialog would also reach the card's onClick
		// and open the product details.
		<div onClick={(e) => e.stopPropagation()} className={variant === "full" ? undefined : "contents"}>
			<Button
				type="button"
				variant="primary"
				className={cn(variant === "compact" ? "h-10 px-4" : "h-12 w-full sm:w-auto px-8", className)}
				onClick={() => setOpen(true)}
			>
				<ShoppingCart />
				<span className="mt-1">{t("addToCart")}</span>
			</Button>
			<AddToCartDialog open={open} onOpenChange={setOpen} product={product} />
		</div>
	);
};

export default AddToCartButton;
