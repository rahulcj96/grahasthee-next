'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function ProductGallery({ images, productTitle }) {
    const [ selectedImage, setSelectedImage ] = useState(images.find(img => img.is_primary) || images[ 0 ]);

    if (!images || images.length === 0) {
        return (
            <div className="main-image mb-4" style={{ height: '500px', backgroundColor: '#f8f9fa' }}>
                <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                    No image available
                </div>
            </div>
        );
    }

    return (
        <div className="product-gallery">
            <div className="main-image mb-4 position-relative" style={{ width: '100%', aspectRatio: '4/5', overflow: 'hidden' }}>
                <Image
                    src={selectedImage.image_url}
                    alt={selectedImage.alt_text || productTitle}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="img-fluid rounded"
                />
            </div>
            <div className="thumbnail-images d-flex gap-3">
                {images.map((img) => (
                    <div
                        key={img.id}
                        className={`thumb-item image-zoom-effect cursor-pointer border rounded overflow-hidden ${selectedImage.id === img.id ? 'border-primary border-2' : ''}`}
                        style={{ width: '80px', height: '80px', flexShrink: 0, position: 'relative' }}
                        onClick={() => setSelectedImage(img)}
                    >
                        <Image
                            src={img.image_url}
                            alt={img.alt_text || productTitle}
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
