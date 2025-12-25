import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductGallery from '@/components/ProductGallery';
import ProductActions from '@/components/ProductActions';
import RelatedProducts from '@/components/RelatedProducts';
import Link from 'next/link';
import { SvgIcons } from '@/components/SvgIcons';

async function getProduct(slug) {
    const { data: product, error } = await supabase
        .from('products')
        .select(`
            *,
            categories(title, slug),
            product_images(*)
        `)
        .eq('slug', slug)
        .single();

    if (error || !product) {
        return null;
    }

    // Sort images to put primary first, then by display_order
    product.product_images.sort((a, b) => {
        if (a.is_primary && !b.is_primary) return -1;
        if (!a.is_primary && b.is_primary) return 1;
        return a.display_order - b.display_order;
    });

    // Transform static URLs to local paths if needed
    product.product_images = product.product_images.map(img => ({
        ...img,
        image_url: img.image_url.startsWith('https://grahasthee.com/assets/')
            ? img.image_url.replace('https://grahasthee.com/assets/', '/')
            : img.image_url
    }));

    return product;
}

export default async function ProductDetailPage({ params }) {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
        notFound();
    }

    const {
        title,
        price,
        compare_at_price,
        description,
        product_images,
        categories
    } = product;

    const discount = compare_at_price
        ? Math.round(((compare_at_price - price) / compare_at_price) * 100)
        : 0;

    return (
        <>
            <Header />
            <main>
                <section className="product-details py-5">
                    <div className="container">
                        <nav aria-label="breadcrumb" className="mb-4">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link href="/">Home</Link></li>
                                <li className="breadcrumb-item"><Link href="/shop">Shop</Link></li>
                                {categories && (
                                    <li className="breadcrumb-item">
                                        <Link href={`/shop?category=${categories.slug}`}>{categories.title}</Link>
                                    </li>
                                )}
                                <li className="breadcrumb-item active" aria-current="page">{title}</li>
                            </ol>
                        </nav>

                        <div className="row">
                            <div className="col-md-6 mb-5" data-aos="fade-right">
                                <ProductGallery images={product_images} productTitle={title} />
                            </div>

                            <div className="col-md-6 mb-5" data-aos="fade-left">
                                <div className="product-info ps-md-4">
                                    <h1 className="product-title text-uppercase mb-3 fw-bold" style={{ fontSize: '2.5rem' }}>{title}</h1>
                                    <div className="product-price mb-4">
                                        <span className="current-price h3 fw-bold">₹{parseFloat(price).toLocaleString()}</span>
                                        {compare_at_price && (
                                            <>
                                                <span className="original-price text-muted text-decoration-line-through ms-3 h5">
                                                    ₹{parseFloat(compare_at_price).toLocaleString()}
                                                </span>
                                                {discount > 0 && (
                                                    <span className="discount badge bg-danger ms-3" style={{ fontSize: '1rem' }}>
                                                        {discount}% OFF
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </div>

                                    <div className="product-rating mb-4 d-flex align-items-center">
                                        <div className="stars d-flex text-warning">
                                            {[ ...Array(5) ].map((_, i) => (
                                                <svg key={i} width="20" height="20" viewBox="0 0 15 15" className="me-1">
                                                    <use xlinkHref="#star-solid"></use>
                                                </svg>
                                            ))}
                                        </div>
                                        <span className="ms-2 text-muted small">(4.8/5 based on 42 reviews)</span>
                                    </div>

                                    <div className="product-description mb-4">
                                        <p className="lead">{description || "No description available for this product."}</p>
                                    </div>

                                    <hr className="my-4" />

                                    <ProductActions product={{
                                        ...product,
                                        image_url: product_images?.[ 0 ]?.image_url.startsWith('https://grahasthee.com/assets/')
                                            ? product_images[ 0 ].image_url.replace('https://grahasthee.com/assets/', '/')
                                            : product_images?.[ 0 ]?.image_url
                                    }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <RelatedProducts
                    categoryId={product.category_id}
                    currentProductId={product.id}
                />
            </main>
            <Footer />
        </>
    );
}
