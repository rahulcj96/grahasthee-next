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
    Input,
    Space,
    Image
} from 'antd';
import { UploadOutlined, CopyOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ImageUploadPage() {
    const [ uploading, setUploading ] = useState(false);
    const [ imageUrl, setImageUrl ] = useState('');

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

            setImageUrl(data.publicUrl);
            message.success('Image uploaded successfully!');
        } catch (err) {
            message.error(err.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
        return false; // Prevent auto upload by Ant Design
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(imageUrl);
        message.success('URL copied to clipboard!');
    };

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Title level={2}>Image Upload Tool</Title>

            <Alert
                message="Recommended Guidelines"
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
                    multiple={false}
                    showUploadList={false}
                    beforeUpload={handleUpload}
                    disabled={uploading}
                    accept="image/*"
                    style={{ padding: 20 }}
                >
                    <p className="ant-upload-drag-icon">
                        <UploadOutlined style={{ fontSize: 48, color: '#1677ff' }} />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                </Upload.Dragger>

                {uploading && <div style={{ marginTop: 16, textAlign: 'center' }}>Uploading...</div>}

                {imageUrl && (
                    <div style={{ marginTop: 24, textAlign: 'center' }}>
                        <div style={{ marginBottom: 16 }}>
                            <Image
                                src={imageUrl}
                                alt="Preview"
                                style={{ maxHeight: 300, objectFit: 'contain' }}
                            />
                        </div>
                        <Space.Compact style={{ width: '100%' }}>
                            <Input value={imageUrl} readOnly />
                            <Button type="primary" icon={<CopyOutlined />} onClick={copyToClipboard}>
                                Copy URL
                            </Button>
                        </Space.Compact>
                    </div>
                )}
            </Card>
        </div>
    );
}
