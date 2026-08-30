"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import ProductCard from "@/components/ProductCard";
import Pagination from "@/components/Pagination";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { ProductCardSkeleton } from "@/components/skeletons/ProductCardSkeleton";
import { usePagination } from "@/hooks/usePagination";

const PRODUCTS_PER_PAGE = 9;

interface ProductsGridProps {
	products: Product[];
	loading: boolean;
	selectedCategory: Category | null;
	locale: "en" | "ar" | "fr";
	onProductClick: (product: Product) => void;
}

export const ProductsGrid = ({
	products,
	loading,
	selectedCategory,
	locale,
	onProductClick,
}: ProductsGridProps) => {
	const t = useTranslations();
	const gridTopRef = useRef<HTMLDivElement>(null);

	const {
		currentPage,
		totalPages,
		totalItems,
		paginatedItems,
		pageRange,
		goToPage,
		nextPage,
		previousPage,
		firstItemIndex,
		lastItemIndex,
	} = usePagination({
		items: products,
		pageSize: PRODUCTS_PER_PAGE,
		resetKey: selectedCategory?.id ?? "all",
	});

	const scrollToTop = () => {
		const top = gridTopRef.current?.getBoundingClientRect().top;
		if (top === undefined) return;
		window.scrollTo({ top: window.scrollY + top - 20, behavior: "smooth" });
	};

	const handlePageChange = (page: number) => {
		goToPage(page);
		scrollToTop();
	};

	return (
		<div ref={gridTopRef}>
			<div className="flex flex-wrap items-center justify-between gap-2 mb-6">
				<h3 className="text-[#333333] text-xl font-semibold">
					{selectedCategory
						? `${selectedCategory[`title_${locale}`]}`
						: t("All Products")}
				</h3>

				{!loading && totalItems > 0 && (
					<p className="text-[#6B7280] text-sm">
						{t("Showing products range", {
							from: firstItemIndex,
							to: lastItemIndex,
							total: totalItems,
						})}
					</p>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
				{loading ? (
					<>
						{[...Array(6)].map((_, i) => (
							<ProductCardSkeleton key={i} />
						))}
					</>
				) : (
					paginatedItems.map((product, index) => (
						<ProductCard
							key={index}
							code={product.code}
							title={product[`title_${locale}`]}
							image={product.primary_image_url || ""}
							colors={product.colors?.slice(0, 3) || []}
							additionalColors={product.additional_colors || 0}
							onClick={() => onProductClick(product)}
						/>
					))
				)}
			</div>

			{!loading && (
				<Pagination
					currentPage={currentPage}
					totalPages={totalPages}
					pageRange={pageRange}
					onPageChange={handlePageChange}
					onNext={() => {
						nextPage();
						scrollToTop();
					}}
					onPrevious={() => {
						previousPage();
						scrollToTop();
					}}
				/>
			)}
		</div>
	);
};
