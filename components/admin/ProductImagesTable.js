'use client'

import React, { useState } from 'react'
import { Table, Button, Input, Space, Image, Tooltip } from 'antd'
import { SearchOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'

export default function ProductImagesTable({ initialData }) {
    const [ searchText, setSearchText ] = useState('')

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image_url',
            key: 'image',
            render: (url) => (
                <Image src={url} width={80} height={80} style={{ objectFit: 'contain', background: '#f5f5f5' }} />
            ),
        },
        {
            title: 'Product',
            dataIndex: 'product_title',
            key: 'product',
            sorter: (a, b) => (a.product_title || '').localeCompare(b.product_title || ''),
            filteredValue: [ searchText ],
            onFilter: (value, record) => {
                return String(record.product_title).toLowerCase().includes(value.toLowerCase()) ||
                    String(record.image_url).toLowerCase().includes(value.toLowerCase())
            },
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
            render: (date) => new Date(date).toLocaleDateString(),
            sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="text" danger icon={<DeleteOutlined />}>Delete</Button>
                </Space>
            ),
        },
    ]

    return (
        <div>
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Input
                    placeholder="Search images..."
                    prefix={<SearchOutlined />}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                />
                <Button type="primary" icon={<PlusOutlined />}>Add Image</Button>
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
