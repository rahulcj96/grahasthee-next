'use client'

import React from 'react'
import { Typography } from 'antd'

const { Title } = Typography

export default function PageTitle({ level = 2, children, style }) {
    return (
        <Title level={level} style={{ marginBottom: 24, ...style }}>
            {children}
        </Title>
    )
}
