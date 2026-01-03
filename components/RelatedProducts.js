import { supabase } from '@/lib/supabaseClient';
import ProductCard from './ProductCard';

async function getRelatedProducts(categoryId, currentProductId) {
    const { data, error } = await supabase
        .from('products')
        .select(`
            *,
            product_images!inner(*)
        `)
        .eq('category_id', categoryId)
        .neq('id', currentProductId)
        .eq('product_images.is_primary', true)
        .limit(4);

    if (error) {
        console.error('Error fetching related products:', error);
        return [];
    }

    // Sort to ensure primary image is easily accessible if multiple matches occur (though we filter for primary)
    return data.map(product => {
        let imageUrl = product.product_images?.[ 0 ]?.image_url;
        if (imageUrl && imageUrl.startsWith('https://grahasthee.com/assets/')) {
            imageUrl = imageUrl.replace('https://grahasthee.com/assets/', '/');
        }
        return {
            ...product,
            image_url: imageUrl || '/placeholder.webp',
            alt_text: product.product_images?.[ 0 ]?.alt_text
        };
    });
}

export default async function RelatedProducts({ categoryId, currentProductId }) {
    if (!categoryId) return null;

    const relatedProducts = await getRelatedProducts(categoryId, currentProductId);

    if (relatedProducts.length === 0) return null;

    return (
        <section className="related-products py-5 bg-light mt-5">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="text-uppercase fw-bold m-0 h5-mobile">Frequently bought together</h3>
                    <a href="/shop" className="text-dark text-decoration-none border-bottom border-dark small fw-bold view-all">VIEW ALL</a>
                </div>
                <div className="row g-4">
                    {relatedProducts.map(product => (
                        <div key={product.id} className="col-6 col-md-3">
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
