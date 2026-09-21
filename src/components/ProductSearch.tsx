"use client";

import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProductSearchProps {
	value: string;
	onChange: (value: string) => void;
	className?: string;
}

export const ProductSearch = ({
	value,
	onChange,
	className,
}: ProductSearchProps) => {
	const t = useTranslations();

	return (
		<div className={`relative ${className ?? ""}`}>
			<Search className="absolute top-1/2 -translate-y-1/2 ltr:left-4 rtl:right-4 h-5 w-5 text-[#9CA3AF] pointer-events-none" />
			<Input
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={t("Search by product name or code")}
				aria-label={t("Search products")}
				className="h-12 rounded-full bg-white border-gray-200 ltr:pl-12 rtl:pr-12 ltr:pr-12 rtl:pl-12 text-base shadow-sm focus-visible:ring-[#DC2626]"
			/>
			{value && (
				<button
					type="button"
					onClick={() => onChange("")}
					aria-label={t("Clear search")}
					className="absolute top-1/2 -translate-y-1/2 ltr:right-4 rtl:left-4 text-[#9CA3AF] hover:text-[#333333] transition-colors"
				>
					<X className="h-5 w-5" />
				</button>
			)}
		</div>
	);
};
