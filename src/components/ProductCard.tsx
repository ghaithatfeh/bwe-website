"use client";

import { Card } from "@/components/ui/card";
import { getColorSwatchStyle } from "@/lib/colors";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductProps {
	code: string;
	title: string;
	image: string;
	colors?: string[];
	additionalColors?: number;
	onClick?: () => void;
}

const ProductCard = ({
	code,
	title,
	image,
	colors = [],
	additionalColors = 0,
	onClick,
}: ProductProps) => {
	const t = useTranslations();
	const locale = useLocale() as "en" | "ar" | "fr";
	return (
		<Card 
			className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
			onClick={onClick}
		>
			{/* Product Image */}
			<div className="relative aspect-square flex items-center justify-center rounded-t-3xl">

                <div className="w-full h-full overflow-hidden">
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
				
				{/* Color Options Overlay */}
				{colors.length > 0 && (
                    // bg-white/90 backdrop-blur-sm shadow-md
					<div className="absolute -bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 rounded-full">
						{colors.map((color, index) => (
							<div
								key={index}
								className="w-10 h-10 rounded-full border-2 border-white shadow-sm cursor-pointer hover:scale-110 transition-transform"
								style={getColorSwatchStyle(color)}
								title={color}
							/>
						))}
						{additionalColors > 0 && (
							<div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-[#333333] font-bold text-sm cursor-pointer hover:scale-110 transition-transform shadow-sm">
								+{additionalColors}
							</div>
						)}
					</div>
				)}
			</div>

			{/* Product Details */}
			<div className="p-6 mt-5">
				{/* Product Code */}
				<p className="text-[#DC2626] text-sm font-medium mb-2">
					{t("Product Code")}: {code}
				</p>

				{/* Product Title */}
				<h3 className="text-[#333333] text-xl font-bold mb-3 leading-tight">
					{title}
				</h3>

			{/* Learn More Link */}
			<button
				className="text-sm inline-flex text-[#232B55] font-semibold group-hover:gap-1 transition-all leading-[1.6]"
			>
				{t("Learn More")}
				{locale === "ar" ? (
					<ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
				) : (
					<ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
				)}
			</button>
			</div>
		</Card>
	);
};

export default ProductCard;

