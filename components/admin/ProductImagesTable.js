'use client'

import React, { useState, useMemo } from 'react'
import { Table, Button, Input, Space, Image, Tooltip, Popconfirm, message, Select, Radio, Row, Col } from 'antd'
import { SearchOutlined, PlusOutlined, DeleteOutlined, FilterOutlined, ClearOutlined, StarOutlined, StarFilled } from '@ant-design/icons'
import { resolveImageUrl } from '@/utils/imageUtils'
import { productImageService } from '@/services/admin/productImageService'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ExportOutlined } from '@ant-design/icons'
import Papa from 'papaparse'

export default function ProductImagesTable({ initialData, products }) {
    const [ searchText, setSearchText ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const [ loadingId, setLoadingId ] = useState(null)
    const [ messageApi, contextHolder ] = message.useMessage()
    const router = useRouter()

    // Filter states
    const [ selectedProduct, setSelectedProduct ] = useState(null)
    const [ primaryStatus, setPrimaryStatus ] = useState('all')
    const [ showFilters, setShowFilters ] = useState(false)

    // Filter data based on all active filters
    const filteredData = useMemo(() => {
        let filtered = initialData

        // Search filter
        if (searchText) {
            filtered = filtered.filter(record =>
                String(record.product_title).toLowerCase().includes(searchText.toLowerCase()) ||
                String(record.image_url).toLowerCase().includes(searchText.toLowerCase())
            )
        }

        // Product filter
        if (selectedProduct) {
            filtered = filtered.filter(record => record.product_id === selectedProduct)
        }

        // Primary status filter
        if (primaryStatus === 'primary') {
            filtered = filtered.filter(record => record.is_primary === true)
        } else if (primaryStatus === 'non_primary') {
            filtered = filtered.filter(record => record.is_primary === false)
        }

        return filtered
    }, [ initialData, searchText, selectedProduct, primaryStatus ])

    const clearFilters = () => {
        setSearchText('')
        setSelectedProduct(null)
        setPrimaryStatus('all')
    }

    const hasActiveFilters = searchText || selectedProduct || primaryStatus !== 'all'

    const handleExportCSV = () => {
        const exportData = filteredData.map(img => ({
            id: img.id,
            product_id: img.product_id,
            product_title: img.product_title,
            image_url: img.image_url,
            is_primary: img.is_primary,
            created_at: img.created_at
        }))

        const csv = Papa.unparse(exportData)
        const blob = new Blob([ csv ], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `product_images_export_${new Date().toISOString().split('T')[ 0 ]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image_url',
            key: 'image',
            render: (url) => (
                <Image
                    src={resolveImageUrl(url)}
                    width={80}
                    height={80}
                    style={{ objectFit: 'contain', background: '#f5f5f5' }}
                    fallback="/images/placeholder.webp"
                />
            ),
        },
        {
            title: 'Product',
            dataIndex: 'product_title',
            key: 'product',
            sorter: (a, b) => (a.product_title || '').localeCompare(b.product_title || ''),
        },
        {
            title: 'URL',
            dataIndex: 'image_url',
            key: 'url',
            ellipsis: {
                showTitle: false,
            },
            render: (url) => (
                <Tooltip placement="topLeft" title={url}>
                    {url}
                </Tooltip>
            ),
        },
        {
            title: 'Date Added',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (date) => new Date(date).toLocaleDateString('en-IN'),
            sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {!record.is_primary && (
                        <Tooltip title="Make Primary">
                            <Button
                                type="text"
                                icon={<StarOutlined />}
                                onClick={() => handleMakePrimary(record.id, record.product_id)}
                                loading={loading && loadingId === record.id}
                            />
                        </Tooltip>
                    )}
                    {record.is_primary && (
                        <Tooltip title="Primary Image">
                            <Button
                                type="text"
                                icon={<StarFilled />}
                                disabled
                                style={{ color: '#faad14' }}
                            />
                        </Tooltip>
                    )}
                    <Popconfirm
                        title="Delete this image?"
                        description="Are you sure to delete this image?"
                        onConfirm={() => handleDelete(record.id, record.image_url, record.product_title, record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Tooltip title="Delete Image">
                            <Button type="text" danger icon={<DeleteOutlined />} loading={loading && loadingId === record.id} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    const handleMakePrimary = async (imageId, productId) => {
        try {
            setLoading(true)
            setLoadingId(imageId)

            await productImageService.setPrimaryImage(imageId, productId)

            messageApi.success('Primary image updated successfully')
            router.refresh()
        } catch (error) {
            console.error(error)
            messageApi.error('Failed to update primary image')
        } finally {
            setLoading(false)
            setLoadingId(null)
        }
    }

    const handleDelete = async (id, imageUrl, productTitle, record) => {
        try {
            setLoading(true)
            setLoadingId(id)

            const result = await productImageService.deleteProductImage(id)

            if (result.success) {
                messageApi.success(result.message)
            }

            router.refresh()
        } catch (error) {
            console.error(error)
            messageApi.error('Failed to delete image')
        } finally {
            setLoading(false)
            setLoadingId(null)
        }
    }

    return (
        <div>
            {contextHolder}
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <Space>
                        <Input
                            placeholder="Search images..."
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
                        <Button icon={<ExportOutlined />} onClick={handleExportCSV}>Export</Button>
                        <Link href="/admin/product-images/create">
                            <Button type="primary" icon={<PlusOutlined />}>Add Image</Button>
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
                            <Col span={12}>
                                <div style={{ marginBottom: 8, fontWeight: 500 }}>Product</div>
                                <Select
                                    placeholder="Select product"
                                    style={{ width: '100%' }}
                                    value={selectedProduct}
                                    onChange={setSelectedProduct}
                                    allowClear
                                    showSearch
                                    filterOption={(input, option) =>
                                        (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {products.map(product => (
                                        <Select.Option key={product.id} value={product.id}>
                                            {product.title}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Col>
                            <Col span={12}>
                                <div style={{ marginBottom: 8, fontWeight: 500 }}>Primary Image Status</div>
                                <Radio.Group
                                    value={primaryStatus}
                                    onChange={e => setPrimaryStatus(e.target.value)}
                                    style={{ width: '100%' }}
                                >
                                    <Radio.Button value="all">All</Radio.Button>
                                    <Radio.Button value="primary">Primary</Radio.Button>
                                    <Radio.Button value="non_primary">Non-Primary</Radio.Button>
                                </Radio.Group>
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
        </div>
    )
}
