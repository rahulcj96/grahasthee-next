'use client'

import React from 'react'
import { Row, Col, Card, Statistic, Typography } from 'antd'
import { ShoppingOutlined, AppstoreOutlined, ShoppingCartOutlined } from '@ant-design/icons'

const { Title } = Typography

export default function DashboardClient({ stats }) {
    return (
        <div>
            <Title level={2} style={{ marginBottom: 24, color: 'inherit' }}>Dashboard</Title>
            <Row gutter={16}>
                <Col span={8}>
                    <Card variant="borderless">
                        <Statistic
                            title="Total Products"
                            value={stats.productCount}
                            prefix={<ShoppingOutlined style={{ color: '#1890ff' }} />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card variant="borderless">
                        <Statistic
                            title="Total Categories"
                            value={stats.categoryCount}
                            prefix={<AppstoreOutlined style={{ color: '#52c41a' }} />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card variant="borderless">
                        <Statistic
                            title="Total Orders"
                            value={stats.orderCount}
                            prefix={<ShoppingCartOutlined style={{ color: '#faad14' }} />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}
