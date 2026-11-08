"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "react-hot-toast";
import { BadgeCheck, LogOut, MapPin, Package, Truck, UserRound } from "lucide-react";
import CustomHeroSection from "@/components/CustomHeroSection";
import MyOrders from "@/components/orders/MyOrders";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useSession from "@/hooks/useSession";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "@/i18n/routing";
import { formatPhone } from "@/lib/auth";
import { countryOptions } from "@/lib/countries";
import { cn } from "@/lib/utils";

const fieldClassName = "h-12 bg-white rounded-2xl focus:border-[#ffc85b] focus-visible:ring-0";
const labelClassName = "text-sm text-gray-600 ms-1";

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PHONE = /^[0-9+()\s-]+$/;

type Tab = "info" | "orders";

const EMPTY_FORM = {
	first_name: "",
	last_name: "",
	nickname: "",
	email: "",
	country: "",
	city: "",
	address: "",
	shipping_company_name: "",
	shipping_company_phone: "",
};
type ProfileForm = typeof EMPTY_FORM;

/** Read from the URL instead of useSearchParams, which needs Suspense in the static export. */
const tabFromUrl = (): Tab =>
	new URLSearchParams(window.location.search).get("tab") === "orders" ? "orders" : "info";

const Section = ({
	icon: Icon,
	title,
	hint,
	children,
}: {
	icon: React.ElementType;
	title: string;
	hint: string;
	children: React.ReactNode;
}) => (
	<fieldset className="flex flex-col gap-4">
		<legend className="flex items-start gap-3 mb-4">
			<span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#ffc85b]/25 text-[#232B55]">
				<Icon className="h-4 w-4" />
			</span>
			<span className="flex flex-col">
				<span className="text-lg font-bold text-[#333333]">{title}</span>
				<span className="text-sm text-gray-500">{hint}</span>
			</span>
		</legend>
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
	</fieldset>
);

const Field = ({
	label,
	required,
	wide,
	children,
}: {
	label: string;
	required?: boolean;
	wide?: boolean;
	children: React.ReactNode;
}) => (
	<label className={cn("flex flex-col gap-1", wide && "sm:col-span-2")}>
		<span className={labelClassName}>
			{label}
			{required && <span className="text-red-500"> *</span>}
		</span>
		{children}
	</label>
);

