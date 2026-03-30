import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api, { siteConfigError } from "../api";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, checkout } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (siteConfigError) {
      setLoading(false);
      return;
    }
    async function fetchProduct() {
      setLoading(true);
      setError(null);
      const result = await api.getProduct(id);
      if (result.success) {
        setProduct(result.data);
        setMainImage(result.data.images?.[0] || null);

        if (result.data.related_ids?.length > 0) {
          const relatedResults = await Promise.all(
            result.data.related_ids.slice(0, 4).map((rid) =>
              api.getProduct(String(rid))
            )
          );
          setRelatedProducts(
            relatedResults.filter((r) => r.success).map((r) => r.data)
          );
        }
      } else {
        setError(result.error);
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  async function handleAddToCart() {
    if (!product || adding) return;
    setAdding(true);
    try {
      await addToCart(product.id, String(quantity));
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-slate-200 rounded-xl animate-pulse" />
          <div className="space-y-4 py-4">
            <div className="h-6 bg-slate-200 animate-pulse rounded w-1/3" />
            <div className="h-10 bg-slate-200 animate-pulse rounded w-2/3" />
            <div className="h-8 bg-slate-200 animate-pulse rounded w-1/4" />
            <div className="h-4 bg-slate-200 animate-pulse rounded w-full" />
            <div className="h-4 bg-slate-200 animate-pulse rounded w-5/6" />
            <div className="h-12 bg-slate-200 animate-pulse rounded mt-6" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-red-500 text-lg mb-4">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="text-slate-600 underline hover:text-slate-900"
        >
          Go back
        </button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
        <Link to="/" className="hover:text-slate-700 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-slate-700 transition-colors">
          Shop
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-medium truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Product Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Left: Images */}
        <div>
          {/* Main Image */}
          <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden mb-4 shadow-sm">
            {mainImage ? (
              <img
                src={mainImage.src}
                alt={mainImage.alt || product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-200">
                <svg
                  className="h-24 w-24 text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    mainImage?.src === img.src
                      ? "border-indigo-600 ring-2 ring-indigo-200"
                      : "border-transparent hover:border-slate-300"
                  }`}
                >
                  <img
                    src={img.src}
                    alt={img.alt || product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex flex-col">
          {/* Category Pill */}
          {product.categories?.[0] && (
            <span className="inline-block self-start bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">
              {product.categories[0].name}
            </span>
          )}

          {/* Product Name */}
          <h1 className="text-3xl font-bold text-slate-900 mb-4 leading-snug">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-3">
            {product.on_sale && product.sale_price ? (
              <>
                <span className="text-2xl font-bold text-red-600">
                  {product.sale_price}
                </span>
                <span className="text-lg text-slate-400 line-through">
                  {product.regular_price}
                </span>
                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded uppercase">
                  Sale
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold text-slate-900">
                {product.price}
              </span>
            )}
          </div>

          {/* Stock Badge */}
          <div className="mb-5">
            {product.in_stock ? (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                In Stock
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Out of Stock
              </span>
            )}
          </div>

          {/* Short Description */}
          {product.short_description && (
            <div
              className="text-slate-600 text-sm leading-relaxed mb-7 prose prose-sm max-w-none prose-p:my-1"
              dangerouslySetInnerHTML={{ __html: product.short_description }}
            />
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-4 mt-auto">
            {/* Pill Quantity Selector */}
            <div className="flex items-center rounded-full border border-slate-200 overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-4 py-2.5 text-slate-600 hover:bg-slate-50 transition-colors text-lg font-light"
              >
                −
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-12 text-center py-2.5 text-sm font-medium focus:outline-none border-x border-slate-200"
              />
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-4 py-2.5 text-slate-600 hover:bg-slate-50 transition-colors text-lg font-light"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={adding || !product.in_stock}
              className="flex-grow bg-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {adding ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Adding…
                </>
              ) : !product.in_stock ? (
                "Out of Stock"
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>

          {/* Checkout Now */}
          {product.in_stock && (
            <button
              onClick={checkout}
              className="mt-3 text-sm text-center text-slate-500 hover:text-indigo-600 transition-colors underline underline-offset-2"
            >
              or Checkout Now →
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-16">
        <div className="flex border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === "description"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === "details"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Details
          </button>
        </div>

        {activeTab === "description" && (
          <div
            className="prose prose-sm max-w-none text-slate-700 prose-a:text-indigo-600"
            dangerouslySetInnerHTML={{
              __html: product.description || "<p>No description available.</p>",
            }}
          />
        )}

        {activeTab === "details" && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 max-w-md">
              {product.sku && (
                <>
                  <span className="text-slate-500 font-medium">SKU</span>
                  <span className="text-slate-800">{product.sku}</span>
                </>
              )}
              {product.weight && (
                <>
                  <span className="text-slate-500 font-medium">Weight</span>
                  <span className="text-slate-800">{product.weight}</span>
                </>
              )}
              {product.categories?.length > 0 && (
                <>
                  <span className="text-slate-500 font-medium">Categories</span>
                  <span className="text-slate-800">
                    {product.categories.map((c) => c.name).join(", ")}
                  </span>
                </>
              )}
              {product.tags?.length > 0 && (
                <>
                  <span className="text-slate-500 font-medium">Tags</span>
                  <span className="text-slate-800">
                    {product.tags.map((t) => t.name).join(", ")}
                  </span>
                </>
              )}
            </div>
            {!product.sku && !product.weight && !product.categories?.length && (
              <p className="text-slate-500">No additional details available.</p>
            )}
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
