"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "react-hot-toast";
import { Check, ShoppingCart } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import QuantityStepper from "@/components/cart/QuantityStepper";
import { useCart } from "@/context/CartContext";
import { Link } from "@/i18n/routing";
import { getColorName, getColorSwatchStyle, normalizeColors, type ProductColor } from "@/lib/colors";
import { formatPrice } from "@/lib/price";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface AddToCartDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	product: Product;
}

const AddToCartDialog = ({ open, onOpenChange, product }: AddToCartDialogProps) => {
	const t = useTranslations("Cart");
	const locale = useLocale() as "en" | "ar" | "fr";
	const { add } = useCart();

	const colors = normalizeColors(product.colors);
	const [color, setColor] = useState<ProductColor | null>(null);
	const [quantity, setQuantity] = useState(1);
	const [error, setError] = useState<string | null>(null);

	// Start fresh each time the dialog opens; preselect the only color.
	useEffect(() => {
		if (!open) return;
		setColor(colors.length === 1 ? colors[0] : null);
		setQuantity(1);
		setError(null);
	}, [open, product.id]);

	const title = product[`title_${locale}`];
	const image = product.primary_image_url || product.images?.[0] || "/placeholder.png";

	const handleAdd = () => {
		if (colors.length > 0 && !color) {
			setError(t("colorRequired"));
			return;
		}
		add(product, color, quantity);
		onOpenChange(false);
		toast.success(
			<span className="flex flex-wrap items-center gap-x-2">
				{t("added")}
				<Link href="/cart" className="font-semibold text-[#232B55] underline">
					{t("viewCart")}
				</Link>
			</span>,
			{ className: "p-4 bg-[#fffcf5]" }
		);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg bg-[#fffcf5] rounded-3xl overflow-y-auto max-h-[90vh]">
				<DialogHeader className="flex-row items-center gap-4 space-y-0 text-start">
					<img src={image} alt={title} className="w-20 h-20 rounded-2xl object-cover shrink-0 bg-white" />
					<div className="flex flex-col gap-1 min-w-0">
						<DialogTitle className="text-xl font-bold text-[#333333] leading-tight">{title}</DialogTitle>
						<DialogDescription className="text-[#DC2626] text-sm font-medium">
							{product.code}
						</DialogDescription>
						<p className="text-[#232B55] font-bold">
							{product.price != null
								? t("pricePerBox", { price: formatPrice(product.price, locale) })
								: t("priceOnRequest")}
						</p>
						<p className="text-sm text-[#6B7280]">{t("pcsPerBox", { count: product.quantity_box })}</p>
					</div>
				</DialogHeader>

				{colors.length > 0 && (
					<div className="space-y-3">
						<h3 className="font-bold text-[#333333]">
							{t("chooseColor")}
							{color && <span className="font-normal text-[#6B7280]"> · {getColorName(color, locale)}</span>}
						</h3>
						<div className="flex flex-wrap gap-3" role="radiogroup" aria-label={t("chooseColor")}>
							{colors.map((c) => {
								const selected = color?.value === c.value;
								return (
									<button
										key={c.value}
										type="button"
										role="radio"
										aria-checked={selected}
										title={getColorName(c, locale)}
										onClick={() => {
											setColor(c);
											setError(null);
										}}
										className={cn(
											"relative w-11 h-11 rounded-full border-2 shadow transition-transform hover:scale-110",
											selected ? "border-[#232B55] ring-2 ring-[#ffc85b] ring-offset-2" : "border-white"
										)}
										style={getColorSwatchStyle(c.value)}
									>
										{selected && (
											<Check className="absolute inset-0 m-auto w-5 h-5 text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]" />
										)}
									</button>
								);
							})}
						</div>
					</div>
				)}

				<div className="flex flex-wrap items-center justify-between gap-4">
					<div className="space-y-2">
						<h3 className="font-bold text-[#333333]">{t("boxes")}</h3>
						<QuantityStepper value={quantity} onChange={setQuantity} />
					</div>
					<div className="text-end">
						<p className="text-sm text-[#6B7280]">{t("total")}</p>
						<p className="text-xl font-bold text-[#232B55]">
							{product.price != null ? formatPrice(product.price * quantity, locale) : t("priceOnRequest")}
						</p>
					</div>
				</div>

				{error && (
					<p role="alert" className="text-red-500 text-sm">
						{error}
					</p>
				)}

				<Button variant="primary" className="h-12 w-full" onClick={handleAdd}>
					<ShoppingCart />
					<span className="mt-1">{t("addToCart")}</span>
				</Button>
			</DialogContent>
		</Dialog>
	);
};

export default AddToCartDialog;
