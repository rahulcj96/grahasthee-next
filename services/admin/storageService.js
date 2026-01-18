import { supabase } from '@/lib/supabaseClient'

export const storageService = {
    /**
     * Uploads a file to a Supabase storage bucket.
     * @param {string} bucket - The storage bucket name (e.g., 'product-images').
     * @param {File} file - The file to upload.
     * @returns {Promise<string>} - The public URL of the uploaded file.
     */
    uploadImage: async (bucket, file) => {
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath)

            return data.publicUrl
        } catch (error) {
            console.error('Upload error:', error)
            throw error
        }
    }
}
