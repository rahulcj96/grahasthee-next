import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import SortFilter from "@/components/SortFilter";
import StockFilter from "@/components/StockFilter";
import Pagination from "@/components/Pagination";
import { supabase } from "@/lib/supabaseClient";
import Reveal from "@/components/Reveal";

export const revalidate = 60; // Revalidate every 60 seconds

const ITEMS_PER_PAGE = 12;


async function getProducts(categorySlug, sortBy, inStock, page = 1) {
    let query = supabase
        .from('products')
        .select(`
            *,
            product_images!inner (
                image_url,
                alt_text,
                is_primary
            )
        `, { count: 'exact' })
        .eq('product_images.is_primary', true);

    if (categorySlug) {
        const { data: categoryData } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', categorySlug)
            .single();

        if (categoryData) {
            query = query.eq('category_id', categoryData.id);
        }
    }

    if (inStock === 'true') {
        query = query.gt('stock_quantity', 0);
    }

    if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'price_low') {
        query = query.order('price', { ascending: true });
    } else if (sortBy === 'price_high') {
        query = query.order('price', { ascending: false });
    } else {
        query = query.order('id', { ascending: true });
    }

    // Pagination range
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
        console.error('Error fetching products:', error);
        return { products: [], totalCount: 0 };
    }

    const transformedProducts = data.map(product => {
        let imageUrl = product.product_images?.[ 0 ]?.image_url;
        if (imageUrl && imageUrl.startsWith('https://grahasthee.com/assets/')) {
            imageUrl = imageUrl.replace('https://grahasthee.com/assets/', '/');
        }
        return {
            ...product,
            image_url: imageUrl,
            alt_text: product.product_images?.[ 0 ]?.alt_text
        };
    });

    return { products: transformedProducts, totalCount: count || 0 };
}

async function getCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('*');

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
    return data;
}

export default async function ShopPage({ searchParams }) {
    const params = await searchParams;
    const category = params?.category;
    const sort = params?.sort;
    const inStock = params?.inStock;
    const page = parseInt(params?.page) || 1;

    const { products, totalCount } = await getProducts(category, sort, inStock, page);
    const categories = await getCategories();
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return (
        <>
            <Header />
            <main>
                {/* Page Header */}
                <section className="page-header py-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <Reveal animation="fade-up">
                                    <h1 className="section-title">Our Collection</h1>
                                </Reveal>
                                <Reveal animation="fade-up" delay={300}>
                                    <p className="lead">
                                        Discover our range of thoughtfully designed home essentials — from handcrafted cushion covers
                                        to luxurious towels and eco-conscious lifestyle pieces.
                                    </p>
                                </Reveal>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Product Filters */}
                <section className="product-filters">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="filter-options">
                                    <div className="filter-group">
                                        <span className="filter-label">Category:</span>
                                        <CategoryFilter categories={categories} />
                                    </div>

                                    <div className="filter-group">
                                        <span className="filter-label">Sort by:</span>
                                        <SortFilter />
                                    </div>

                                    <div className="filter-group">
                                        <StockFilter />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Product Grid */}
                <section className="product-grid-section bg-light py-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="product-grid">
                                    {products.length > 0 ? (
                                        products.map(product => (
                                            <ProductCard key={product.id} product={product} />
                                        ))
                                    ) : (
                                        <div className="text-center py-5">
                                            <h3>No products found</h3>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            searchParams={params}
                        />
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
