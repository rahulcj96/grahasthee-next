import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import SortFilter from "@/components/SortFilter";
import StockFilter from "@/components/StockFilter";
import { supabase } from "@/lib/supabaseClient";
import Reveal from "@/components/Reveal";

async function getProducts(categorySlug, sortBy, inStock) {
    let query = supabase
        .from('products')
        .select(`
      *,
      product_images!inner (
        image_url,
        alt_text,
        is_primary
      )
    `)
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

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return data.map(product => {
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

    const products = await getProducts(category, sort, inStock);
    const categories = await getCategories();

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

                                    <div className="filter-group ms-auto">
                                        <div className="btn-group" role="group">
                                            <button type="button" className="btn btn-outline-secondary active">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-grid-3x3-gap" viewBox="0 0 16 16">
                                                    <path d="M4 2v2H2V2h2zm1 12v-2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V7a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm5 10v-2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V7a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zm0-5V2a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1zM9 2v2H7V2h2zm5 0v2h-2V2h2zM4 7v2H2V7h2zm5 0v2H7V7h2zm5 0h-2v2h2V7zM4 12v2H2v-2h2zm5 0v2H7v-2h2zm5 0v2h-2v-2h2zM12 1a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zm-1 6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1V7zm1 4a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-2z" />
                                                </svg>
                                            </button>
                                            <button type="button" className="btn btn-outline-secondary">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
                                                    <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                                                </svg>
                                            </button>
                                        </div>
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

                        {/* Pagination */}
                        <div className="row mt-5">
                            <div className="col-md-12">
                                <nav aria-label="Product pagination">
                                    <ul className="pagination">
                                        <li className="page-item disabled">
                                            <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">Previous</a>
                                        </li>
                                        <li className="page-item active"><a className="page-link" href="#">1</a></li>
                                        <li className="page-item"><a className="page-link" href="#">2</a></li>
                                        <li className="page-item"><a className="page-link" href="#">3</a></li>
                                        <li className="page-item">
                                            <a className="page-link" href="#">Next</a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
