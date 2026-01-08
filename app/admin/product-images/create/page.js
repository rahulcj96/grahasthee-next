import React from 'react'
import { createClient } from '@supabase/supabase-js'
import ProductImageForm from '@/components/admin/ProductImageForm'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function getFormData() {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const [ categoriesResult, productsResult ] = await Promise.all([
        supabase.from('categories').select('id, title').order('title'),
        supabase.from('products').select('id, title, category_id').order('title')
    ])

    return {
        categories: categoriesResult.data || [],
        products: productsResult.data || []
    }
}

export default async function CreateProductImagePage() {
    const { categories, products } = await getFormData()

    return (
        <ProductImageForm categories={categories} products={products} />
    )
}
