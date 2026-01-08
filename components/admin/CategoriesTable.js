'use client'

import React, { useState } from 'react'
import { Table, Button, Input, Space, Image, Popconfirm, message } from 'antd'
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { resolveImageUrl } from '@/utils/imageUtils'

export default function CategoriesTable({ initialData }) {
    const [ searchText, setSearchText ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const [ messageApi, contextHolder ] = message.useMessage()
    const router = useRouter()

    const handleDelete = async (id) => {
        try {
            setLoading(true)
            console.log('Attempting to delete category:', id)

            // Check for existing products
            const { count, error: countError } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true })
                .eq('category_id', id)

            if (countError) throw countError
            console.log('Product count for category:', count)

            if (count > 0) {
                messageApi.warning(`Cannot delete category. It has ${count} products associated with it.`)
                return
            }

            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id)

            if (error) throw error

            messageApi.success('Category deleted successfully')
            router.refresh()
        } catch (error) {
            messageApi.error('Failed to delete category')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image_url',
            key: 'image',
            render: (url) => (
                <Image
                    src={resolveImageUrl(url)}
                    width={50}
                    height={50}
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                    fallback="/images/placeholder.webp"
                />
            ),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            filteredValue: [ searchText ],
            onFilter: (value, record) => {
                return String(record.title).toLowerCase().includes(value.toLowerCase())
            },
        },
        {
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Link href={`/admin/categories/${record.id}`}>
                        <Button icon={<EditOutlined />} size="small">Edit</Button>
                    </Link>
                    <Popconfirm
                        title="Delete this category?"
                        description="Are you sure to delete this category?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger size="small" loading={loading} />
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    return (
        <div>
            {contextHolder}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Input
                    placeholder="Search categories..."
                    prefix={<SearchOutlined />}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                />
                <Link href="/admin/categories/create">
                    <Button type="primary" icon={<PlusOutlined />}>Create Category</Button>
                </Link>
            </div>
            <Table
                columns={columns}
                dataSource={initialData}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />
        </div>
    )
}
