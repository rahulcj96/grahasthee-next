'use client'

import React, { useState, useRef } from 'react'
import { Table, Button, Space, Tag, Image, Modal, Popconfirm, message, Tooltip } from 'antd'
import { PlusOutlined, ExportOutlined, ImportOutlined, DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons'
import { resolveImageUrl } from '@/utils/imageUtils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CSVHelper } from '@/utils/csvHelper'
import { productService } from '@/services/admin/productService'
import { useProductFilters } from '@/hooks/admin/useProductFilters'
import ProductFilterBar from './products/ProductFilterBar'

export default function ProductsTable({ initialData, categories }) {
    const router = useRouter()
    const fileInputRef = useRef(null)
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ currentImages, setCurrentImages ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ messageApi, contextHolder ] = message.useMessage()

    // Use Custom Hook for Filtering Logic
    const {
        filters,
        setFilters,
        filteredData,
        clearFilters,
        hasActiveFilters
    } = useProductFilters(initialData)

    const handleExportCSV = () => {
        // Flatten data for export
        const exportData = filteredData.map(p => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            sku: p.sku,
            price: p.price,
            compare_at_price: p.compare_at_price,
            stock_quantity: p.stock_quantity,
            category: p.category,
            category_id: p.category_id,
            description: p.description,
            is_new_arrival: p.is_new_arrival,
            is_best_seller: p.is_best_seller,
            created_at: p.created_at,
            images: p.images ? p.images.join(',') : ''
        }))

        CSVHelper.exportToCSV(exportData, 'products_export')
    }

    const handleImportCSV = (e) => {
        const file = e.target.files[ 0 ]
        CSVHelper.importFromCSV(file, async (results) => {
            try {
                setLoading(true)
                await productService.importProducts(results.data)
                messageApi.success('Products imported successfully')
                router.refresh()
            } catch (error) {
                console.error(error)
                messageApi.error('Failed to import products: ' + (error.message || 'Unknown error'))
            } finally {
                setLoading(false)
                e.target.value = null
            }
        })
    }

    const handleDelete = async (id) => {
        try {
            setLoading(true)
            await productService.deleteProduct(id)
            messageApi.success('Product deleted successfully')
            router.refresh()
        } catch (error) {
            messageApi.error('Failed to delete product')
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
            dataIndex: 'category',
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
                    <Tooltip title="Edit Product">
                        <Link href={`/admin/products/${record.id}`}>
                            <Button icon={<EditOutlined />} size="small" />
                        </Link>
                    </Tooltip>
                    <Popconfirm
                        title="Delete this product?"
                        description="Are you sure to delete this product?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Delete Product">
                            <Button icon={<DeleteOutlined />} danger size="small" type="text" />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    return (
        <div>
            {contextHolder}

            <ProductFilterBar
                categories={categories}
                filters={filters}
                setFilters={setFilters}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
            >
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
                <Link href="/admin/products/create">
                    <Button type="primary" icon={<PlusOutlined />}>Create Product</Button>
                </Link>
            </ProductFilterBar>

            <Table
                columns={columns}
                dataSource={filteredData}
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
