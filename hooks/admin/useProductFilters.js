import { useState, useMemo } from 'react'

export function useProductFilters(initialData) {
    const [ searchText, setSearchText ] = useState('')
    const [ selectedCategory, setSelectedCategory ] = useState(null)
    const [ stockStatus, setStockStatus ] = useState('all')
    const [ minPrice, setMinPrice ] = useState(null)
    const [ maxPrice, setMaxPrice ] = useState(null)
    const [ showFilters, setShowFilters ] = useState(false)

    // Filter data based on all active filters
    const filteredData = useMemo(() => {
        let filtered = initialData

        // Search filter
        if (searchText) {
            filtered = filtered.filter(record =>
                String(record.title).toLowerCase().includes(searchText.toLowerCase()) ||
                String(record.sku).toLowerCase().includes(searchText.toLowerCase())
            )
        }

        // Category filter
        if (selectedCategory) {
            filtered = filtered.filter(record => record.category_id === selectedCategory)
        }

        // Stock status filter
        if (stockStatus === 'in_stock') {
            filtered = filtered.filter(record => record.stock_quantity > 0)
        } else if (stockStatus === 'out_of_stock') {
            filtered = filtered.filter(record => record.stock_quantity === 0)
        }

        // Price range filter
        if (minPrice !== null) {
            filtered = filtered.filter(record => record.price >= minPrice)
        }
        if (maxPrice !== null) {
            filtered = filtered.filter(record => record.price <= maxPrice)
        }

        return filtered
    }, [ initialData, searchText, selectedCategory, stockStatus, minPrice, maxPrice ])

    const clearFilters = () => {
        setSearchText('')
        setSelectedCategory(null)
        setStockStatus('all')
        setMinPrice(null)
        setMaxPrice(null)
    }

    const hasActiveFilters = searchText || selectedCategory || stockStatus !== 'all' || minPrice !== null || maxPrice !== null

    return {
        filters: {
            searchText,
            selectedCategory,
            stockStatus,
            minPrice,
            maxPrice,
            showFilters
        },
        setFilters: {
            setSearchText,
            setSelectedCategory,
            setStockStatus,
            setMinPrice,
            setMaxPrice,
            setShowFilters
        },
        filteredData,
        clearFilters,
        hasActiveFilters
    }
}
