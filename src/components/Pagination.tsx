"use client";

import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DOTS } from "@/hooks/usePagination";
import { cn } from "@/lib/utils";

interface PaginationProps {
	currentPage: number;
	totalPages: number;
	pageRange: (number | typeof DOTS)[];
	onPageChange: (page: number) => void;
	onNext: () => void;
	onPrevious: () => void;
}

const Pagination = ({
	currentPage,
	totalPages,
	pageRange,
	onPageChange,
	onNext,
	onPrevious,
}: PaginationProps) => {
	const t = useTranslations();
	const locale = useLocale() as "en" | "ar" | "fr";
	const isRtl = locale === "ar";

	if (totalPages <= 1) return null;

	const PreviousIcon = isRtl ? ChevronRight : ChevronLeft;
	const NextIcon = isRtl ? ChevronLeft : ChevronRight;

	const arrowClasses =
		"flex items-center justify-center h-11 w-11 rounded-full bg-white border border-gray-200 text-[#232B55] shadow-sm transition-all duration-300 hover:bg-[#232B55] hover:border-[#232B55] hover:text-white disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none";

	return (
		<nav
			className="flex items-center justify-center gap-2 mt-10"
			aria-label={t("Products pagination")}
		>
			{/* Previous */}
			<button
				type="button"
				onClick={onPrevious}
				disabled={currentPage === 1}
				aria-label={t("Previous")}
				className={arrowClasses}
			>
				<PreviousIcon className="w-5 h-5" />
			</button>

			{/* Compact indicator on small screens */}
			<span className="sm:hidden px-4 text-base text-[#6B7280] font-medium">
				<span className="text-[#232B55] font-semibold">{currentPage}</span>
				{` / ${totalPages}`}
			</span>

			{/* Page numbers */}
			<div className="hidden sm:flex items-center gap-2">
				{pageRange.map((page, index) => {
					if (page === DOTS) {
						return (
							<span
								key={`dots-${index}`}
								className="flex items-end justify-center h-11 w-8 pb-3 text-[#6B7280]"
								aria-hidden="true"
							>
								&hellip;
							</span>
						);
					}

					const isActive = page === currentPage;

					return (
						<button
							key={page}
							type="button"
							onClick={() => onPageChange(page)}
							aria-current={isActive ? "page" : undefined}
							aria-label={`${t("Page")} ${page}`}
							className={cn(
								"h-11 min-w-11 px-3 pt-1 rounded-full text-base font-semibold transition-all duration-300",
								isActive
									? "bg-[#232B55] text-white shadow-md"
									: "bg-white border border-gray-200 text-[#6B7280] shadow-sm hover:text-[#DC2626] hover:border-[#DC2626]"
							)}
						>
							{page}
						</button>
					);
				})}
			</div>

			{/* Next */}
			<button
				type="button"
				onClick={onNext}
				disabled={currentPage === totalPages}
				aria-label={t("Next")}
				className={arrowClasses}
			>
				<NextIcon className="w-5 h-5" />
			</button>
		</nav>
	);
};

export default Pagination;
