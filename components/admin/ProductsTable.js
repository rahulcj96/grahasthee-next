'use client'

import React, { useState, useMemo, useRef } from 'react'
import { Table, Button, Input, Space, Tag, Image, Modal, Popconfirm, message, Select, Radio, InputNumber, Row, Col } from 'antd'
import { SearchOutlined, PlusOutlined, ExportOutlined, ImportOutlined, DeleteOutlined, EditOutlined, EyeOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons'
import { resolveImageUrl } from '@/utils/imageUtils'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Papa from 'papaparse'

export default function ProductsTable({ initialData, categories }) {
    const [ searchText, setSearchText ] = useState('')
    const [ isModalOpen, setIsModalOpen ] = useState(false)
    const [ currentImages, setCurrentImages ] = useState([])
    const router = useRouter()
    const fileInputRef = useRef(null)
    const [ loading, setLoading ] = useState(false)
    const [ messageApi, contextHolder ] = message.useMessage()

    // Filter states
    const [ selectedCategory, setSelectedCategory ] = useState(null)
    const [ stockStatus, setStockStatus ] = useState('all')
    const [ minPrice, setMinPrice ] = useState(null)
    const [ maxPrice, setMaxPrice ] = useState(null)
    const [ showFilters, setShowFilters ] = useState(false)

    // Filter data based on all active filters
    const filteredData = useMemo(() => {
        let filtered = initialData

        // Search filter
        if (searchText) {
            filtered = filtered.filter(record =>
                String(record.title).toLowerCase().includes(searchText.toLowerCase()) ||
                String(record.sku).toLowerCase().includes(searchText.toLowerCase())
            )
        }

        // Category filter
        if (selectedCategory) {
            filtered = filtered.filter(record => record.category_id === selectedCategory)
        }

        // Stock status filter
        if (stockStatus === 'in_stock') {
            filtered = filtered.filter(record => record.stock_quantity > 0)
        } else if (stockStatus === 'out_of_stock') {
            filtered = filtered.filter(record => record.stock_quantity === 0)
        }

        // Price range filter
        if (minPrice !== null) {
            filtered = filtered.filter(record => record.price >= minPrice)
        }
        if (maxPrice !== null) {
            filtered = filtered.filter(record => record.price <= maxPrice)
        }

        return filtered
    }, [ initialData, searchText, selectedCategory, stockStatus, minPrice, maxPrice ])

    const clearFilters = () => {
        setSearchText('')
        setSelectedCategory(null)
        setStockStatus('all')
        setMinPrice(null)
        setMaxPrice(null)
    }

    const hasActiveFilters = searchText || selectedCategory || stockStatus !== 'all' || minPrice !== null || maxPrice !== null

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
            created_at: p.created_at
        }))

        const csv = Papa.unparse(exportData)
        const blob = new Blob([ csv ], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[ 0 ]}.csv`)
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
                        sku: item.sku,
                        price: parseFloat(item.price) || 0,
                        compare_at_price: item.compare_at_price ? parseFloat(item.compare_at_price) : null,
                        stock_quantity: parseInt(item.stock_quantity) || 0,
                        category_id: item.category_id ? parseInt(item.category_id) : null,
                        description: item.description || null,
                        is_new_arrival: item.is_new_arrival === 'true' || item.is_new_arrival === '1',
                        is_best_seller: item.is_best_seller === 'true' || item.is_best_seller === '1',
                        ...(item.id ? { id: parseInt(item.id) } : {})
                    }))

                    const { error } = await supabase
                        .from('products')
                        .upsert(data, { onConflict: 'sku' })

                    if (error) throw error

                    messageApi.success('Products imported successfully')
                    router.refresh()
                } catch (error) {
                    console.error(error)
                    messageApi.error('Failed to import products')
                } finally {
                    setLoading(false)
                    e.target.value = null
                }
            }
        })
    }

    const handleDelete = async (id) => {
        try {
            setLoading(true)

            // Delete associated images first (Cascade delete)
            const { error: imagesError } = await supabase
                .from('product_images')
                .delete()
                .eq('product_id', id)

            if (imagesError) throw imagesError

            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id)

            if (error) throw error

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
            {contextHolder}
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <Space>
                        <Input
                            placeholder="Search products..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: 300 }}
                        />
                        <Button
                            icon={<FilterOutlined />}
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </Button>
                        {hasActiveFilters && (
                            <Button
                                icon={<ClearOutlined />}
                                onClick={clearFilters}
                            >
                                Clear Filters
                            </Button>
                        )}
                    </Space>
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
                        <Link href="/admin/products/create">
                            <Button type="primary" icon={<PlusOutlined />}>Create Product</Button>
                        </Link>
                    </Space>
                </div>

                {showFilters && (
                    <div style={{
                        padding: 16,
                        background: 'var(--ant-color-bg-container)',
                        border: '1px solid var(--ant-color-border)',
                        borderRadius: 8,
                        marginBottom: 16
                    }}>
                        <Row gutter={[ 16, 16 ]}>
                            <Col span={8}>
                                <div style={{ marginBottom: 8, fontWeight: 500 }}>Category</div>
                                <Select
                                    placeholder="Select category"
                                    style={{ width: '100%' }}
                                    value={selectedCategory}
                                    onChange={setSelectedCategory}
                                    allowClear
                                >
                                    {categories.map(cat => (
                                        <Select.Option key={cat.id} value={cat.id}>
                                            {cat.title}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col span={8}>
                                <div style={{ marginBottom: 8, fontWeight: 500 }}>Stock Status</div>
                                <Radio.Group
                                    value={stockStatus}
                                    onChange={e => setStockStatus(e.target.value)}
                                    style={{ width: '100%' }}
                                >
                                    <Radio.Button value="all">All</Radio.Button>
                                    <Radio.Button value="in_stock">In Stock</Radio.Button>
                                    <Radio.Button value="out_of_stock">Out of Stock</Radio.Button>
                                </Radio.Group>
                            </Col>
                            <Col span={8}>
                                <div style={{ marginBottom: 8, fontWeight: 500 }}>Price Range</div>
                                <Space.Compact style={{ width: '100%' }}>
                                    <InputNumber
                                        placeholder="Min"
                                        prefix="₹"
                                        value={minPrice}
                                        onChange={setMinPrice}
                                        style={{ width: '50%' }}
                                        min={0}
                                    />
                                    <InputNumber
                                        placeholder="Max"
                                        prefix="₹"
                                        value={maxPrice}
                                        onChange={setMaxPrice}
                                        style={{ width: '50%' }}
                                        min={0}
                                    />
                                </Space.Compact>
                            </Col>
                        </Row>
                    </div>
                )}
            </div>
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
