'use client'

import React, { useState, useRef } from 'react'
import { Table, Button, Input, Space, Image, Popconfirm, message } from 'antd'
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined, ExportOutlined, ImportOutlined } from '@ant-design/icons'
import Papa from 'papaparse'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { resolveImageUrl } from '@/utils/imageUtils'

export default function CategoriesTable({ initialData }) {
    const [ searchText, setSearchText ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const [ messageApi, contextHolder ] = message.useMessage()
    const router = useRouter()
    const fileInputRef = useRef(null)

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

    const handleExportCSV = () => {
        const csv = Papa.unparse(initialData)
        const blob = new Blob([ csv ], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `categories_export_${new Date().toISOString().split('T')[ 0 ]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleImportCSV = (e) => {
        const file = e.target.files[ 0 ]
        if (!file) return

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    setLoading(true)
                    const data = results.data.map(item => ({
                        title: item.title,
                        slug: item.slug,
                        description: item.description || null,
                        image_url: item.image_url || null,
                        tagline: item.tagline || null,
                        ...(item.id ? { id: parseInt(item.id) } : {})
                    }))

                    const { error } = await supabase
                        .from('categories')
                        .upsert(data, { onConflict: 'slug' })

                    if (error) throw error

                    messageApi.success('Categories imported successfully')
                    router.refresh()
                } catch (error) {
                    console.error(error)
                    messageApi.error('Failed to import categories')
                } finally {
                    setLoading(false)
                    // Reset file input
                    e.target.value = null
                }
            }
        })
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
                <Space>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleImportCSV}
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                    />
                    <Button
                        icon={<ImportOutlined />}
                        loading={loading}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        Import
                    </Button>
                    <Button icon={<ExportOutlined />} onClick={handleExportCSV}>Export</Button>
                    <Link href="/admin/categories/create">
                        <Button type="primary" icon={<PlusOutlined />}>Create Category</Button>
                    </Link>
                </Space>
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
