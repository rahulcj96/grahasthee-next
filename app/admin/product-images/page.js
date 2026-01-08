import React from 'react'
import { createClient } from '@supabase/supabase-js'
import ProductImagesTable from '@/components/admin/ProductImagesTable'
import PageTitle from '@/components/admin/PageTitle'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function getProductImages() {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data } = await supabase
        .from('product_images')
        .select(`
      *,
      products (
        title
      )
    `)
        .order('created_at', { ascending: false })

    return (data || []).map(item => ({
        ...item,
        product_title: item.products?.title || 'No Product Linked'
    }))
}

async function getProducts() {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data: products } = await supabase
        .from('products')
        .select('id, title')
        .order('title', { ascending: true })

    return products || []
}

export default async function AdminProductImagesPage() {
    const images = await getProductImages()
    const products = await getProducts()

    return (
        <div>
            <PageTitle>Product Images</PageTitle>
            <ProductImagesTable initialData={images} products={products} />
        </div>
    )
}
