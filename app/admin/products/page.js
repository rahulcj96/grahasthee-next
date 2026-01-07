import React from 'react'
import { createClient } from '@supabase/supabase-js'
import ProductsTable from '@/components/admin/ProductsTable'
import PageTitle from '@/components/admin/PageTitle'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function getProducts() {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data: products } = await supabase
        .from('products')
        .select(`
      *,
      categories (
        title
      ),
      product_images (
        image_url
      )
    `)
        .order('created_at', { ascending: false })

    // Transform data for table if needed
    return products.map(p => ({
        ...p,
        category: p.categories?.title || 'Uncategorized',
        images: p.product_images?.map(img => img.image_url) || []
    }))
}

export default async function AdminProductsPage() {
    const products = await getProducts()

    return (
        <div>
            <PageTitle>Products</PageTitle>
            <ProductsTable initialData={products} />
        </div>
    )
}
