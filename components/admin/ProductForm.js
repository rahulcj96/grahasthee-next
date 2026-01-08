'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Upload, Card, message, Space, Image as AntImage, InputNumber, Select, Row, Col } from 'antd';
import { UploadOutlined, SaveOutlined, ArrowLeftOutlined, DeleteOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import PageTitle from '@/components/admin/PageTitle';
import { resolveImageUrl } from '@/utils/imageUtils';

const { TextArea } = Input;
const { Option } = Select;

export default function ProductForm({ initialValues, title = 'Create Product', categories = [] }) {
    const [ form ] = Form.useForm();
    const router = useRouter();
    const [ uploading, setUploading ] = useState(false);
    const [ fileList, setFileList ] = useState([]);
    const [ loading, setLoading ] = useState(false);

    // Initialize fileList from initialValues if images exist
    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue({
                ...initialValues,
                category_id: initialValues.category_id,
                // Ensure numeric values are numbers
                price: Number(initialValues.price),
                compare_at_price: initialValues.compare_at_price ? Number(initialValues.compare_at_price) : null,
                stock_quantity: Number(initialValues.stock_quantity),
            });

            if (initialValues.images && initialValues.images.length > 0) {
                const initialFiles = initialValues.images.map((url, index) => ({
                    uid: `-${index}`,
                    name: `image-${index}`,
                    status: 'done',
                    url: resolveImageUrl(url),
                }));
                setFileList(initialFiles);
            }
        }
    }, [ initialValues, form ]);

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
            const fileExt = file.name.split('.').pop();
            const fileName = `product-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            const newFile = {
                uid: file.uid,
                name: fileName,
                status: 'done',
                url: data.publicUrl
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
            // 1. Upsert Product
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

            let productId = initialValues?.id;

            if (productId) {
                const { error } = await supabase
                    .from('products')
                    .update(productData)
                    .eq('id', productId);
                if (error) throw error;
            } else {
                const { data, error } = await supabase
                    .from('products')
                    .insert([ productData ])
                    .select()
                    .single();
                if (error) throw error;
                productId = data.id;
            }

            // 2. Handle Images
            // Strategy: Delete existing for this product and re-insert all current ones 
            // OR logic to diff. Deleting and re-inserting is simpler for now but loses metadata like 'is_primary' if we don't track it.
            // Given the table schema has `is_primary`, `display_order`, `alt_text`.
            // For MVP, we will treat the first image as primary (if logic needed) and just re-insert. 
            // Better: only if fileList changed?

            // To effectively manage images, let's wipe and rewrite for this MVP to ensure order is kept and orphans removed.
            // Note: This doesn't delete from Storage, only DB. 

            if (productId) {
                const { error: deleteError } = await supabase
                    .from('product_images')
                    .delete()
                    .eq('product_id', productId);
                if (deleteError) throw deleteError;

                if (fileList.length > 0) {
                    const imageInserts = fileList.map((file, index) => ({
                        product_id: productId,
                        image_url: file.url,
                        is_primary: index === 0,
                        display_order: index,
                        alt_text: values.title // Default alt text
                    }));

                    const { error: insertError } = await supabase
                        .from('product_images')
                        .insert(imageInserts);
                    if (insertError) throw insertError;
                }
            }

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
                        <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} size="large" block>
                            {initialValues ? 'Update Product' : 'Create Product'}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
