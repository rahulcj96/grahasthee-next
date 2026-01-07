import React from 'react'
import { createClient } from '@supabase/supabase-js'
import ProductForm from '@/components/admin/ProductForm'
import { notFound } from 'next/navigation'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function getData(id) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const [ productResponse, categoriesResponse ] = await Promise.all([
        supabase.from('products').select('*, product_images(image_url)').eq('id', id).single(),
        supabase.from('categories').select('id, title').order('title')
    ])

    if (productResponse.error || !productResponse.data) {
        return { product: null, categories: [] }
    }

    // Transform product images to simple array for consistency with form expectations
    const product = {
        ...productResponse.data,
        images: productResponse.data.product_images?.map(img => img.image_url) || []
    }

    return {
        product,
        categories: categoriesResponse.data || []
    }
}

export default async function EditProductPage({ params }) {
    const { id } = await params
    const { product, categories } = await getData(id)

    if (!product) {
        notFound()
    }

    return (
        <ProductForm
            title={`Edit Product: ${product.title}`}
            initialValues={product}
            categories={categories}
        />
    )
}
