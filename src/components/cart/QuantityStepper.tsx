"use client";

import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { clampQuantity, MAX_BOXES } from "@/lib/cart";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
	value: number;
	onChange: (value: number) => void;
	className?: string;
}

const QuantityStepper = ({ value, onChange, className }: QuantityStepperProps) => {
	const t = useTranslations("Cart");

	return (
		<div className={cn("inline-flex items-center rounded-full border bg-white h-11", className)}>
			<button
				type="button"
				className="h-full px-3 text-[#232B55] disabled:opacity-40"
				onClick={() => onChange(value - 1)}
				disabled={value <= 1}
				aria-label={t("decrease")}
			>
				<Minus className="w-4 h-4" />
			</button>
			<input
				type="number"
				inputMode="numeric"
				min={1}
				max={MAX_BOXES}
				value={value}
				onChange={(e) => onChange(clampQuantity(Number(e.target.value)))}
				className="w-14 text-center bg-transparent font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
				aria-label={t("boxes")}
			/>
			<button
				type="button"
				className="h-full px-3 text-[#232B55] disabled:opacity-40"
				onClick={() => onChange(value + 1)}
				disabled={value >= MAX_BOXES}
				aria-label={t("increase")}
			>
				<Plus className="w-4 h-4" />
			</button>
		</div>
	);
};

export default QuantityStepper;
