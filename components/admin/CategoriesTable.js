'use client'

import React, { useState } from 'react'
import { Table, Button, Input, Space, Image } from 'antd'
import { SearchOutlined, PlusOutlined } from '@ant-design/icons'

export default function CategoriesTable({ initialData }) {
    const [ searchText, setSearchText ] = useState('')

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image_url',
            key: 'image',
            render: (url) => (
                url ?
                    <Image src={url} width={50} height={50} style={{ objectFit: 'cover' }} /> :
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
                    placeholder="Search categories..."
                    prefix={<SearchOutlined />}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                />
                <Button type="primary" icon={<PlusOutlined />}>Create Category</Button>
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
