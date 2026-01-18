import React from 'react'
import AdminClientLayout from '@/components/admin/AdminClientLayout'

export const dynamic = 'force-dynamic' // Force dynamic rendering for all admin pages

export default function AdminLayout({ children }) {
    return (
        <AdminClientLayout>
            {children}
        </AdminClientLayout>
    )
}
