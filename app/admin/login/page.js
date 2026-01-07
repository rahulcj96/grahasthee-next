'use client'

import React, { useState } from 'react'
import { Form, Input, Button, Card, Typography, ThemeConfig, ConfigProvider, theme } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { loginAdmin } from '@/app/actions/admin-auth'

const { Title } = Typography

export default function AdminLoginPage() {
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState('')

    const onFinish = async (values) => {
        setLoading(true)
        setError('')

        const formData = new FormData()
        formData.append('username', values.username)
        formData.append('password', values.password)

        const result = await loginAdmin(null, formData)

        if (result?.error) {
            setError(result.error)
            setLoading(false)
        }
    }

    return (
        <ConfigProvider
            theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#1677ff',
                },
            }}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                background: '#f0f2f5'
            }}>
                <Card style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <div style={{ textAlign: 'center', marginBottom: 24 }}>
                        <Title level={3}>Admin Login</Title>
                    </div>

                    <Form
                        name="admin_login"
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            name="username"
                            rules={[ { required: true, message: 'Please input your username!' } ]}
                        >
                            <Input prefix={<UserOutlined />} placeholder="Username" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            rules={[ { required: true, message: 'Please input your password!' } ]}
                        >
                            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
                        </Form.Item>

                        {error && (
                            <div style={{ color: '#ff4d4f', marginBottom: 16, textAlign: 'center' }}>
                                {error}
                            </div>
                        )}

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block loading={loading}>
                                Log in
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </ConfigProvider>
    )
}
