import Link from 'next/link';
import Image from 'next/image';

export default function ProductCard({ product }) {
    const {
        title,
        slug,
        price,
        compare_at_price,
        image_url,
        alt_text
    } = product;

    const discount = compare_at_price
        ? Math.round(((compare_at_price - price) / compare_at_price) * 100)
        : 0;

    return (
        <div className="product-card" data-aos="fade-up">
            <div className="product-image-container image-zoom-effect">
                <Link href={`/product/${slug}`} className="d-block w-100">
                    <div className="image-holder" style={{ width: '100%', height: '350px', overflow: 'hidden' }}>
                        <Image
                            src={image_url || '/placeholder.webp'}
                            alt={alt_text || title}
                            width={400}
                            height={350}
                            style={{
                                width: '100%',
                                height: '350px',
                                objectFit: 'cover',
                                display: 'block'
                            }}
                            className="img-fluid"
                        />
                    </div>
                </Link>
                <div className="product-actions">
                    <button className="btn btn-outline-dark btn-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <use xlinkHref="#heart"></use>
                        </svg>
                    </button>
                    <button className="btn btn-dark btn-sm">Add to Cart</button>
                    <button className="btn btn-outline-dark btn-sm">
                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <use xlinkHref="#search"></use>
                        </svg>
                    </button>
                </div>
            </div>
            <div className="product-info">
                <h5 className="product-title text-uppercase">
                    <Link href={`/product/${slug}`} className="text-dark">
                        {title}
                    </Link>
                </h5>
                <div className="product-price">
                    ₹{parseFloat(price).toLocaleString()}
                    {compare_at_price && (
                        <>
                            <span className="product-original-price">₹{parseFloat(compare_at_price).toLocaleString()}</span>
                            {discount > 0 && <span className="product-sale ms-2 text-danger">{discount}% OFF</span>}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
