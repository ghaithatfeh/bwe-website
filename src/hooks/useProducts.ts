import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { normalizeColors } from "@/lib/colors";

export const useProducts = () => {
	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchProducts = async () => {
		setLoading(true);
		setError(null);
		
		try {
			const productsResult = await supabase
				.from("products")
				.select("*");

			if (productsResult.error) {
				throw new Error(productsResult.error.message);
			}

			const data: Product[] = (productsResult.data || []).map((p) => ({
				...p,
				colors: normalizeColors(p.colors),
			}));
			setProducts(data);
		} catch (err) {
			const error = err instanceof Error ? err : new Error("Failed to fetch products");
			setError(error);
			toast.error("Failed to fetch products");
			console.error("Products error:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	return {
		products,
		loading,
		error,
		refetch: fetchProducts,
	};
};