const ProfilePage = () => {
	const t = useTranslations("Auth");
	const tCart = useTranslations("Cart");
	const locale = useLocale();
	const router = useRouter();
	const { user, loading: sessionLoading } = useSession();
	const userId = user?.id;

	const [tab, setTab] = useState<Tab>("info");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [phone, setPhone] = useState("");
	const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);
	const [saved, setSaved] = useState<ProfileForm>(EMPTY_FORM);

	const countries = useMemo(() => countryOptions(locale), [locale]);
	const dirty = JSON.stringify(form) !== JSON.stringify(saved);

	useEffect(() => setTab(tabFromUrl()), []);

	useEffect(() => {
		if (sessionLoading) return;
		if (!userId) {
			router.replace("/account");
			return;
		}

		supabase
			.from("profiles")
			.select(
				"first_name, last_name, nickname, phone, email, country, city, address, shipping_company_name, shipping_company_phone"
			)
			.eq("id", userId)
			.single()
			.then(({ data, error }) => {
				if (error) {
					toast.error(t("genericError"));
				} else if (data) {
					setPhone(formatPhone(data.phone));
					const values: ProfileForm = {
						first_name: data.first_name,
						last_name: data.last_name,
						nickname: data.nickname ?? "",
						email: data.email ?? "",
						country: data.country ?? "",
						city: data.city ?? "",
						address: data.address ?? "",
						shipping_company_name: data.shipping_company_name ?? "",
						shipping_company_phone: data.shipping_company_phone ?? "",
					};
					setForm(values);
					setSaved(values);
				}
				setLoading(false);
			});
	}, [userId, sessionLoading]);

	const changeTab = (next: Tab) => {
		setTab(next);
		const url = new URL(window.location.href);
		if (next === "orders") url.searchParams.set("tab", "orders");
		else url.searchParams.delete("tab");
		window.history.replaceState(null, "", url);
	};

	const update =
		(field: keyof ProfileForm) =>
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
			setForm((f) => ({ ...f, [field]: e.target.value }));

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user) return;

		const trimmed = Object.fromEntries(
			Object.entries(form).map(([key, value]) => [key, value.trim()])
		) as ProfileForm;
		if (!trimmed.first_name || !trimmed.last_name) {
			setError(t("nameRequired"));
			return;
		}
		if (trimmed.email && !EMAIL.test(trimmed.email)) {
			setError(t("invalidEmail"));
			return;
		}
		if (trimmed.shipping_company_phone && !PHONE.test(trimmed.shipping_company_phone)) {
			setError(t("invalidShippingPhone"));
			return;
		}

		setSaving(true);
		setError(null);
		const { error } = await supabase
			.from("profiles")
			.update({
				first_name: trimmed.first_name,
				last_name: trimmed.last_name,
				// Optional fields are stored as NULL when left empty.
				nickname: trimmed.nickname || null,
				email: trimmed.email || null,
				country: trimmed.country || null,
				city: trimmed.city || null,
				address: trimmed.address || null,
				shipping_company_name: trimmed.shipping_company_name || null,
				shipping_company_phone: trimmed.shipping_company_phone || null,
			})
			.eq("id", user.id);
		setSaving(false);

		if (error) {
			setError(t("genericError"));
			return;
		}
		setForm(trimmed);
		setSaved(trimmed);
		toast.success(t("saved"), { className: "p-4 bg-[#fffcf5]" });
	};

	const handleSignOut = async () => {
		await supabase.auth.signOut();
		router.replace("/");
	};

	const fullName = `${saved.first_name} ${saved.last_name}`.trim();
	const initials = (saved.first_name[0] ?? "") + (saved.last_name[0] ?? "");

	return (
		<main>
			<CustomHeroSection title={t("profile")} imageSrc="/bg-contact.webp" />
			<section className="bg-[url('/contact-page.png')] py-12 sm:py-16 px-4">
				<div className="max-w-3xl mx-auto flex flex-col gap-6 relative z-10">
					{sessionLoading || loading ? (
						<Card className="bg-[#fffcf5] rounded-[30px] p-8 shadow-lg">
							<p className="text-center text-gray-500 py-8">{t("loading")}</p>
						</Card>
					) : (
						<>
							{/* Who is signed in */}
							<Card className="bg-[#fffcf5] rounded-[30px] p-5 sm:p-6 shadow-lg flex flex-row items-center gap-4">
								<span
									aria-hidden
									className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#ffc85b] text-xl font-bold uppercase text-[#232B55]"
								>
									{initials || <UserRound className="h-6 w-6" />}
								</span>
								<div className="min-w-0 flex-1">
									<p className="truncate text-lg font-bold text-[#333333]">
										{saved.nickname || fullName || t("profile")}
									</p>
									{saved.nickname && fullName && (
										<p className="truncate text-sm text-gray-500">{fullName}</p>
									)}
									{phone ? (
										<p className="flex flex-wrap items-center gap-x-2 text-sm text-gray-600">
											<span dir="ltr">{phone}</span>
											<span className="flex items-center gap-1 text-xs text-green-600">
												<BadgeCheck className="h-4 w-4" />
												{t("phoneVerified")}
											</span>
										</p>
									) : (
										<p className="text-sm text-gray-500">{t("noPhone")}</p>
									)}
								</div>
								<Button
									type="button"
									variant="ghost"
									className="shrink-0 rounded-full text-gray-600"
									onClick={handleSignOut}
								>
									<LogOut className="rtl:rotate-180" />
									<span className="hidden sm:inline">{t("signOut")}</span>
								</Button>
							</Card>

							{/* Tabs */}
							<div
								role="tablist"
								aria-label={t("profile")}
								className="grid grid-cols-2 gap-1 rounded-full bg-white/80 p-1 shadow-sm"
							>
								{(
									[
										{ id: "info", label: t("tabInfo"), icon: UserRound },
										{ id: "orders", label: tCart("myOrders"), icon: Package },
									] as const
								).map(({ id, label, icon: Icon }) => (
									<button
										key={id}
										type="button"
										role="tab"
										id={`tab-${id}`}
										aria-selected={tab === id}
										aria-controls={`panel-${id}`}
										onClick={() => changeTab(id)}
										className={cn(
											"flex h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors",
											tab === id ? "bg-[#ffc85b] text-[#232B55]" : "text-gray-600 hover:bg-[#ffc85b]/20"
										)}
									>
										<Icon className="h-4 w-4" />
										{label}
									</button>
								))}
							</div>

							{tab === "info" ? (
								<Card
									role="tabpanel"
									id="panel-info"
									aria-labelledby="tab-info"
									className="bg-[#fffcf5] rounded-[30px] p-6 sm:p-8 shadow-lg"
								>
									<form onSubmit={handleSubmit} className="flex flex-col gap-8">
										<p className="text-sm text-gray-500">{t("profileSubtitle")}</p>

										<Section icon={UserRound} title={t("personalSection")} hint={t("personalSectionHint")}>
											<Field label={t("firstName")} required>
												<Input
													className={fieldClassName}
													value={form.first_name}
													onChange={update("first_name")}
													autoComplete="given-name"
													maxLength={100}
													required
												/>
											</Field>
											<Field label={t("lastName")} required>
												<Input
													className={fieldClassName}
													value={form.last_name}
													onChange={update("last_name")}
													autoComplete="family-name"
													maxLength={100}
													required
												/>
											</Field>
											<Field label={t("nickname")}>
												<Input
													className={fieldClassName}
													value={form.nickname}
													onChange={update("nickname")}
													autoComplete="nickname"
													maxLength={100}
												/>
											</Field>
											<Field label={t("email")}>
												<Input
													className={cn(fieldClassName, "rtl:text-right")}
													type="email"
													value={form.email}
													onChange={update("email")}
													autoComplete="email"
													dir="ltr"
													maxLength={255}
												/>
											</Field>
										</Section>

										<div className="h-px bg-gray-200" />

										<Section icon={MapPin} title={t("addressSection")} hint={t("addressSectionHint")}>
											<Field label={t("country")}>
												<select
													className={cn(
														fieldClassName,
														"w-full border border-input px-3 text-base md:text-sm outline-none"
													)}
													value={form.country}
													onChange={update("country")}
													autoComplete="country"
												>
													<option value="">{t("selectCountry")}</option>
													{countries.map(({ code, name }) => (
														<option key={code} value={code}>
															{name}
														</option>
													))}
												</select>
											</Field>
											<Field label={t("city")}>
												<Input
													className={fieldClassName}
													value={form.city}
													onChange={update("city")}
													autoComplete="address-level2"
													maxLength={100}
												/>
											</Field>
											<Field label={t("addressLine")} wide>
												<Textarea
													className="min-h-[88px] bg-white rounded-2xl focus:border-[#ffc85b] focus-visible:ring-0 py-3"
													value={form.address}
													onChange={update("address")}
													placeholder={t("addressLinePlaceholder")}
													autoComplete="street-address"
													maxLength={500}
												/>
											</Field>
										</Section>

										<div className="h-px bg-gray-200" />

										<Section icon={Truck} title={t("shippingSection")} hint={t("shippingSectionHint")}>
											<Field label={t("shippingCompanyName")}>
												<Input
													className={fieldClassName}
													value={form.shipping_company_name}
													onChange={update("shipping_company_name")}
													maxLength={100}
												/>
											</Field>
											<Field label={t("shippingCompanyPhone")}>
												<Input
													className={cn(fieldClassName, "rtl:text-right")}
													type="tel"
													value={form.shipping_company_phone}
													onChange={update("shipping_company_phone")}
													dir="ltr"
													maxLength={30}
												/>
											</Field>
										</Section>

										<div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
											<p className="text-xs text-gray-500">
												<span className="text-red-500">*</span> {t("requiredHint")}
											</p>
											<Button
												type="submit"
												variant="primary"
												className="h-12 sm:min-w-40"
												disabled={saving || !dirty}
											>
												{saving ? t("saving") : t("save")}
											</Button>
										</div>
										{error && (
											<p role="alert" className="text-red-500 text-sm -mt-4 ms-1">
												{error}
											</p>
										)}
									</form>
								</Card>
							) : (
								<Card
									role="tabpanel"
									id="panel-orders"
									aria-labelledby="tab-orders"
									className="bg-[#fffcf5] rounded-[30px] p-6 sm:p-8 shadow-lg"
								>
									<MyOrders />
								</Card>
							)}
						</>
					)}
				</div>
			</section>
		</main>
	);
};

export default ProfilePage;
