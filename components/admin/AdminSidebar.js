'use client'

import React from 'react'
import { Layout, Menu, Button } from 'antd'
import {
    DashboardOutlined,
    AppstoreOutlined,
    ShoppingOutlined,
    FileImageOutlined,
    CloudUploadOutlined,
    LogoutOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { logoutAdmin } from '@/app/actions/admin-auth'

const { Sider } = Layout

export default function AdminSidebar({ collapsed, isDarkMode }) {
    const pathname = usePathname()

    const menuItems = [
        {
            key: '/admin',
            icon: <DashboardOutlined />,
            label: <Link href="/admin">Dashboard</Link>,
        },
        {
            key: '/admin/categories',
            icon: <AppstoreOutlined />,
            label: <Link href="/admin/categories">Categories</Link>,
        },
        {
            key: '/admin/products',
            icon: <ShoppingOutlined />,
            label: <Link href="/admin/products">Products</Link>,
        },
        {
            key: '/admin/product-images',
            icon: <FileImageOutlined />,
            label: <Link href="/admin/product-images">Product Images</Link>,
        },
        {
            key: '/admin/upload',
            icon: <CloudUploadOutlined />,
            label: <Link href="/admin/upload">Upload</Link>,
        },
    ]

    // Dynamic Styles based on theme
    const siderTheme = isDarkMode ? 'dark' : 'light'

    return (
        <Sider
            trigger={null}
            collapsible
            collapsed={collapsed}
            theme={siderTheme}
            style={{
                borderRight: isDarkMode ? 'none' : '1px solid #f0f0f0'
            }}
        >
            <div style={{
                height: 64,
                margin: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
            }}>
                {collapsed ? (
                    <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: isDarkMode ? 'white' : 'black' }}>G</div>
                ) : (
                    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            src="/images/logo.webp"
                            alt="Grahasthee"
                            width={150}
                            height={50}
                            style={{ objectFit: 'contain', filter: isDarkMode ? 'brightness(0) invert(1)' : 'none' }}
                        />
                    </div>
                )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 96px)' }}>
                <Menu
                    theme={siderTheme}
                    mode="inline"
                    selectedKeys={[ pathname ]}
                    items={menuItems}
                    style={{ borderRight: 0, flex: 1 }}
                />
            </div>
        </Sider >
    )
}
