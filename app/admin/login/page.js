import React from 'react'
import LoginForm from '@/components/admin/LoginForm'

async function getBingImage() {
    try {
        // Using fetch with cache control to ensure fresh daily image
        // format=js is recommended as per user feedback, though json usually works too.
        const response = await fetch('https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US', { next: { revalidate: 3600 } })

        if (!response.ok) {
            console.error('Bing API response not ok:', response.statusText)
            throw new Error('Bing API response not ok')
        }

        const data = await response.json()
        const imagePath = data?.images?.[ 0 ]?.url

        if (imagePath) {
            return `https://www.bing.com${imagePath}`
        }
    } catch (error) {
        console.error('Failed to fetch Bing image:', error)
    }
    // Fallback to a reliable Unsplash image (Nature/Landscape)
    return 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop'
}

export default async function AdminLoginPage() {
    const bgImage = await getBingImage()

    return (
        <div style={{
            position: 'relative',
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `url(${bgImage}) no-repeat center center`,
            backgroundSize: 'cover'
        }}>
            {/* Overlay for better text contrast if needed, but glass panel handles it */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%'
            }}>
                <LoginForm />
            </div>
        </div>
    )
}
