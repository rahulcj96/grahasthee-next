'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Editor from '@/components/admin/Editor';
import { Button, Input, message, Spin, Typography } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';

const { Title } = Typography;

export default function EditPolicyPage() {
    const params = useParams();
    const slug = params.slug;
    const router = useRouter();
    const [ policy, setPolicy ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ saving, setSaving ] = useState(false);
    const [ title, setTitle ] = useState('');
    const [ content, setContent ] = useState('');
    const [ messageApi, contextHolder ] = message.useMessage();

    useEffect(() => {
        if (slug) {
            fetchPolicy();
        }
    }, [ slug ]);

    const fetchPolicy = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('policies')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) throw error;
            if (data) {
                setPolicy(data);
                setTitle(data.title);
                setContent(data.content);
            }
        } catch (error) {
            console.error('Error fetching policy:', error);
            messageApi.error('Failed to fetch policy data. Ensure the policy exists in the database.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const { error } = await supabase
                .from('policies')
                .update({ title, content, updated_at: new Date() })
                .eq('id', policy.id);

            if (error) throw error;
            messageApi.success('Policy updated successfully');
        } catch (error) {
            console.error('Error updating policy:', error);
            messageApi.error('Failed to update policy');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-4 text-center">{contextHolder}<Spin size="large" /></div>;
    if (!policy) return <div className="p-4 text-center">{contextHolder}<p>Policy not found: {slug}</p><p>Please ensure the database migration has been run.</p></div>;

    return (
        <div>
            {contextHolder}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <Title level={2} style={{ margin: 0 }}>Edit {title || slug}</Title>
                <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} loading={saving}>
                    Save Changes
                </Button>
            </div>

            <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)' }}>
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Title</label>
                    <Input size="large" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Content</label>
                    <Editor value={content} onChange={setContent} />
                </div>
            </div>
        </div>
    );
}
