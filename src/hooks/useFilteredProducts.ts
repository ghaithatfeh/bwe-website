import { useMemo } from "react";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { filterProductsBySearch } from "@/lib/productSearch";

export const useFilteredProducts = (
	products: Product[],
	selectedCategory: Category | null,
	categories: Category[],
	searchQuery = ""
) => {
	return useMemo(() => {
		let result = products;

		if (selectedCategory) {
			// Check if it's a main category or subcategory
			const mainCategory = categories.find(
				(cat) => cat.id === selectedCategory.id
			);

			if (mainCategory?.sub_categories && mainCategory.sub_categories.length > 0) {
				// If it's a main category, show all products from its subcategories
				result = result.filter((product) =>
					mainCategory.sub_categories!.some(
						(sub) => sub.id === product.category_id
					)
				);
			} else {
				// If it's a subcategory, show products with that categoryId
				result = result.filter(
					(product) => product.category_id === selectedCategory.id
				);
			}
		}

		return filterProductsBySearch(result, searchQuery);
	}, [products, selectedCategory, categories, searchQuery]);
};
