'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
    Upload,
    Button,
    Card,
    Typography,
    Alert,
    message,
    Space,
    Image,
    Row,
    Col,
} from 'antd';
import { UploadOutlined, CopyOutlined, InfoCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Title, Text } = Typography;

export default function ImageUploadPage() {
    const [ uploading, setUploading ] = useState(false);
    const [ uploadedImages, setUploadedImages ] = useState([]);

    const handleUpload = async (file) => {
        try {
            setUploading(true);
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            setUploadedImages(prev => [ ...prev, {
                uid: Math.random().toString(36).substring(7),
                name: file.name,
                url: data.publicUrl
            } ]);
            message.success(`${file.name} uploaded successfully!`);
        } catch (err) {
            message.error(`${file.name} upload failed: ${err.message}`);
        } finally {
            setUploading(false);
        }
        return false; // Prevent auto upload by Ant Design
    };

    const copyToClipboard = (url) => {
        navigator.clipboard.writeText(url);
        message.success('URL copied to clipboard!');
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center' }}>
                <Space size="middle">
                    <Link href="/admin/media">
                        <Button icon={<ArrowLeftOutlined />}>Back</Button>
                    </Link>
                    <Title level={2} style={{ margin: 0 }}>Image Upload Tool</Title>
                </Space>
            </div>

            <Alert
                title="Recommended Guidelines"
                description={
                    <div style={{ display: 'flex', gap: 24, marginTop: 8 }}>
                        <div>
                            <Text strong type="warning">PRODUCT IMAGES</Text>
                            <div>Ratio: 4:5</div>
                            <div>Size: 1200 x 1500 px</div>
                        </div>
                        <div>
                            <Text strong type="warning">CATEGORY BANNERS</Text>
                            <div>Ratio: 2:3</div>
                            <div>Size: 1000 x 1500 px</div>
                        </div>
                    </div>
                }
                type="warning"
                showIcon
                icon={<InfoCircleOutlined />}
                style={{ marginBottom: 24 }}
            />

            <Card>
                <Upload.Dragger
                    name="file"
                    multiple={true}
                    showUploadList={false}
                    beforeUpload={handleUpload}
                    disabled={uploading}
                    accept="image/*"
                    style={{ padding: 20 }}
                >
                    <p className="ant-upload-drag-icon">
                        <UploadOutlined style={{ fontSize: 48, color: '#1677ff' }} />
                    </p>
                    <p className="ant-upload-text">Click or drag files to this area to upload</p>
                    <p className="ant-upload-hint">Support for single or bulk upload.</p>
                </Upload.Dragger>

                {uploading && <div style={{ marginTop: 16, textAlign: 'center' }}>Uploading...</div>}

                {uploadedImages.length > 0 && (
                    <div style={{ marginTop: 32 }}>
                        <Title level={4}>Uploaded Images ({uploadedImages.length})</Title>
                        <Row gutter={[ 16, 16 ]}>
                            {uploadedImages.map((img, index) => (
                                <Col xs={24} sm={12} key={img.uid}>
                                    <Card
                                        size="small"
                                        cover={
                                            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
                                                <Image
                                                    src={img.url}
                                                    alt={img.name}
                                                    style={{ maxHeight: 200, maxWidth: '100%', objectFit: 'contain' }}
                                                />
                                            </div>
                                        }
                                        actions={[
                                            <Button type="link" icon={<CopyOutlined />} onClick={() => copyToClipboard(img.url)}>
                                                Copy URL
                                            </Button>
                                        ]}
                                    >
                                        <Card.Meta
                                            title={<Text ellipsis>{img.name}</Text>}
                                            description={<Text type="secondary" style={{ fontSize: '12px' }} copyable>{img.url}</Text>}
                                        />
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                        <div style={{ marginTop: 24, textAlign: 'center' }}>
                            <Button onClick={() => setUploadedImages([])}>Clear List</Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
