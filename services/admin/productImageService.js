import { supabase } from '@/lib/supabaseClient'

export const productImageService = {
    /**
     * Sets a specific image as the primary image for a product.
     * @param {string|number} imageId 
     * @param {string|number} productId 
     */
    setPrimaryImage: async (imageId, productId) => {
        // 1. Set all images for this product to non-primary
        const { error: resetError } = await supabase
            .from('product_images')
            .update({ is_primary: false })
            .eq('product_id', productId)

        if (resetError) throw resetError

        // 2. Set the selected image as primary
        const { error: updateError } = await supabase
            .from('product_images')
            .update({ is_primary: true })
            .eq('id', imageId)

        if (updateError) throw updateError

        return true
    },

    /**
     * Deletes a product image and handles primary reassignment if necessary.
     * @param {string|number} id - Image ID.
     */
    deleteProductImage: async (id) => {
        // 1. Check if this is the primary image
        const { data: imageRecord, error: fetchError } = await supabase
            .from('product_images')
            .select('*')
            .eq('id', id)
            .single()

        if (fetchError) throw fetchError

        // 2. Delete the record
        const { error: deleteError } = await supabase
            .from('product_images')
            .delete()
            .eq('id', id)

        if (deleteError) throw deleteError

        let message = 'Image deleted successfully'

        // 3. Reassign primary if needed
        if (imageRecord.is_primary) {
            // Find another image for this product
            const { data: remainingImages, error: searchError } = await supabase
                .from('product_images')
                .select('*')
                .eq('product_id', imageRecord.product_id)
                .order('created_at', { ascending: true })
                .limit(1)

            if (searchError) console.error('Error finding replacement primary:', searchError)

            if (remainingImages && remainingImages.length > 0) {
                const newPrimary = remainingImages[ 0 ]
                const { error: updateError } = await supabase
                    .from('product_images')
                    .update({ is_primary: true })
                    .eq('id', newPrimary.id)

                if (updateError) {
                    console.error('Error setting new primary:', updateError)
                    message = 'Image deleted, but failed to set new primary.'
                } else {
                    message = 'Image deleted. New primary image assigned.'
                }
            } else {
                message = 'Image deleted. No images remaining for product.'
            }
        }

        return { success: true, message }
    },

    /**
     * Adds multiple images to a product.
     * @param {string|number} productId 
     * @param {Array} fileList - List of files with 'url' property.
     * @param {Array} products - List of products to lookup title for alt text.
     */
    addProductImages: async (productId, fileList, products = []) => {
        // 1. Check if product already has images and get the count
        const { data: existingImages, error: fetchError } = await supabase
            .from('product_images')
            .select('*')
            .eq('product_id', productId)
            .order('display_order', { ascending: true });

        if (fetchError) throw fetchError;

        const hasPrimaryImage = existingImages?.some(img => img.is_primary);
        const startingDisplayOrder = existingImages?.length || 0;

        // 2. Prepare image inserts
        const imageInserts = fileList.map((file, index) => ({
            product_id: productId,
            image_url: file.url,
            // First image is primary only if product doesn't have a primary image
            is_primary: !hasPrimaryImage && index === 0,
            // Continue display order from existing images
            display_order: startingDisplayOrder + index,
            alt_text: products.find(p => p.id === productId)?.title || 'Product Image'
        }));

        // 3. Insert all images
        const { error: insertError } = await supabase
            .from('product_images')
            .insert(imageInserts);

        if (insertError) throw insertError;

        return true
    }
}
