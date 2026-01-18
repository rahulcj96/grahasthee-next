'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Card, message, Space, Image as AntImage } from 'antd';
import { UploadOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { categoryService } from '@/services/admin/categoryService'
import { storageService } from '@/services/admin/storageService'
import Link from 'next/link';
import PageTitle from '@/components/admin/PageTitle';

const { TextArea } = Input;

export default function CategoryForm({ initialValues, title = 'Create Category' }) {
    const [ form ] = Form.useForm();
    const router = useRouter();
    const [ messageApi, contextHolder ] = message.useMessage();
    const [ uploading, setUploading ] = useState(false);
    const [ imageUrl, setImageUrl ] = useState(initialValues?.image_url || '');
    const [ loading, setLoading ] = useState(false);

    // ... useEffect ...

    const handleTitleChange = (e) => {
        const titleVal = e.target.value;
        const slugVal = titleVal
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');

        // Only auto-update slug if we are creating new or if user hasn't manually edited slug (simplification: just always auto-update if not editing existing record potentially)
        if (!initialValues) {
            form.setFieldsValue({ slug: slugVal });
        }
    };

    const handleUpload = async (file) => {
        try {
            setUploading(true);
            const url = await storageService.uploadImage('product-images', file)

            setImageUrl(url);
            messageApi.success('Image uploaded successfully!');
        } catch (err) {
            messageApi.error(err.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
        return false;
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const formData = {
                ...values,
                image_url: imageUrl,
            };

            await categoryService.upsertCategory(formData, initialValues?.id)

            messageApi.success(`Category ${initialValues ? 'updated' : 'created'} successfully`);

            router.push('/admin/categories');
            router.refresh();
        } catch (error) {
            console.error('Error saving category:', error);
            messageApi.error(error.message || 'Failed to save category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            {contextHolder}
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Space>
                    <Link href="/admin/categories">
                        <Button icon={<ArrowLeftOutlined />}>Back</Button>
                    </Link>
                    <PageTitle level={2} style={{ margin: 0, fontSize: 24 }}>{title}</PageTitle>
                </Space>
            </div>

            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={initialValues}
                >
                    <Form.Item
                        name="title"
                        label="Title"
                        rules={[ { required: true, message: 'Please enter category title' } ]}
                    >
                        <Input onChange={handleTitleChange} placeholder="e.g. Living Room" />
                    </Form.Item>

                    <Form.Item
                        name="slug"
                        label="Slug"
                        rules={[ { required: true, message: 'Please enter slug' } ]}
                        tooltip="Unique URL identifier for this category"
                    >
                        <Input placeholder="e.g. living-room" />
                    </Form.Item>

                    <Form.Item
                        name="tagline"
                        label="Tagline"
                        rules={[ { max: 100, message: 'Tagline too long' } ]}
                    >
                        <Input placeholder="Short catchphrase" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                    >
                        <TextArea rows={4} placeholder="Full category description" />
                    </Form.Item>

                    <Form.Item label="Category Image">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            {imageUrl && (
                                <div style={{ position: 'relative', width: 200 }}>
                                    <AntImage
                                        src={imageUrl}
                                        alt="Category Image"
                                        style={{ maxWidth: '100%', borderRadius: 8 }}
                                    />
                                    <Button
                                        type="text"
                                        danger
                                        onClick={() => setImageUrl('')}
                                        style={{ position: 'absolute', top: 0, right: 0, background: 'rgba(255,255,255,0.8)' }}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            )}

                            <Upload
                                beforeUpload={handleUpload}
                                showUploadList={false}
                                disabled={uploading}
                                accept="image/*"
                            >
                                <Button icon={<UploadOutlined />} loading={uploading}>
                                    {uploading ? 'Uploading...' : (imageUrl ? 'Change Image' : 'Upload Image')}
                                </Button>
                            </Upload>
                            <div style={{ color: '#888', fontSize: 12 }}>
                                Recommended size: 1000 x 1500 px (2:3 ratio)
                            </div>
                        </div>
                    </Form.Item>

                    <Form.Item style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} disabled={uploading} size="large" block>
                            {initialValues ? 'Update Category' : 'Create Category'}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
