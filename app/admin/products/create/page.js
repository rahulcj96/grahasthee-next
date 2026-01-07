import React from 'react'
import { createClient } from '@supabase/supabase-js'
import ProductForm from '@/components/admin/ProductForm'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function getCategories() {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    const { data } = await supabase.from('categories').select('id, title').order('title')
    return data || []
}

export default async function CreateProductPage() {
    const categories = await getCategories()

    return (
        <ProductForm title="Create New Product" categories={categories} />
    )
}
