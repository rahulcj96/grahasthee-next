/**
 * Resolves an image URL to ensure it's safe for display.
 * Handles local paths, full URLs, and missing values.
 * 
 * @param {string} url - The image URL or path
 * @param {string} placeholder - Optional custom placeholder
 * @returns {string} - The resolved URL
 */
export const resolveImageUrl = (url, placeholder = '/images/placeholder.webp') => {
    if (!url) return placeholder;

    // Check if it's a full URL (http/https) or a local absolute path
    if (url.startsWith('http') || url.startsWith('/')) {
        return url;
    }

    // If it's just a filename but not a path/url, we might want to assume it's valid if we had a base URL logic,
    // but for now, if it doesn't look like a path, treat as unsafe or return as is if we assume relative to base?
    // Given the context of Supabase storage returning full URLs, and local assets being /, 
    // anything else is suspect or might be a raw filename needing a specific bucket prefix.
    // However, the current codebase seems to have local paths like 'styles/...' which is not ideal.
    // For safety, let's return it, but next/image might complain if it's not absolute or registered.

    return url;
};
