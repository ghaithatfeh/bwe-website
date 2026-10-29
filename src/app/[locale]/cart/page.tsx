"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "react-hot-toast";
import { ShoppingCart, Trash2 } from "lucide-react";
import CustomHeroSection from "@/components/CustomHeroSection";
import QuantityStepper from "@/components/cart/QuantityStepper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/hooks/useProducts";
import useSession from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { Link, useRouter } from "@/i18n/routing";
import { formatPhone, normalizePhone } from "@/lib/auth";
import { lineKey, lineTotal } from "@/lib/cart";
import { getColorName, getColorSwatchStyle } from "@/lib/colors";
import { formatPrice } from "@/lib/price";

const inputClassName = "h-12 bg-white rounded-2xl focus:border-[#ffc85b] focus-visible:ring-0";
const labelClassName = "text-sm text-gray-600 ms-1";

const CartPage = () => {
	const t = useTranslations("Cart");
	const locale = useLocale() as "en" | "ar" | "fr";
	const router = useRouter();
	const { items, hydrated, subtotal, hasPriceOnRequest, setQuantity, remove, clear, reconcile } = useCart();
	const { products, loading: productsLoading } = useProducts();
	const { user, loading: sessionLoading } = useSession();
	const userId = user?.id;

	const [form, setForm] = useState({ customer_name: "", phone: "", address: "", notes: "" });
	const [error, setError] = useState<string | null>(null);
	const [placing, setPlacing] = useState(false);

	// Refresh prices/titles from the catalog and drop products that are gone.
	// Skipped while loading or when the fetch failed (products is then empty).
	useEffect(() => {
		if (hydrated && !productsLoading && products.length > 0) reconcile(products);
	}, [hydrated, productsLoading, products, reconcile]);

	// Pre-fill the delivery details from the profile.
	useEffect(() => {
		if (!userId) return;
		supabase
			.from("profiles")
			.select("first_name, last_name, phone, address")
			.eq("id", userId)
			.single()
			.then(({ data }) => {
				if (!data) return;
				setForm((f) => ({
					...f,
					customer_name: f.customer_name || `${data.first_name} ${data.last_name}`.trim(),
					phone: f.phone || formatPhone(data.phone),
					address: f.address || (data.address ?? ""),
				}));
			});
	}, [userId]);

	const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
		setForm((f) => ({ ...f, [field]: e.target.value }));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user || items.length === 0) return;

		const customerName = form.customer_name.trim();
		const address = form.address.trim();
		const phone = normalizePhone(form.phone);
		if (!customerName || !address || !form.phone.trim()) {
			setError(t("fieldsRequired"));
			return;
		}
		if (!phone) {
			setError(t("invalidPhone"));
			return;
		}

		setPlacing(true);
		setError(null);
		// Prices are looked up by the database; only ids, colors and box counts are sent.
		const { data: orderId, error } = await supabase.rpc("place_order", {
			p_items: items.map((item) => ({
				product_id: item.productId,
				quantity: item.quantity,
				color: item.color?.value ?? null,
			})),
			p_customer_name: customerName,
			p_phone: phone,
			p_address: address,
			p_notes: form.notes.trim(),
		});
		setPlacing(false);

		if (error) {
			console.error("place_order failed:", error);
			setError(t("orderError"));
			return;
		}
		clear();
		toast.success(t("orderPlaced", { id: orderId }), { className: "p-4 bg-[#fffcf5]", duration: 6000 });
		router.replace("/profile");
	};

	const renderItems = () => (
		<ul className="flex flex-col divide-y">
			{items.map((item) => {
				const key = lineKey(item);
				const total = lineTotal(item);
				return (
					<li key={key} className="flex gap-4 py-5 first:pt-0 last:pb-0">
						<img
							src={item.image || "/placeholder.png"}
							alt={item[`title_${locale}`]}
							className="w-24 h-24 rounded-2xl object-cover shrink-0 bg-white"
						/>
						<div className="flex flex-col gap-2 flex-1 min-w-0">
							<div className="flex items-start justify-between gap-2">
								<div className="min-w-0">
									<p className="font-bold text-[#333333] leading-tight">{item[`title_${locale}`]}</p>
									<p className="text-[#DC2626] text-sm font-medium">{item.code}</p>
								</div>
								<button
									type="button"
									onClick={() => remove(key)}
									className="p-2 -m-2 text-gray-400 hover:text-[#DC2626] transition-colors"
									aria-label={t("remove")}
								>
									<Trash2 className="w-5 h-5" />
								</button>
							</div>
							{item.color && (
								<p className="flex items-center gap-2 text-sm text-[#6B7280]">
									<span
										className="w-5 h-5 rounded-full border shadow-sm"
										style={getColorSwatchStyle(item.color.value)}
									/>
									{getColorName(item.color, locale)}
								</p>
							)}
							<p className="text-sm text-[#6B7280]">
								{item.price != null
									? t("pricePerBox", { price: formatPrice(item.price, locale) })
									: t("priceOnRequest")}
								{" · "}
								{t("pcsPerBox", { count: item.quantity_box })}
							</p>
							<div className="flex flex-wrap items-center justify-between gap-3">
								<QuantityStepper value={item.quantity} onChange={(q) => setQuantity(key, q)} />
								<p className="font-bold text-[#232B55]">
									{total != null ? formatPrice(total, locale) : t("priceOnRequest")}
								</p>
							</div>
						</div>
					</li>
				);
			})}
		</ul>
	);

	const renderCheckout = () => {
		if (sessionLoading) {
			return <p className="text-center text-gray-500 py-4">{t("loading")}</p>;
		}
		if (!user) {
			return (
				<div className="flex flex-col gap-4 text-center">
					<h2 className="text-xl font-bold text-[#333333]">{t("signInToOrder")}</h2>
					<p className="text-sm text-[#6B7280]">{t("signInToOrderHint")}</p>
					<Button asChild variant="primary" className="h-12">
						<Link href={{ pathname: "/account", query: { next: "/cart" } }}>{t("signInToOrderButton")}</Link>
					</Button>
				</div>
			);
		}
		return (
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<h2 className="text-xl font-bold text-[#333333]">{t("deliveryDetails")}</h2>
				<label className="flex flex-col gap-1">
					<span className={labelClassName}>{t("fullName")}</span>
					<Input
						className={inputClassName}
						value={form.customer_name}
						onChange={update("customer_name")}
						autoComplete="name"
						maxLength={200}
						required
					/>
				</label>
				<label className="flex flex-col gap-1">
					<span className={labelClassName}>{t("phone")}</span>
					<Input
						className={inputClassName}
						type="tel"
						value={form.phone}
						onChange={update("phone")}
						autoComplete="tel"
						dir="ltr"
						maxLength={30}
						required
					/>
				</label>
				<label className="flex flex-col gap-1">
					<span className={labelClassName}>{t("address")}</span>
					<Textarea
						className="min-h-[90px] bg-white rounded-2xl focus:border-[#ffc85b] focus-visible:ring-0 py-3"
						value={form.address}
						onChange={update("address")}
						autoComplete="street-address"
						maxLength={500}
						required
					/>
				</label>
				<label className="flex flex-col gap-1">
					<span className={labelClassName}>{t("notesOptional")}</span>
					<Textarea
						className="min-h-[70px] bg-white rounded-2xl focus:border-[#ffc85b] focus-visible:ring-0 py-3"
						value={form.notes}
						onChange={update("notes")}
						maxLength={1000}
					/>
				</label>
				{error && (
					<p role="alert" className="text-red-500 text-sm -mt-2 ms-1">
						{error}
					</p>
				)}
				<Button type="submit" variant="primary" className="h-12" disabled={placing}>
					{placing ? t("placing") : t("placeOrder")}
				</Button>
			</form>
		);
	};

	return (
		<main>
			<CustomHeroSection title={t("title")} imageSrc="/bg-contact.webp" />
			<section className="bg-[url('/contact-page.png')] py-16 px-4">
				<div className="container mx-auto">
					{!hydrated ? (
						<p className="text-center text-gray-500 py-8">{t("loading")}</p>
					) : items.length === 0 ? (
						<Card className="max-w-[480px] m-auto bg-[#fffcf5] rounded-[30px] p-8 shadow-lg flex flex-col items-center gap-6 text-center">
							<ShoppingCart className="w-12 h-12 text-[#232B55]" />
							<p className="text-[#333333] text-lg">{t("empty")}</p>
							<Button asChild variant="primary" className="h-12 px-8">
								<Link href="/products">{t("browseProducts")}</Link>
							</Button>
						</Card>
					) : (
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
							<Card className="lg:col-span-2 bg-[#fffcf5] rounded-[30px] p-6 md:p-8 shadow-lg">
								{renderItems()}
							</Card>
							<Card className="bg-[#fffcf5] rounded-[30px] p-6 md:p-8 shadow-lg flex flex-col gap-6 lg:sticky lg:top-6">
								<div className="flex flex-col gap-2">
									<div className="flex items-center justify-between text-lg">
										<span className="text-[#333333]">{t("subtotal")}</span>
										<span className="font-bold text-[#232B55]">
											{items.every((item) => item.price == null)
												? t("priceOnRequest")
												: formatPrice(subtotal, locale)}
										</span>
									</div>
									{hasPriceOnRequest && (
										<p className="text-sm text-[#6B7280]">{t("priceOnRequestNote")}</p>
									)}
								</div>
								<div className="border-t pt-6">{renderCheckout()}</div>
							</Card>
						</div>
					)}
				</div>
			</section>
		</main>
	);
};

export default CartPage;
