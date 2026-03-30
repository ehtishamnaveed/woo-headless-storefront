import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import api, { siteConfigError } from "../api";
import ProductCard from "../components/ProductCard";

function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-100">
      <div className="aspect-square bg-slate-200 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-slate-200 animate-pulse rounded w-3/4" />
        <div className="h-4 bg-slate-200 animate-pulse rounded w-1/2" />
        <div className="h-8 bg-slate-200 animate-pulse rounded mt-3" />
      </div>
    </div>
  );
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  useEffect(() => {
    if (siteConfigError) {
      setLoading(false);
      return;
    }
    async function fetchProducts() {
      setLoading(true);
      const result = await api.getProducts();
      if (result.success) {
        setAllProducts(result.data);

        // If initial category param, filter in memory — no second API call needed.
        if (initialCategory && initialCategory !== "all") {
          setDisplayedProducts(
            result.data.filter((p) =>
              p.categories?.some((c) => c.slug === initialCategory)
            )
          );
        } else {
          setDisplayedProducts(result.data);
        }
      } else {
        setError(result.error);
      }
      setLoading(false);
    }
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const categories = useMemo(() => {
    const seen = new Set();
    const cats = [];
    for (const product of allProducts) {
      for (const cat of product.categories || []) {
        if (!seen.has(cat.slug)) {
          seen.add(cat.slug);
          cats.push(cat);
        }
      }
    }
    return cats;
  }, [allProducts]);

  async function handleSearch(e) {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setDisplayedProducts(allProducts);
      setActiveCategory("all");
      setSearchParams({});
      return;
    }
    setLoading(true);
    const result = await api.searchProducts(searchQuery.trim());
    if (result.success) {
      setDisplayedProducts(result.data);
      setActiveCategory("all");
      setSearchParams({});
    } else {
      setError(result.error);
    }
    setLoading(false);
  }

  async function handleCategoryClick(slug) {
    setActiveCategory(slug);
    setSearchQuery("");

    if (slug === "all") {
      setDisplayedProducts(allProducts);
      setSearchParams({});
      return;
    }

    setSearchParams({ category: slug });
    // Filter in memory — all products already loaded, instant, no API call.
    setDisplayedProducts(
      allProducts.filter((p) =>
        p.categories?.some((c) => c.slug === slug)
      )
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Shop All Products</h1>
        {!loading && (
          <p className="text-slate-500 text-sm mt-1">
            {displayedProducts.length} product{displayedProducts.length !== 1 ? "s" : ""} found
          </p>
        )}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
            <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7 7 0 1116.65 16.65z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white placeholder-slate-400"
          />
        </div>
        <button
          type="submit"
          className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-colors"
        >
          Search
        </button>
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setDisplayedProducts(allProducts);
              setActiveCategory("all");
              setSearchParams({});
            }}
            className="border border-slate-200 text-slate-600 px-4 py-2.5 rounded-xl text-sm hover:bg-slate-50 transition-colors"
          >
            Clear
          </button>
        )}
      </form>

      {/* Category Pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => handleCategoryClick("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeCategory === "all"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-800"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                activeCategory === cat.slug
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-800"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="text-center py-16">
          <p className="text-red-500">{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && displayedProducts.length === 0 && (
        <div className="text-center py-20">
          <svg className="h-16 w-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-slate-500 text-base">No products found.</p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && displayedProducts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
