import React from 'react'
import { createClient } from '@supabase/supabase-js'
import DashboardClient from '@/components/admin/DashboardClient'



const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function getStats() {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    const { count: productCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

    const { count: categoryCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true })

    const { count: orderCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

    return {
        productCount: productCount || 0,
        categoryCount: categoryCount || 0,
        orderCount: orderCount || 0,
    }
}

export default async function AdminDashboardPage() {
    const stats = await getStats()

    return (
        <div>
            <DashboardClient stats={stats} />
        </div>
    )
}
