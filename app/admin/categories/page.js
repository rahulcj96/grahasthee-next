import React from 'react'
import { createClient } from '@supabase/supabase-js'
import CategoriesTable from '@/components/admin/CategoriesTable'
import PageTitle from '@/components/admin/PageTitle'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function getCategories() {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false })

    return categories || []
}

export default async function AdminCategoriesPage() {
    const categories = await getCategories()

    return (
        <div>
            <PageTitle>Categories</PageTitle>
            <CategoriesTable initialData={categories} />
        </div>
    )
}
