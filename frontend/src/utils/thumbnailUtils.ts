/**
 * Generates a thumbnail path for a given category name
 * 
 * @param categoryName - The name of the category
 * @param customThumbnail - Optional custom thumbnail path that takes precedence if provided
 * @returns The path to the category thumbnail image
 */
export function getCategoryThumbnail(categoryName?: string, customThumbnail?: string): string {
	if (customThumbnail) {
	  return customThumbnail;
	}
	
	if (!categoryName) {
	  return '/images/category_thumbnails/default.webp';
	}
  
	// Convert to lowercase, replace spaces with underscores, and remove all other special characters
	const formattedName = categoryName
	  .toLowerCase()
	  .replace(/ /g, '_')    // Replace spaces with underscores
	  .replace(/[^a-z0-9_]/g, ''); // Remove all other non-alphanumeric characters except underscores
	
	return `/images/category_thumbnails/${formattedName}.webp`;
  }