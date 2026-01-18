import React from 'react'
import { Input, Button, Space, Row, Col, Select, Radio, InputNumber } from 'antd'
import { SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons'

export default function ProductFilterBar({
    categories,
    filters,
    setFilters,
    clearFilters,
    hasActiveFilters,
    children // For Action buttons (Import, Export, Create)
}) {
    const {
        searchText,
        selectedCategory,
        stockStatus,
        minPrice,
        maxPrice,
        showFilters
    } = filters

    const {
        setSearchText,
        setSelectedCategory,
        setStockStatus,
        setMinPrice,
        setMaxPrice,
        setShowFilters
    } = setFilters

    return (
        <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <Space>
                    <Input
                        placeholder="Search products..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        style={{ width: 300 }}
                    />
                    <Button
                        icon={<FilterOutlined />}
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                    {hasActiveFilters && (
                        <Button
                            icon={<ClearOutlined />}
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </Button>
                    )}
                </Space>
                <Space>
                    {children}
                </Space>
            </div>

            {showFilters && (
                <div style={{
                    padding: 16,
                    background: 'var(--ant-color-bg-container)',
                    border: '1px solid var(--ant-color-border)',
                    borderRadius: 8,
                    marginBottom: 16
                }}>
                    <Row gutter={[ 16, 16 ]}>
                        <Col span={8}>
                            <div style={{ marginBottom: 8, fontWeight: 500 }}>Category</div>
                            <Select
                                placeholder="Select category"
                                style={{ width: '100%' }}
                                value={selectedCategory}
                                onChange={setSelectedCategory}
                                allowClear
                            >
                                {categories.map(cat => (
                                    <Select.Option key={cat.id} value={cat.id}>
                                        {cat.title}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Col>
                        <Col span={8}>
                            <div style={{ marginBottom: 8, fontWeight: 500 }}>Stock Status</div>
                            <Radio.Group
                                value={stockStatus}
                                onChange={e => setStockStatus(e.target.value)}
                                style={{ width: '100%' }}
                            >
                                <Radio.Button value="all">All</Radio.Button>
                                <Radio.Button value="in_stock">In Stock</Radio.Button>
                                <Radio.Button value="out_of_stock">Out of Stock</Radio.Button>
                            </Radio.Group>
                        </Col>
                        <Col span={8}>
                            <div style={{ marginBottom: 8, fontWeight: 500 }}>Price Range</div>
                            <Space.Compact style={{ width: '100%' }}>
                                <InputNumber
                                    placeholder="Min"
                                    prefix="₹"
                                    value={minPrice}
                                    onChange={setMinPrice}
                                    style={{ width: '50%' }}
                                    min={0}
                                />
                                <InputNumber
                                    placeholder="Max"
                                    prefix="₹"
                                    value={maxPrice}
                                    onChange={setMaxPrice}
                                    style={{ width: '50%' }}
                                    min={0}
                                />
                            </Space.Compact>
                        </Col>
                    </Row>
                </div>
            )}
        </div>
    )
}
