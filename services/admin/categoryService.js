import { supabase } from '@/lib/supabaseClient'

export const categoryService = {
    /**
     * Deletes a category if it has no associated products.
     * @param {string|number} id - The category ID.
     */
    deleteCategory: async (id) => {
        // Check for existing products
        const { count, error: countError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', id)

        if (countError) throw countError

        if (count > 0) {
            return { success: false, error: 'Cannot delete category. It has products associated with it.', count }
        }

        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id)

        if (error) throw error

        return { success: true }
    },

    /**
     * Imports categories from parsed CSV data.
     * @param {Array} resultData - The parsed data from CSVHelper.
     */
    importCategories: async (resultData) => {
        const data = resultData.map(item => ({
            title: item.title,
            slug: item.slug,
            description: item.description || null,
            image_url: item.image_url || null,
            tagline: item.tagline || null,
            ...(item.id ? { id: parseInt(item.id) } : {})
        }))

        const { error } = await supabase
            .from('categories')
            .upsert(data, { onConflict: 'slug' })

        if (error) throw error

        return true
    },

    /**
     * Upsert a single category.
     * @param {Object} categoryData - The category data to insert/update.
     * @param {string|number} [id] - The category ID if updating.
     */
    upsertCategory: async (categoryData, id) => {
        if (id) {
            const { error } = await supabase
                .from('categories')
                .update(categoryData)
                .eq('id', id)
            if (error) throw error
        } else {
            const { error } = await supabase
                .from('categories')
                .insert([ categoryData ])
            if (error) throw error
        }
        return true
    }
}
