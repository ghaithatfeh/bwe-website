"use client";

import { Card } from "@/components/ui/card";
import { getColorSwatchStyle } from "@/lib/colors";
import { useTranslations } from "next-intl";

interface FeaturedProductCardProps {
	code: string;
	title: string;
	material: string;
	length: string;
	weight?: string;
	diameter?: string;
	image: string;
	colors?: string[];
	additionalColors?: number;
	onClick?: () => void;
}

const FeaturedProductCard = ({
	code,
	title,
	material,
	length,
	weight,
	diameter,
	image,
	colors = [],
	additionalColors = 0,
	onClick,
}: FeaturedProductCardProps) => {
	const t = useTranslations();

	return (
		<Card 
			className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
			onClick={onClick}
		>
			<div className="flex flex-col md:flex-row">
				{/* Product Image */}
				<div className="relative bg-[#B5B5B5] md:w-1/2 aspect-square md:aspect-auto flex items-center justify-center">
					<div className="absolute top-4 ltr:left-4 rtl:right-4 z-10">
						<span className="bg-[#DC2626] text-white px-4 py-1 rounded-full text-sm font-semibold">
							{t("Featured")}
						</span>
					</div>
                    <div className="w-full h-full overflow-hidden">
                        <img
                            src={image}
                            alt={title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
				</div>

				{/* Product Details */}
				<div className="md:w-1/2 p-5 flex flex-col justify-center">
					{/* Product Code */}
					<p className="text-[#DC2626] text-base font-medium">
						{t("Product Code")}: {code}
					</p>

					{/* Product Title */}
					<h3 className="text-[#333333] text-xl font-bold my-3 leading-tight">
						{title}
					</h3>

					{/* Product Specifications */}
					<div className="space-y-1 mb-2">
						<p className="text-[#9CA3AF] text-base">
							<span className="font-medium">{t("Type Material")}:</span> {material}
						</p>
						<p className="text-[#9CA3AF] text-base">
							<span className="font-medium">{t("Length Piece")}:</span> {length} {t("mm")}
						</p>
						{weight && (
							<p className="text-[#9CA3AF] text-base">
								<span className="font-medium">{t("Weight Piece")}:</span> {weight} {t("g")}
							</p>
						)}
						{diameter && (
							<p className="text-[#9CA3AF] text-base">
								<span className="font-medium">{t("Diameter Piece")}:</span> {diameter} {t("mm")}
							</p>
						)}
					</div>

					{/* Color Options */}
					{colors.length > 0 && (
						<div className="flex flex-wrap items-center gap-3 pt-2">
							{colors.map((color, index) => (
								<div
									key={index}
									className="w-10 h-10 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform"
									style={getColorSwatchStyle(color)}
									title={color}
								/>
							))}
							{additionalColors > 0 && (
								<div className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-[#333333] font-bold text-lg cursor-pointer hover:scale-110 transition-transform shadow-lg">
									+{additionalColors}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</Card>
	);
};

export default FeaturedProductCard;

