'use client'

import React, { useState } from 'react'
import { Layout, ConfigProvider, theme, Button, Breadcrumb } from 'antd'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { BulbOutlined, BulbFilled, MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined } from '@ant-design/icons'
// Import CSS to ensure Antd styles work if not automatically handled
import 'antd/dist/reset.css'
import { logoutAdmin } from '@/app/actions/admin-auth'

const { Header, Content, Footer } = Layout

export default function AdminClientLayout({ children }) {
    const [ collapsed, setCollapsed ] = useState(false)
    const [ isDarkMode, setIsDarkMode ] = useState(false)
    const pathname = usePathname()

    // Don't apply admin layout to login page
    const isLoginPage = pathname === '/admin/login'

    if (isLoginPage) {
        return <>{children}</>
    }

    // Generate breadcrumb items
    const pathSnippets = pathname.split('/').filter((i) => i)
    const breadcrumbItems = pathSnippets.map((_, index) => {
        const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
        return {
            title: pathSnippets[ index ].charAt(0).toUpperCase() + pathSnippets[ index ].slice(1),
            href: url,
        }
    })

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#1677ff',
                },
            }}
        >
            <Layout style={{ minHeight: '100vh' }}>
                <AdminSidebar collapsed={collapsed} isDarkMode={isDarkMode} />
                <Layout>
                    <Header style={{ padding: '0 24px', background: isDarkMode ? '#001529' : '#fff', display: 'flex', alignItems: 'center' }}>
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                                color: isDarkMode ? '#fff' : 'inherit'
                            }}
                        />
                        <div style={{ flex: 1, marginLeft: 16 }}>
                            <Breadcrumb items={[ { title: 'Admin', href: '/admin' }, ...breadcrumbItems.filter(item => item.title !== 'Admin') ]} />
                        </div>
                        <Button
                            icon={isDarkMode ? <BulbFilled /> : <BulbOutlined />}
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            shape="circle"
                            style={{ marginRight: 8 }}
                        />
                        <Button
                            icon={<LogoutOutlined />}
                            onClick={() => logoutAdmin()}
                            shape="circle"
                            danger
                        />
                    </Header>
                    <Content style={{ margin: '16px 16px' }}>
                        <div
                            style={{
                                padding: 24,
                                minHeight: 360,
                                background: isDarkMode ? '#141414' : '#fff',
                                borderRadius: 8,
                            }}
                        >
                            {children}
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Grahasthee ©{new Date().getFullYear()} Created with Ant Design
                    </Footer>
                </Layout>
            </Layout>
        </ConfigProvider>
    )
}
