/**
 * Utility functions for parsing URLs and extracting category/subcategory codes
 */

export interface ParsedBannerUrl {
  categoryCode: string | null;
  subCategoryCode: string | null;
}

/**
 * Parses a banner TagUrl to extract category and subcategory codes
 * @param tagUrl - The URL from banner TagUrl field (e.g., "https://souqmaria.com/AllProducts/3034C005" or "https://souqmaria.com/AllProducts/3034C005/3034SC001")
 * @returns Object containing categoryCode and subCategoryCode (if exists)
 */
export function parseBannerUrl(tagUrl: string): ParsedBannerUrl {
  try {
    // Remove any leading/trailing whitespace
    const cleanUrl = tagUrl.trim();
    
    // Extract the path after the domain
    const url = new URL(cleanUrl);
    const pathSegments = url.pathname.split('/').filter(segment => segment.length > 0);
    
    // Expected format: /AllProducts/CATEGORY_CODE or /AllProducts/CATEGORY_CODE/SUBCATEGORY_CODE
    if (pathSegments.length >= 2 && pathSegments[0] === 'AllProducts') {
      const categoryCode = pathSegments[1];
      const subCategoryCode = pathSegments.length >= 3 ? pathSegments[2] : null;
      
      return {
        categoryCode,
        subCategoryCode
      };
    }
    
    // If URL doesn't match expected format, return null values
    return {
      categoryCode: null,
      subCategoryCode: null
    };
  } catch (error) {
    console.error('Error parsing banner URL:', error);
    return {
      categoryCode: null,
      subCategoryCode: null
    };
  }
}

/**
 * Validates if a string looks like a category code (basic validation)
 * @param code - The code to validate
 * @returns boolean indicating if the code looks valid
 */
export function isValidCategoryCode(code: string): boolean {
  // Basic validation: should contain letters and numbers, typically starts with numbers
  return /^[0-9A-Za-z]+$/.test(code) && code.length > 3;
} 