import { supabase } from '@/lib/supabaseClient'

export const productService = {
    /**
     * Deletes a product and its associated images.
     * @param {string|number} id - The product ID.
     */
    deleteProduct: async (id) => {
        // Delete associated images first (Cascade delete typically handles this in DB, but explicit here for safety/logic parity)
        const { error: imagesError } = await supabase
            .from('product_images')
            .delete()
            .eq('product_id', id)

        if (imagesError) throw imagesError

        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    },

    /**
     * Imports products from parsed CSV data.
     * Handles upserting products and syncing images.
     * @param {Array} resultData - The parsed data from CSVHelper.
     */
    importProducts: async (resultData) => {
        const data = resultData.map(item => ({
            title: item.title,
            slug: item.slug,
            sku: item.sku,
            price: parseFloat(item.price) || 0,
            compare_at_price: item.compare_at_price ? parseFloat(item.compare_at_price) : null,
            stock_quantity: parseInt(item.stock_quantity) || 0,
            category_id: item.category_id ? parseInt(item.category_id) : null,
            description: item.description || null,
            is_new_arrival: item.is_new_arrival === 'true' || item.is_new_arrival === '1',
            is_best_seller: item.is_best_seller === 'true' || item.is_best_seller === '1',
            ...(item.id ? { id: parseInt(item.id) } : {})
        }))

        // Process upserts sequentially
        for (let i = 0; i < data.length; i++) {
            const product = data[ i ]
            const imagesString = resultData[ i ].images

            const { data: upsertedProduct, error: productError } = await supabase
                .from('products')
                .upsert(product, { onConflict: 'sku' })
                .select()
                .single()

            if (productError) throw productError

            // Handle Images if provided
            if (imagesString && upsertedProduct) {
                // Parse URLs
                const imageUrls = imagesString.split(',').map(url => url.trim()).filter(url => url)

                if (imageUrls.length > 0) {
                    // Delete existing images 
                    const { error: deleteError } = await supabase
                        .from('product_images')
                        .delete()
                        .eq('product_id', upsertedProduct.id)

                    if (deleteError) throw deleteError

                    // Insert new images
                    const imageInserts = imageUrls.map((url, index) => ({
                        product_id: upsertedProduct.id,
                        image_url: url,
                        is_primary: index === 0, // First image is primary
                        display_order: index,
                        alt_text: upsertedProduct.title
                    }))

                    const { error: insertError } = await supabase
                        .from('product_images')
                        .insert(imageInserts)

                    if (insertError) throw insertError
                }
            }
        }
        return true
    },

    // Extracted logic to avoid duplication if needed, 
    // but for now let's just implement upsertProduct separately as it handles single item + specific image logic differently (wiping all vs selective) or similar.
    // Actually, on second thought, let's keep it simple.

    /**
     * Upsert a single product and logic for managing its images.
     * @param {Object} productData - The product fields to upsert.
     * @param {Array} fileList - Array of file objects with url property. 
     * @param {string|number} [currentId] - ID if updating.
     */
    upsertProduct: async (productData, fileList, currentId) => {
        // 1. Upsert Product
        let upsertedId = currentId
        const payload = { ...productData }

        if (upsertedId) {
            const { error } = await supabase
                .from('products')
                .update(payload)
                .eq('id', upsertedId)
            if (error) throw error
        } else {
            const { data, error } = await supabase
                .from('products')
                .insert([ payload ])
                .select()
                .single()
            if (error) throw error
            upsertedId = data.id
        }

        // 2. Handle Images
        // Strategy: Wipe and Replace for this specific product to ensure order and content matches UI state.
        if (upsertedId) {
            const { error: deleteError } = await supabase
                .from('product_images')
                .delete()
                .eq('product_id', upsertedId)
            if (deleteError) throw deleteError

            if (fileList && fileList.length > 0) {
                const imageInserts = fileList.map((file, index) => ({
                    product_id: upsertedId,
                    image_url: file.url,
                    is_primary: index === 0,
                    display_order: index,
                    alt_text: productData.title
                }))

                const { error: insertError } = await supabase
                    .from('product_images')
                    .insert(imageInserts)
                if (insertError) throw insertError
            }
        }

        return upsertedId
    },

    // Renamed for internal clarity if we needed to reuse, but for now duplicate logic in import is fine as import parsing is specific.
    // We will leave importProducts as is for now.

}
