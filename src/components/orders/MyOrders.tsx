"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { supabase } from "@/integrations/supabase/client";
import { getColorName, normalizeColors } from "@/lib/colors";
import { ORDER_STATUS_CLASSES, type OrderWithItems } from "@/lib/orders";
import { formatPrice } from "@/lib/price";
import { cn } from "@/lib/utils";

/** The signed-in user's orders (RLS only returns their own). */
const MyOrders = () => {
	const t = useTranslations("Cart");
	const tStatus = useTranslations("OrderStatus");
	const locale = useLocale() as "en" | "ar" | "fr";
	const [orders, setOrders] = useState<OrderWithItems[] | null>(null);

	useEffect(() => {
		supabase
			.from("orders")
			.select("*, order_items(*)")
			.order("created_at", { ascending: false })
			.then(({ data, error }) => {
				if (error) console.error("Orders error:", error);
				setOrders((data as OrderWithItems[] | null) ?? []);
			});
	}, []);

	const dateFormat = new Intl.DateTimeFormat(locale === "ar" ? "ar-MA" : `${locale}-MA`, { dateStyle: "medium" });

	return (
		<div className="flex flex-col gap-4 border-t pt-6">
			<h2 className="text-xl font-bold text-[#333333]">{t("myOrders")}</h2>
			{orders === null ? (
				<p className="text-center text-gray-500">{t("loading")}</p>
			) : orders.length === 0 ? (
				<p className="text-sm text-gray-500">{t("noOrders")}</p>
			) : (
				<ul className="flex flex-col gap-3">
					{orders.map((order) => (
						<li key={order.id} className="rounded-2xl border bg-white p-4 flex flex-col gap-2">
							<div className="flex items-center justify-between gap-2">
								<div>
									<p className="font-bold text-[#333333]">{t("orderNumber", { id: order.id })}</p>
									<p className="text-xs text-gray-500">{dateFormat.format(new Date(order.created_at))}</p>
								</div>
								<span
									className={cn(
										"rounded-full px-3 pt-1 pb-0.5 text-xs font-semibold",
										ORDER_STATUS_CLASSES[order.status]
									)}
								>
									{tStatus(order.status)}
								</span>
							</div>
							<ul className="text-sm text-[#6B7280] flex flex-col gap-0.5">
								{order.order_items.map((item) => {
									const [color] = normalizeColors(item.color ? [item.color] : []);
									return (
										<li key={item.id} className="flex justify-between gap-2">
											<span className="min-w-0 truncate">
												{item[`title_${locale}`]}
												{color && ` · ${getColorName(color, locale)}`}
											</span>
											<span className="shrink-0">{t("boxesCount", { count: item.quantity })}</span>
										</li>
									);
								})}
							</ul>
							<p className="text-end font-bold text-[#232B55]">
								{order.total != null ? formatPrice(order.total, locale) : t("priceToConfirm")}
							</p>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default MyOrders;
