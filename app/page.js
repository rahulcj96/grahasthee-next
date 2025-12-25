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

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
        <Categories />
        <NewArrivals />
        <Collection />
        <BestSellers />
        <VideoSection />
        <Testimonials />
        <RelatedProducts />
        <Instagram />
      </main>
      <Footer />
    </>
  );
}
