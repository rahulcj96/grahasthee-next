'use client'

import React, { useState } from 'react'
import { Table, Button, Input, Space, Tag, Image } from 'antd'
import { SearchOutlined, PlusOutlined, ExportOutlined, ImportOutlined } from '@ant-design/icons'

export default function ProductsTable({ initialData }) {
    const [ searchText, setSearchText ] = useState('')

    const columns = [
        {
            title: 'Image',
            dataIndex: 'images',
            key: 'image',
            render: (images) => (
                images && images[ 0 ] ?
                    <Image src={images[ 0 ]} width={50} height={50} style={{ objectFit: 'cover' }} /> :
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
                    <a>Edit</a>
                    <a style={{ color: 'red' }}>Delete</a>
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
                    <Button type="primary" icon={<PlusOutlined />}>Create Product</Button>
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
