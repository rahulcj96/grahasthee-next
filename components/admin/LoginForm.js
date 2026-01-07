'use client'

import React, { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import { loginAdmin } from '@/app/actions/admin-auth'

export default function LoginForm() {
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
            message.error(result.error)
            setLoading(false)
        }
    }

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '40px',
            width: '100%',
            maxWidth: '380px',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            color: 'white'
        }}>
            {/* Avatar Placeholder */}
            <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.3)',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '32px',
                color: 'white',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
                👤
            </div>

            <h2 style={{
                color: 'white',
                marginBottom: '8px',
                fontSize: '20px',
                fontWeight: '500',
                textShadow: '0 1px 2px rgba(0,0,0,0.2)'
            }}>Admin Console</h2>

            <p style={{
                color: 'rgba(255,255,255,0.8)',
                marginBottom: '32px',
                fontSize: '14px'
            }}>Enter your credentials</p>

            <Form
                name="admin_login"
                onFinish={onFinish}
                layout="vertical"
                size="large"
                style={{ width: '100%' }}
            >
                <Form.Item
                    name="username"
                    rules={[ { required: true, message: 'Please input your username!' } ]}
                >
                    <Input
                        placeholder="Username"
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            color: 'white',
                            borderRadius: '8px',
                            padding: '10px 16px',
                        }}
                        // Overriding AntD Input styles for placeholder color
                        className="glass-input"
                    />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[ { required: true, message: 'Please input your password!' } ]}
                >
                    <Input.Password
                        placeholder="Password"
                        style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            border: 'none',
                            color: 'white',
                            borderRadius: '8px',
                            padding: '10px 16px'
                        }}
                        className="glass-input"
                    />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="text"
                        htmlType="submit"
                        loading={loading}
                        icon={<ArrowRightOutlined />}
                        style={{
                            width: '100%',
                            height: 'auto',
                            padding: '4px',
                            color: 'white',
                            fontSize: '24px',
                            background: 'transparent',
                            marginTop: '10px'
                        }}
                    />
                </Form.Item>
            </Form>

            {/* Global CSS for placeholder color override */}
            <style jsx global>{`
        .glass-input::placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
        }
        .glass-input input {
          color: white !important;
        }
        .ant-input-password-icon {
          color: rgba(255, 255, 255, 0.6) !important;
        }
        .ant-input-password-icon:hover {
          color: white !important;
        }
        .glass-input:hover, .glass-input:focus {
           background: rgba(255, 255, 255, 0.3) !important;
        }
      `}</style>
        </div>
    )
}
