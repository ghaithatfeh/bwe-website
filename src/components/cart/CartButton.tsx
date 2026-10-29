"use client";

import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCart } from "@/context/CartContext";
import { Link, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const CartButton = ({ className }: { className?: string }) => {
	const t = useTranslations("Cart");
	const pathname = usePathname();
	const { count, hydrated } = useCart();

	return (
		<Link
			href="/cart"
			aria-label={t("cart")}
			className={cn(
				"relative flex items-center gap-2 text-white hover:text-secondary transition-colors text-sm",
				pathname.startsWith("/cart") && "text-secondary",
				className
			)}
		>
			<ShoppingCart className="w-6 h-6 md:w-5 md:h-5" />
			<span className="hidden md:inline mt-1">{t("cart")}</span>
			{hydrated && count > 0 && (
				<span className="absolute -top-2 -start-2 min-w-5 h-5 px-1 rounded-full bg-[#DC2626] text-white text-[11px] font-bold leading-5 text-center">
					{count > 99 ? "99+" : count}
				</span>
			)}
		</Link>
	);
};

export default CartButton;
