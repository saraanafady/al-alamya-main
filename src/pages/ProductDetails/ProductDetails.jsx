import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

const FAVORITES_KEY = 'favorites';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
    setFavorites(favs);
  }, []);

  // Persist favorites to localStorage
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://dummyjson.com/products/${productId}`);
        const data = await response.json();
        setProduct(data);
        // Fetch related products from the same category
        const relatedResponse = await fetch(`https://dummyjson.com/products/category/${data.category}`);
        const relatedData = await relatedResponse.json();
        setRelatedProducts(relatedData.products.filter(p => p.id !== parseInt(productId)).slice(0, 4));
      } catch (error) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  // Favorite logic
  const isFavorite = (id) => favorites.includes(id);
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  // Cart logic
  const handleAddToCart = (id, qty = 1) => {
    if (!isInCart(id)) {
      addToCart(id, qty);
    }
  };

  const discountedPrice = product && product.discountPercentage
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : product && product.price;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full py-16">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6"></div>
        <p className="text-slate-400 dark:text-slate-500 text-lg">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full py-16">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Product Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">The product you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/')} className="px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10 w-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-8">
        <span onClick={() => navigate('/')} className="cursor-pointer hover:text-blue-600">Home</span>
        <span>/</span>
        <span onClick={() => navigate(`/category/${product.category}`)} className="cursor-pointer hover:text-blue-600 capitalize">{product.category}</span>
        <span>/</span>
        <span className="text-slate-900 dark:text-white font-semibold">{product.title}</span>
      </div>
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Product Images */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="relative w-full aspect-square bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center overflow-hidden shadow-md">
            <img
              src={product.images?.[selectedImage] || product.thumbnail}
              alt={product.title}
              className="w-full h-full object-contain max-h-[420px] transition-transform duration-300"
              onError={e => { e.target.src = product.thumbnail; }}
            />
            {product.discountPercentage > 0 && (
              <span className="absolute top-4 left-4 bg-gradient-to-br from-red-500 to-red-700 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-[0_2px_8px_rgba(239,68,68,0.3)] z-20">
                -{Math.round(product.discountPercentage)}%
              </span>
            )}
            {/* Favorite Icon */}
            <button
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 shadow hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
              onClick={e => { e.stopPropagation(); toggleFavorite(product.id); }}
              title={isFavorite(product.id) ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite(product.id) ? (
                <svg className="w-7 h-7 text-red-500 fill-red-500" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
              ) : (
                <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12.1 8.64l-.1.1-.11-.11C10.14 6.6 7.1 7.24 5.6 9.28c-1.5 2.04-1.1 5.13 1.4 7.36 2.5 2.23 5.5 4.36 5.5 4.36s3-2.13 5.5-4.36c2.5-2.23 2.9-5.32 1.4-7.36-1.5-2.04-4.54-2.68-6.5-0.64z" /></svg>
              )}
            </button>
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 mt-2 justify-center">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.title} ${index + 1}`}
                  className={`w-16 h-16 object-contain rounded-lg border-2 cursor-pointer transition-all duration-200 ${selectedImage === index ? 'border-blue-600 shadow-lg' : 'border-slate-200 dark:border-slate-700'}`}
                  onClick={() => setSelectedImage(index)}
                  onError={e => { e.target.src = product.thumbnail; }}
                />
              ))}
            </div>
          )}
        </div>
        {/* Product Info */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider text-xs">{product.brand}</span>
              <span className="text-slate-400 dark:text-slate-500 text-xs">|</span>
              <span className="capitalize text-slate-600 dark:text-slate-300 text-xs">{product.category}</span>
              <span className={`ml-auto text-xs font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">{product.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              {/* Stars */}
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`}
                  fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 20 20"
                >
                  <polygon points="9.9,1.1 7.6,6.6 1.6,7.3 6.2,11.6 4.8,17.5 9.9,14.3 15,17.5 13.6,11.6 18.2,7.3 12.2,6.6 " />
                </svg>
              ))}
              <span className="ml-2 text-slate-500 dark:text-slate-400 text-sm">({product.rating})</span>
              <span className="ml-2 text-slate-400 dark:text-slate-500 text-xs">• Based on {Math.floor(Math.random() * 500) + 50} reviews</span>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">${discountedPrice}</span>
            {product.discountPercentage > 0 && (
              <span className="text-lg text-slate-400 line-through">${product.price}</span>
            )}
            {product.discountPercentage > 0 && (
              <span className="bg-gradient-to-br from-red-500 to-red-700 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-[0_2px_8px_rgba(239,68,68,0.3)]">-{Math.round(product.discountPercentage)}%</span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-slate-600 dark:text-slate-300 text-base">{product.description}</span>
          </div>
          {/* Quantity and Add to Cart */}
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
              >-</button>
              <span className="w-10 text-center text-lg font-semibold text-slate-900 dark:text-white">{quantity}</span>
              <button
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center justify-center hover:bg-blue-100 dark:hover:bg-blue-900 transition"
                onClick={() => setQuantity(q => q + 1)}
              >+</button>
            </div>
            <button
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-lg font-semibold uppercase tracking-wide transition-all duration-300 shadow-[0_2px_8px_rgba(37,99,235,0.2)] bg-gradient-to-br ${isInCart(product.id) ? 'from-emerald-500 to-emerald-700 text-white cursor-not-allowed' : 'from-blue-600 to-blue-400 hover:from-blue-900 hover:to-blue-600 text-white hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(37,99,235,0.3)]'}`}
              disabled={isInCart(product.id)}
              onClick={() => handleAddToCart(product.id, quantity)}
            >
              {isInCart(product.id) ? (
                <>
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" /></svg>
                  In Cart
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007 17h10a1 1 0 00.95-.68l3.24-7.24A1 1 0 0020 8H6.21" /></svg>
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {relatedProducts.map(rp => (
              <div
                key={rp.id}
                className="relative flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-[0_8px_32px_rgba(37,99,235,0.15)] border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300 h-full overflow-hidden group cursor-pointer hover:-translate-y-1"
                onClick={() => navigate(`/product/${rp.id}`)}
              >
                <div className="relative w-full h-40 mb-4 flex items-center justify-center bg-slate-50 dark:bg-slate-900 rounded-xl overflow-hidden">
                  <img src={rp.thumbnail} alt={rp.title} className="max-w-[80%] max-h-[80%] object-contain transition-transform duration-300 group-hover:scale-105" />
                  {rp.discountPercentage > 0 && (
                    <span className="absolute top-3 left-3 bg-gradient-to-br from-red-500 to-red-700 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-[0_2px_8px_rgba(239,68,68,0.3)] z-20">
                      -{Math.round(rp.discountPercentage)}%
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">{rp.brand}</span>
                <span className="text-base font-semibold text-slate-900 dark:text-white mb-1 leading-tight line-clamp-2 min-h-[2.8em]">{rp.title}</span>
                <div className="flex items-center gap-3 mt-4 flex-wrap">
                  <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                    ${rp.discountPercentage > 0 ? (rp.price * (1 - rp.discountPercentage / 100)).toFixed(2) : rp.price}
                  </span>
                  {rp.discountPercentage > 0 && (
                    <span className="text-base text-slate-400 line-through">
                      ${rp.price}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails; 