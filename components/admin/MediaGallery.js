'use client'

import React, { useState, useEffect } from 'react'
import { Card, Button, Typography, Space, Image, Badge, Popconfirm, message, Row, Col, Empty, Spin, Tooltip } from 'antd'
import {
    CloudUploadOutlined,
    DeleteOutlined,
    CopyOutlined,
    InfoCircleOutlined,
    SyncOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'
import PageTitle from '@/components/admin/PageTitle'

const { Text, Title } = Typography

export default function MediaGallery() {
    const [ loading, setLoading ] = useState(true)
    const [ mediaItems, setMediaItems ] = useState([])
    const [ deleting, setDeleting ] = useState(false)

    const fetchMedia = async () => {
        try {
            setLoading(true)

            // 1. Fetch all storage objects
            const { data: objects, error: storageError } = await supabase.rpc('get_storage_objects_sql', {
                bucket_name: 'product-images'
            })

            // Note: Since we might not have the RPC, let's use a simpler approach for now 
            // if the above fails or fallback to a manual list
            const { data: storageList, error: listError } = await supabase.storage
                .from('product-images')
                .list()

            if (listError) throw listError

            // 2. Fetch all referenced URLs from DB
            const [ { data: productImages }, { data: categoryImages } ] = await Promise.all([
                supabase.from('product_images').select('image_url'),
                supabase.from('categories').select('image_url')
            ])

            const referencedUrls = new Set([
                ...(productImages || []).map(img => img.image_url),
                ...(categoryImages || []).map(cat => cat.image_url)
            ])

            // 3. Map storage items to gallery items
            const items = storageList.map(obj => {
                const { data } = supabase.storage
                    .from('product-images')
                    .getPublicUrl(obj.name)

                return {
                    name: obj.name,
                    url: data.publicUrl,
                    size: obj.metadata?.size,
                    created_at: obj.created_at,
                    isUsed: referencedUrls.has(data.publicUrl)
                }
            })

            setMediaItems(items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))
        } catch (error) {
            console.error('Error fetching media:', error)
            message.error('Failed to load media gallery')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMedia()
    }, [])

    const handleDelete = async (fileName) => {
        try {
            setDeleting(true)
            const { data, error } = await supabase.storage
                .from('product-images')
                .remove([ fileName ])

            if (error) throw error

            if (!data || data.length === 0) {
                throw new Error('File not found or deletion blocked by policy')
            }

            message.success('Image deleted from storage')
            setMediaItems(prev => prev.filter(item => item.name !== fileName))
        } catch (error) {
            console.error('Error deleting image:', error)
            message.error('Failed to delete image')
        } finally {
            setDeleting(false)
        }
    }

    const handleDeleteUnused = async () => {
        const unusedItems = mediaItems.filter(item => !item.isUsed)
        if (unusedItems.length === 0) {
            message.info('No unused images found')
            return
        }

        try {
            setDeleting(true)
            const pathsToBatchRemove = unusedItems.map(item => item.name)
            const { data, error } = await supabase.storage
                .from('product-images')
                .remove(pathsToBatchRemove)

            if (error) throw error

            if (!data || data.length === 0) {
                throw new Error('No files were deleted. Possible policy restriction.')
            }

            message.success(`Deleted ${data.length} unused images`)
            const deletedNames = new Set(data.map(item => item.name))
            setMediaItems(prev => prev.filter(item => !deletedNames.has(item.name)))
        } catch (error) {
            console.error('Error during bulk deletion:', error)
            message.error('Bulk deletion failed')
        } finally {
            setDeleting(false)
        }
    }

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url)
        message.success('URL copied to clipboard')
    }

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>Loading Media Gallery...</div>
            </div>
        )
    }

    const unusedCount = mediaItems.filter(item => !item.isUsed).length

    return (
        <div style={{ padding: '0 0 40px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
                <div>
                    <PageTitle level={2} style={{ margin: 0 }}>Media Gallery</PageTitle>
                    <Text type="secondary">Manage your store's uploaded assets ({mediaItems.length} items)</Text>
                </div>
                <Space>
                    {unusedCount > 0 && (
                        <Popconfirm
                            title="Delete all unused images?"
                            description={`This will permanently remove ${unusedCount} files that are not linked to any product or category.`}
                            onConfirm={handleDeleteUnused}
                            okText="Yes, Delete All"
                            cancelText="No"
                            okButtonProps={{ danger: true, loading: deleting }}
                        >
                            <Button danger icon={<DeleteOutlined />}>
                                Delete All Unused ({unusedCount})
                            </Button>
                        </Popconfirm>
                    )}
                    <Button icon={<SyncOutlined />} onClick={fetchMedia}>Refresh</Button>
                    <Link href="/admin/media/upload">
                        <Button type="primary" icon={<CloudUploadOutlined />}>Upload New</Button>
                    </Link>
                </Space>
            </div>

            {mediaItems.length === 0 ? (
                <Card>
                    <Empty description="No images found in storage" />
                </Card>
            ) : (
                <Row gutter={[ 16, 16 ]}>
                    {mediaItems.map((item) => (
                        <Col xs={24} sm={12} md={8} lg={6} xl={4} key={item.name}>
                            <Card
                                hoverable
                                cover={
                                    <div style={{
                                        height: 180,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: '#f9f9f9',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}>
                                        <Image
                                            alt={item.name}
                                            src={item.url}
                                            style={{ maxHeight: 180, maxWidth: '100%', objectFit: 'contain' }}
                                        />
                                        <div style={{ position: 'absolute', top: 8, right: 8 }}>
                                            {item.isUsed ? (
                                                <Tooltip title="In Use">
                                                    <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18, background: 'white', borderRadius: '50%' }} />
                                                </Tooltip>
                                            ) : (
                                                <Tooltip title="Unused">
                                                    <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: 18, background: 'white', borderRadius: '50%' }} />
                                                </Tooltip>
                                            )}
                                        </div>
                                    </div>
                                }
                                actions={[
                                    <Tooltip title="Copy URL">
                                        <Button type="text" icon={<CopyOutlined />} onClick={() => copyToClipboard(item.url)} />
                                    </Tooltip>,
                                    <Popconfirm
                                        title="Delete image?"
                                        description="This will permanently remove the file from storage."
                                        onConfirm={() => handleDelete(item.name)}
                                        disabled={item.isUsed}
                                    >
                                        <Tooltip title={item.isUsed ? "Cannot delete image in use" : "Delete"}>
                                            <Button
                                                type="text"
                                                danger
                                                icon={<DeleteOutlined />}
                                                disabled={item.isUsed}
                                            />
                                        </Tooltip>
                                    </Popconfirm>
                                ]}
                            >
                                <Card.Meta
                                    title={<Text ellipsis style={{ width: '100%' }}>{item.name}</Text>}
                                    description={
                                        <div style={{ fontSize: 12 }}>
                                            <Text type="secondary">{item.size ? `${(item.size / 1024 / 1024).toFixed(2)} MB` : 'Unknown size'}</Text>
                                        </div>
                                    }
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    )
}
