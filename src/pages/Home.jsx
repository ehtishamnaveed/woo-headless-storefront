import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { siteConfigError } from "../api";
import ProductCard from "../components/ProductCard";
import HeroCarousel from "../components/HeroCarousel";

function FeatureColumn({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center px-4">
      <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (siteConfigError) {
      setLoading(false);
      return;
    }
    async function fetchProducts() {
      setLoading(true);
      const result = await api.getProducts();
      if (result.success) {
        setProducts(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const featuredProducts = products.slice(0, 8);
  const heroProducts = products.slice(0, 6);

  const categories = useMemo(() => {
    const seen = new Set();
    const cats = [];
    for (const product of products) {
      for (const cat of product.categories || []) {
        if (!seen.has(cat.slug)) {
          seen.add(cat.slug);
          cats.push(cat);
        }
      }
    }
    return cats;
  }, [products]);

  return (
    <div>
      {/* Hero Carousel */}
      <HeroCarousel products={heroProducts} />

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Featured Products
          </h2>
          <Link
            to="/shop"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View All →
          </Link>
        </div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl overflow-hidden">
                <div className="aspect-square bg-slate-200 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-slate-200 animate-pulse rounded w-3/4" />
                  <div className="h-4 bg-slate-200 animate-pulse rounded w-1/2" />
                  <div className="h-8 bg-slate-200 animate-pulse rounded mt-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-16">
            <p className="text-red-500 text-base">{error}</p>
          </div>
        )}

        {!loading && !error && featuredProducts.length === 0 && (
          <p className="text-center text-slate-500 py-16">No products found.</p>
        )}

        {!loading && !error && featuredProducts.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                to="/shop"
                className="inline-block border-2 border-slate-900 text-slate-900 font-semibold py-3 px-8 rounded-full hover:bg-slate-900 hover:text-white transition-colors"
              >
                View All Products
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="bg-slate-50 py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              Shop by Category
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => navigate(`/shop?category=${cat.slug}`)}
                  className="px-5 py-2.5 rounded-full bg-white border border-slate-200 text-slate-700 text-sm font-medium hover:border-indigo-600 hover:text-indigo-600 hover:shadow-sm transition-all duration-200"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Shop With Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">
          Why Shop With Us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          <FeatureColumn
            icon={
              <svg className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            }
            title="Free Shipping"
            description="Enjoy free shipping on all orders over $50. Fast and reliable delivery right to your door."
          />
          <FeatureColumn
            icon={
              <svg className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            }
            title="Secure Checkout"
            description="Your payment information is always encrypted and protected with industry-standard security."
          />
          <FeatureColumn
            icon={
              <svg className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            }
            title="Easy Returns"
            description="Not happy? Return any item within 30 days for a full refund. No questions asked."
          />
        </div>
      </section>
    </div>
  );
}
