import { supabase } from "@/lib/supabaseClient";

export const revalidate = 60; // Revalidate every 60 seconds

import Header from "@/components/Header";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import Categories from "@/components/home/Categories";
import NewArrivals from "@/components/home/NewArrivals";
import Collection from "@/components/home/Collection";
import BestSellers from "@/components/home/BestSellers";
import VideoSection from "@/components/home/VideoSection";
import Testimonials from "@/components/home/Testimonials";
import RelatedProducts from "@/components/home/RelatedProducts";
import Instagram from "@/components/home/Instagram";
import Footer from "@/components/Footer";

async function getHomeData() {
  const [ categoriesResult, productsResult ] = await Promise.all([
    supabase.from('categories').select('*'),
    supabase.from('products')
      .select(`
          *,
          product_images!inner (
              image_url,
              alt_text,
              is_primary
          )
      `)
      .eq('product_images.is_primary', true)
      .order('created_at', { ascending: false })
      .limit(50)
  ]);

  const categories = categoriesResult.data;
  const products = productsResult.data;

  const transformedProducts = products?.map(product => {
    let imageUrl = product.product_images?.[ 0 ]?.image_url;
    if (imageUrl && imageUrl.startsWith('https://grahasthee.com/assets/')) {
      imageUrl = imageUrl.replace('https://grahasthee.com/assets/', '/');
    }
    return {
      ...product,
      image_url: imageUrl,
      alt_text: product.product_images?.[ 0 ]?.alt_text
    };
  }) || [];

  const transformedCategories = categories?.map(cat => ({
    ...cat,
    image_url: cat.image_url?.startsWith('https://grahasthee.com/assets/')
      ? cat.image_url.replace('https://grahasthee.com/assets/', '/')
      : cat.image_url
  })) || [];

  return {
    categories: transformedCategories,
    newArrivals: transformedProducts.filter(p => p.is_new_arrival).slice(0, 10),
    bestSellers: transformedProducts.filter(p => p.is_best_seller).slice(0, 10),
    allProducts: transformedProducts.slice(0, 8)
  };
}

export default async function Home() {
  const { categories, newArrivals, bestSellers, allProducts } = await getHomeData();

  return (
    <>
      <Header />
      <main>
        <Hero categories={categories} />
        <Features />
        <Categories />
        <NewArrivals products={newArrivals} />
        <Collection />
        <BestSellers products={bestSellers} />
        <VideoSection />
        <Testimonials />
        <RelatedProducts products={allProducts} />
        <Instagram />
      </main>
      <Footer />
    </>
  );
}

