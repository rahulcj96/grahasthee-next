'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Card, message, Space, Image as AntImage, InputNumber, Select, Row, Col } from 'antd';
import { UploadOutlined, SaveOutlined, ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { productService } from '@/services/admin/productService'
import { storageService } from '@/services/admin/storageService'

import Link from 'next/link';
import PageTitle from '@/components/admin/PageTitle';

const { TextArea } = Input;
const { Option } = Select;

export default function ProductForm({ initialValues, title = 'Create Product', categories = [] }) {
    const [ form ] = Form.useForm();
    const router = useRouter();
    const [ uploading, setUploading ] = useState(false);
    const [ fileList, setFileList ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    // ... useEffect remains the same ...

    const handleTitleChange = (e) => {
        if (!initialValues) {
            const titleVal = e.target.value;
            const slugVal = titleVal
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '');
            form.setFieldsValue({ slug: slugVal });
        }
    };

    const handleUpload = async ({ file, onSuccess, onError }) => {
        try {
            setUploading(true);
            const url = await storageService.uploadImage('product-images', file)

            const newFile = {
                uid: file.uid,
                name: file.name,
                status: 'done',
                url: url
            };

            setFileList((prev) => [ ...prev, newFile ]);
            onSuccess(null, newFile);
            message.success(`${file.name} uploaded successfully`);
        } catch (err) {
            console.error(err);
            message.error(err.message || 'Upload failed');
            onError(err);
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = (file) => {
        const newFileList = fileList.filter(item => item.uid !== file.uid);
        setFileList(newFileList);
    };

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const productData = {
                title: values.title,
                slug: values.slug,
                description: values.description,
                price: values.price,
                compare_at_price: values.compare_at_price,
                stock_quantity: values.stock_quantity,
                sku: values.sku,
                category_id: values.category_id,
            };

            await productService.upsertProduct(productData, fileList, initialValues?.id)

            message.success(`Product ${initialValues ? 'updated' : 'created'} successfully`);
            router.push('/admin/products');
            router.refresh();

        } catch (error) {
            console.error('Error saving product:', error);
            message.error(error.message || 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Space>
                    <Link href="/admin/products">
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
                    <Row gutter={24}>
                        <Col span={16}>
                            <Form.Item
                                name="title"
                                label="Title"
                                rules={[ { required: true, message: 'Please enter product title' } ]}
                            >
                                <Input onChange={handleTitleChange} placeholder="e.g. Cotton Bath Towel" />
                            </Form.Item>

                            <Form.Item
                                name="slug"
                                label="Slug"
                                rules={[ { required: true, message: 'Please enter slug' } ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label="Description"
                            >
                                <TextArea rows={6} />
                            </Form.Item>

                            <Form.Item
                                label="Product Images"
                            >
                                <Upload
                                    customRequest={handleUpload}
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={(file) => window.open(file.url, '_blank')}
                                    onRemove={handleRemove}
                                    multiple={true}
                                    accept="image/*"
                                >
                                    <div>
                                        <UploadOutlined />
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>

                        <Col span={8}>
                            <Card title="Organization" size="small" style={{ marginBottom: 24 }}>
                                <Form.Item
                                    name="category_id"
                                    label="Category"
                                    rules={[ { required: true, message: 'Select a category' } ]}
                                >
                                    <Select placeholder="Select Category">
                                        {categories.map(cat => (
                                            <Option key={cat.id} value={cat.id}>{cat.title}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="sku"
                                    label="SKU"
                                    rules={[ { required: true, message: 'Enter SKU' } ]}
                                >
                                    <Input placeholder="E.g. ACC-001" />
                                </Form.Item>
                            </Card>

                            <Card title="Pricing & Inventory" size="small">
                                <Form.Item
                                    name="price"
                                    label="Price (₹)"
                                    rules={[ { required: true, message: 'Enter price' } ]}
                                >
                                    <InputNumber style={{ width: '100%' }} min={0} />
                                </Form.Item>

                                <Form.Item
                                    name="compare_at_price"
                                    label="Compare At Price (₹)"
                                >
                                    <InputNumber style={{ width: '100%' }} min={0} />
                                </Form.Item>

                                <Form.Item
                                    name="stock_quantity"
                                    label="Stock Quantity"
                                    rules={[ { required: true, message: 'Enter stock' } ]}
                                >
                                    <InputNumber style={{ width: '100%' }} min={0} precision={0} />
                                </Form.Item>
                            </Card>
                        </Col>
                    </Row>

                    <Form.Item style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} disabled={uploading} size="large" block>
                            {initialValues ? 'Update Product' : 'Create Product'}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
