'use client'

import React, { useState, useRef } from 'react'
import { Table, Button, Input, Space, Image, Popconfirm, message, Tooltip } from 'antd'
import { SearchOutlined, PlusOutlined, DeleteOutlined, EditOutlined, ExportOutlined, ImportOutlined } from '@ant-design/icons'
import { CSVHelper } from '@/utils/csvHelper'
import { categoryService } from '@/services/admin/categoryService'
import Link from 'next/link'
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

            const result = await categoryService.deleteCategory(id)

            if (!result.success) {
                messageApi.warning(result.error)
                return
            }

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
        CSVHelper.exportToCSV(initialData, 'categories_export')
    }

    const handleImportCSV = (e) => {
        const file = e.target.files[ 0 ]
        CSVHelper.importFromCSV(file, async (results) => {
            try {
                setLoading(true)
                await categoryService.importCategories(results.data)

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
                    <Tooltip title="Edit">
                        <Link href={`/admin/categories/${record.id}`}>
                            <Button icon={<EditOutlined />} size="small" />
                        </Link>
                    </Tooltip>
                    <Popconfirm
                        title="Delete this category?"
                        description="Are you sure to delete this category?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Delete">
                            <Button icon={<DeleteOutlined />} danger size="small" loading={loading} />
                        </Tooltip>
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
