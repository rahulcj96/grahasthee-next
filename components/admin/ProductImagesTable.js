'use client'

import React, { useState } from 'react'
import { Table, Button, Input, Space, Image, Tooltip, Popconfirm, message } from 'antd'
import { SearchOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { resolveImageUrl } from '@/utils/imageUtils'
import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProductImagesTable({ initialData }) {
    const [ searchText, setSearchText ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const [ loadingId, setLoadingId ] = useState(null)
    const [ messageApi, contextHolder ] = message.useMessage()
    const router = useRouter()

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
            render: (date) => new Date(date).toLocaleDateString('en-IN'),
            sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
        },
        {
            title: 'Actions',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Popconfirm
                        title="Delete this image?"
                        description="Are you sure to delete this image?"
                        onConfirm={() => handleDelete(record.id, record.image_url, record.product_title, record)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} loading={loading && loadingId === record.id}>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ]

    const handleDelete = async (id, imageUrl, productTitle, record) => {
        try {
            setLoading(true)
            setLoadingId(id)

            // 1. Check if this is the primary image
            // We need to query this specific record to be sure, or trust the passed record if we included it in fetch. 
            // The table fetch likely didn't join everything. But let's assume we can query it now.

            const { data: imageRecord, error: fetchError } = await supabase
                .from('product_images')
                .select('*')
                .eq('id', id)
                .single()

            if (fetchError) throw fetchError

            // 2. Delete the record
            const { error: deleteError } = await supabase
                .from('product_images')
                .delete()
                .eq('id', id)

            if (deleteError) throw deleteError

            // 3. Reassign primary if needed
            if (imageRecord.is_primary) {
                // Find another image for this product
                const { data: remainingImages, error: searchError } = await supabase
                    .from('product_images')
                    .select('*')
                    .eq('product_id', imageRecord.product_id)
                    .order('created_at', { ascending: true })
                    .limit(1)

                if (searchError) console.error('Error finding replacement primary:', searchError)

                if (remainingImages && remainingImages.length > 0) {
                    const newPrimary = remainingImages[ 0 ]
                    const { error: updateError } = await supabase
                        .from('product_images')
                        .update({ is_primary: true })
                        .eq('id', newPrimary.id)

                    if (updateError) {
                        console.error('Error setting new primary:', updateError)
                        messageApi.warning('Image deleted, but failed to set new primary.')
                    } else {
                        messageApi.success('Image deleted. New primary image assigned.')
                    }
                } else {
                    messageApi.success('Image deleted. No images remaining for product.')
                }
            } else {
                messageApi.success('Image deleted successfully')
            }

            // 4. (Optional) Delete from storage - Keeping it simple, maybe just keep files for now as per plan implicitly (only DB focused).
            // But if we have the URL, we could. Let's stick to DB logic first as requested.

            // Refresh logic
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
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
                <Input
                    placeholder="Search images..."
                    prefix={<SearchOutlined />}
                    onChange={e => setSearchText(e.target.value)}
                    style={{ width: 300 }}
                />
                <Link href="/admin/product-images/create">
                    <Button type="primary" icon={<PlusOutlined />}>Add Image</Button>
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
