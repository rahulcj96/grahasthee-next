import React from 'react'
import { createClient } from '@supabase/supabase-js'
import CategoryForm from '@/components/admin/CategoryForm'
import { notFound } from 'next/navigation'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function getCategory(id) {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { data: category, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !category) {
        return null
    }

    return category
}

export default async function EditCategoryPage({ params }) {
    const { id } = await params
    const category = await getCategory(id)

    if (!category) {
        notFound()
    }

    return (
        <CategoryForm
            title={`Edit Category: ${category.title}`}
            initialValues={category}
        />
    )
}
