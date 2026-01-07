'use client'

import React, { useState } from 'react'
import { Table, Button, Input, Space, Tag, Image, Modal, Popconfirm, message } from 'antd'
import { SearchOutlined, PlusOutlined, ExportOutlined, ImportOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { resolveImageUrl } from '@/utils/imageUtils'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function ProductsTable({ initialData }) {
    const [ searchText, setSearchText ] = useState('')
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ currentImages, setCurrentImages ] = useState([])
    const router = useRouter()
    const [ loading, setLoading ] = useState(false)

    const handleDelete = async (id) => {
        try {
            setLoading(true)
            // Note: If you have foreign key constraints with cascade delete on product_images, this will work automatically.
            // If not, you might need to delete images first. Assuming cascade or simple delete for now.
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id)

            if (error) throw error

            message.success('Product deleted successfully')
            router.refresh()
        } catch (error) {
            message.error('Failed to delete product')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const showImages = (images) => {
        setCurrentImages(images || [])
        setIsModalOpen(true)
    }

    const columns = [
        {
            title: 'Image',
            dataIndex: 'images',
            key: 'image',
            render: (images) => (
                images && images[ 0 ] ?
                    <Image
                        src={resolveImageUrl(images[ 0 ])}
                        width={50}
                        height={50}
                        style={{ objectFit: 'cover' }}
                        fallback="/images/placeholder.webp"
                    /> :
                    <div style={{ width: 50, height: 50, background: '#f0f0f0' }} />
            ),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
            filteredValue: [ searchText ],
            onFilter: (value, record) => {
                return String(record.title).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.sku).toLowerCase().includes(value.toLowerCase())
            },
        },
        {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (text) => `₹${text}`,
            sorter: (a, b) => a.price - b.price,
        },
        {
            title: 'Stock',
            dataIndex: 'stock_quantity',
            key: 'stock',
            sorter: (a, b) => a.stock_quantity - b.stock_quantity,
            render: (stock) => (
                <Tag color={stock > 0 ? 'green' : 'red'}>
                    {stock > 0 ? 'In Stock' : 'Out of Stock'} ({stock})
                </Tag>
            ),
        },
        {
            title: 'Category',
            dataIndex: 'category', // Needs join in fetch or map
            key: 'category',
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => showImages(record.images)}
                        title="View Images"
                    />
                    <Link href={`/admin/products/${record.id}`}>
                        <Button icon={<EditOutlined />} size="small">Edit</Button>
                    </Link>
                    <Popconfirm
                        title="Delete this product?"
                        description="Are you sure to delete this product?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger size="small" type="text">Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Input
                    placeholder="Search products..."
                    prefix={<SearchOutlined />}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                />
                <Space>
                    <Button icon={<ImportOutlined />}>Import</Button>
                    <Button icon={<ExportOutlined />}>Export</Button>
                    <Link href="/admin/products/create">
                        <Button type="primary" icon={<PlusOutlined />}>Create Product</Button>
                    </Link>
                </Space>
            </div>
            <Table
                columns={columns}
                dataSource={initialData}
                rowKey="id"
                pagination={{ pageSize: 10 }}
            />

            <Modal
                title="Product Images"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={800}
            >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                    {currentImages.length > 0 ? (
                        currentImages.map((url, index) => (
                            <Image
                                key={index}
                                src={resolveImageUrl(url)}
                                width={150}
                                height={150}
                                style={{ objectFit: 'cover' }}
                                fallback="/images/placeholder.webp"
                            />
                        ))
                    ) : (
                        <p>No images available for this product.</p>
                    )}
                </div>
            </Modal>
        </div>
    )
}
