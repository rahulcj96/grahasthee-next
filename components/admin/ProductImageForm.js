'use client';

import React, { useState, useEffect } from 'react';
import { Form, Button, Upload, Card, message, Select, Space, Row, Col } from 'antd';
import { UploadOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { storageService } from '@/services/admin/storageService'
import { productImageService } from '@/services/admin/productImageService'
import Link from 'next/link';
import PageTitle from '@/components/admin/PageTitle';

const { Option } = Select;

export default function ProductImageForm({ categories = [], products = [] }) {
    const [ form ] = Form.useForm();
    const router = useRouter();
    const [ uploading, setUploading ] = useState(false);
    const [ fileList, setFileList ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const [ selectedCategory, setSelectedCategory ] = useState(null);
    const [ filteredProducts, setFilteredProducts ] = useState(products);

    // Filter products when category changes
    useEffect(() => {
        if (selectedCategory) {
            setFilteredProducts(products.filter(p => p.category_id === selectedCategory));
        } else {
            setFilteredProducts(products);
        }
    }, [ selectedCategory, products ]);

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
        if (fileList.length === 0) {
            message.error('Please upload at least one image');
            return;
        }

        setLoading(true);
        try {
            const productId = values.product_id;
            await productImageService.addProductImages(productId, fileList, products)

            message.success(`${fileList.length} image(s) added successfully`);
            router.push('/admin/product-images');
            router.refresh();

        } catch (error) {
            console.error('Error saving images:', error);
            message.error(error.message || 'Failed to save images');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Space>
                    <Link href="/admin/product-images">
                        <Button icon={<ArrowLeftOutlined />}>Back</Button>
                    </Link>
                    <PageTitle level={2} style={{ margin: 0, fontSize: 24 }}>Add Product Images</PageTitle>
                </Space>
            </div>

            <Card>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                >
                    <Row gutter={24}>
                        <Col span={24}>
                            <Form.Item
                                label="Filter by Category (Optional)"
                            >
                                <Select
                                    placeholder="Select a category to filter products"
                                    allowClear
                                    onChange={setSelectedCategory}
                                >
                                    {categories.map(cat => (
                                        <Option key={cat.id} value={cat.id}>{cat.title}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="product_id"
                                label="Product"
                                rules={[ { required: true, message: 'Please select a product' } ]}
                            >
                                <Select
                                    placeholder="Select a product"
                                    showSearch
                                    optionFilterProp="children"
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {filteredProducts.map(product => (
                                        <Option key={product.id} value={product.id}>
                                            {product.title}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Product Images"
                                extra="Upload multiple images at once. The first image will be set as primary if the product doesn't have one."
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
                    </Row>

                    <Form.Item style={{ marginTop: 24 }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SaveOutlined />}
                            loading={loading}
                            size="large"
                            block
                            disabled={fileList.length === 0 || uploading}
                        >
                            Add {fileList.length > 0 ? `${fileList.length} ` : ''}Image{fileList.length !== 1 ? 's' : ''}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
