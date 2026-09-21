import { useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import FeaturedProductCard from "@/components/FeaturedProductCard";
import { Product } from "@/types/product";
import { FeaturedProductSkeleton } from "@/components/skeletons/FeaturedProductSkeleton";
import { normalizeColors } from "@/lib/colors";

interface FeaturedProductsSectionProps {
	products: Product[];
	loading: boolean;
	locale: "en" | "ar" | "fr";
	onProductClick: (product: Product) => void;
}

export const FeaturedProductsSection = ({
	products,
	loading,
	locale,
	onProductClick,
}: FeaturedProductsSectionProps) => {
	const t = useTranslations();
	const featuredProducts = products.filter((product) => product.is_featured);

	return (
		<>
			<h3 className="text-[#333333] text-xl font-semibold mb-6">
				{t("Featured Product")}
			</h3>

			{loading || products.length === 0 ? (
				<>
					{/* Mobile Skeleton */}
					<div className="sm:hidden">
						<FeaturedProductSkeleton />
					</div>

					{/* Desktop Skeleton */}
					<div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
						<FeaturedProductSkeleton />
						<FeaturedProductSkeleton />
					</div>
				</>
			) : (
				<>
					{/* Mobile Swiper */}
					<div className="sm:hidden">
						<Swiper
							spaceBetween={20}
							slidesPerView={1.3}
							loop={false}
							autoplay={{
								delay: 3000,
								disableOnInteraction: false,
							}}
							modules={[Autoplay]}
						>
							{featuredProducts.map((product, index) => (
								<SwiperSlide key={index} className="pb-8">
									<FeaturedProductCard
										code={product.code}
										title={product[`title_${locale}`]}
										material={product[`material_${locale}`]}
										length={product.length?.toString() || ""}
										weight={product.weight?.toString()}
										diameter={product.diameter?.toString()}
										image={product.images?.[0] || ""}
										colors={normalizeColors(product.colors).slice(0, 3)}
										additionalColors={product.additional_colors || 0}
										onClick={() => onProductClick(product)}
									/>
								</SwiperSlide>
							))}
						</Swiper>
					</div>

					{/* Desktop Grid */}
					<div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
						{featuredProducts.map((product, index) => (
							<FeaturedProductCard
								key={index}
								code={product.code}
								title={product[`title_${locale}`]}
								material={product[`material_${locale}`]}
								length={product.length?.toString() || ""}
								weight={product.weight?.toString()}
								diameter={product.diameter?.toString()}
								image={product.images?.[0] || ""}
								colors={normalizeColors(product.colors).slice(0, 3)}
								additionalColors={product.additional_colors || 0}
								onClick={() => onProductClick(product)}
							/>
						))}
					</div>
				</>
			)}
		</>
	);
};

