import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

// Renders star icons based on rating (out of 5)
function renderStars(rating) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg
        key={i}
        className="w-5 h-5"
        fill={i <= Math.round(rating) ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        style={{ color: i <= Math.round(rating) ? "#facc15" : "#d1d5db" }} // gold or gray
      >
        <polygon
          points="12,2 15,9 22,9 17,14 18,21 12,17 6,21 7,14 2,9 9,9"
        />
      </svg>
    );
  }
  return <div className="flex">{stars}</div>;
}



const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();
  const { addToFavorites, isInFavorites, removeFromFavorites } = useFavorites();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);



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
  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to favorites');
      return;
    }

    const favoriteProduct = {
      id: product.id,
      name: product.title,
      price: `$${product.price}`,
      image: product.thumbnail,
      category: product.category,
      brand: product.brand,
      description: product.description
    };

    if (isInFavorites(product.id)) {
      removeFromFavorites(product.id, product.title);
    } else {
      addToFavorites(favoriteProduct);
    }
  };

  // Cart logic
  const handleAddToCart = (productId, qty = 1) => {
    if (!isInCart(productId)) {
      // Pass the full product object to the cart
      addToCart({
        id: productId,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        brand: product.brand,
        quantity: qty
      });
    }
  };

  // Quantity functions
  const incrementQty = () => {
    setQuantity(prev => Math.min(prev + 1, 99));
  };

  const decrementQty = () => {
    setQuantity(prev => Math.max(prev - 1, 1));
  };

  // Related products navigation
  const handleRelatedClick = (relatedProduct) => {
    navigate(`/product/${relatedProduct.id}`);
  };

  const discountedPrice = product && product.discountPercentage
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : product && product.price;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full py-16" style={{ background: 'var(--primary-bg)' }}>
        <div className="w-12 h-12 border-4 rounded-full animate-spin mb-6" style={{ borderColor: 'var(--accent-text)', borderTopColor: 'transparent' }}></div>
        <p className="text-lg" style={{ color: 'var(--secondary-text)' }}>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] w-full py-16" style={{ background: 'var(--primary-bg)' }}>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--primary-text)' }}>Product Not Found</h2>
        <p className="mb-6" style={{ color: 'var(--secondary-text)' }}>The product you're looking for doesn't exist.</p>
        <button 
          onClick={() => navigate('/')} 
          className="px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
          style={{ 
            background: 'var(--gradient-primary)',
            color: 'white',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Defensive check for reviews
  if (product.reviews && !Array.isArray(product.reviews)) {
    console.warn('product.reviews is not an array:', product.reviews);
  }

  // Ensure reviews is always an array for safe rendering
  const safeReviews = Array.isArray(product.reviews) ? product.reviews : [];

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-10 w-full" style={{ background: 'var(--primary-bg)' }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--secondary-text)' }}>
        <span onClick={() => navigate('/')} className="cursor-pointer hover:text-blue-600 transition-colors">Home</span>
        <span>/</span>
        <span onClick={() => navigate(`/category/${product.category}`)} className="cursor-pointer hover:text-blue-600 capitalize transition-colors">{product.category}</span>
        <span>/</span>
        <span className="font-semibold" style={{ color: 'var(--primary-text)' }}>{product.title}</span>
      </div>
      <section className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Product Image */}
        <div className="flex flex-col items-center justify-center w-full">
          <div className="relative w-full max-w-md aspect-square bg-gradient-to-br from-[rgba(37,99,235,0.05)] to-[rgba(16,185,129,0.03)] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden mb-6">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-full object-contain p-4 transition-transform duration-300 hover:scale-110"
              style={{ background: 'var(--image-bg, #f8fafc)' }}
            />
            {product.discountPercentage > 0 && (
              <span className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                -{Math.round(product.discountPercentage)}%
              </span>
            )}
            <button 
              onClick={handleToggleFavorite}
              className={`absolute top-3 right-3 rounded-full p-2 shadow-md transition-all duration-200 ${
                isInFavorites(product.id) 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white/90 hover:bg-white text-gray-400 hover:text-red-500'
              }`} 
              aria-label="Add to Favorites"
            >
              <svg className="w-5 h-5" fill={isInFavorites(product.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>
          
          {/* Image Gallery Placeholder */}
          <div className="flex gap-2 justify-center w-full">
            <div className="w-16 h-16 rounded-lg border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center cursor-pointer">
              <img src={product.thumbnail} alt="Thumbnail 1" className="w-12 h-12 object-contain" />
            </div>
            <div className="w-16 h-16 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center cursor-pointer hover:border-blue-300">
              <span className="text-xs text-gray-500">+2</span>
            </div>
          </div>
        </div>
        {/* Product Info */}
        <div className="flex flex-col gap-6 w-full">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{product.brand}</span>
            {product.stock > 0 ? (
              <span className="text-xs font-semibold uppercase tracking-wider text-green-600 bg-green-50 px-3 py-1 rounded-full">In Stock</span>
            ) : (
              <span className="text-xs font-semibold uppercase tracking-wider text-red-600 bg-red-50 px-3 py-1 rounded-full">Out of Stock</span>
            )}
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--primary-text)' }}>{product.title}</h1>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {renderStars(product.rating)}
            </div>
            <span className="text-sm text-gray-400">({product.rating})</span>
            <span className="text-xs text-gray-400">Based on {Array.isArray(product.reviews) ? product.reviews.length : (product.reviews || 0)} reviews</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-3xl font-bold text-blue-600">${product.price}</span>
            {product.discountPercentage > 0 && (
              <span className="text-lg line-through text-red-400">${product.originalPrice}</span>
            )}
            {product.discountPercentage > 0 && (
              <span className="text-base font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">-{Math.round(product.discountPercentage)}%</span>
            )}
          </div>
          <p className="text-base text-gray-300 mb-4" style={{ color: 'var(--secondary-text)' }}>{product.description}</p>
          {/* Quantity Selector & Add to Cart */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-2 rounded-xl px-3 py-2 shadow-inner theme-card">
              <button 
                onClick={decrementQty} 
                className="w-8 h-8 flex items-center justify-center rounded-full text-xl font-bold transition-all duration-200 hover:scale-110" 
                style={{ 
                  background: 'var(--tertiary-bg)',
                  color: 'var(--primary-text)'
                }}
                aria-label="Decrease Quantity"
              >
                -
              </button>
              <span className="text-lg font-semibold px-3" style={{ color: 'var(--primary-text)' }}>{quantity}</span>
              <button 
                onClick={incrementQty} 
                className="w-8 h-8 flex items-center justify-center rounded-full text-xl font-bold transition-all duration-200 hover:scale-110" 
                style={{ 
                  background: 'var(--tertiary-bg)',
                  color: 'var(--primary-text)'
                }}
                aria-label="Increase Quantity"
              >
                +
              </button>
            </div>
            <button
              onClick={() => handleAddToCart(product.id, quantity)}
              className="flex-1 py-4 rounded-2xl font-bold text-lg shadow-xl transition-all duration-300 text-white flex items-center justify-center gap-3 hover:scale-105"
              style={{ 
                background: 'var(--gradient-primary)',
                boxShadow: 'var(--shadow-lg)'
              }}
              aria-label="Add to Cart"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"/><path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"/><path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"/></svg>
              Add to Cart
            </button>
          </div>
        </div>
      </section>
      {/* Related Products */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--primary-text)' }}>Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {relatedProducts.map(related => (
            <div key={related.id} className="rounded-2xl shadow-lg border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-blue-400 cursor-pointer theme-card"
              tabIndex={0}
              aria-label={related.title}
              onClick={() => handleRelatedClick(related)}
            >
              <div className="relative w-full h-48 flex items-center justify-center bg-[var(--image-bg,#f8fafc)]">
                <img src={related.thumbnail} alt={related.title} className="w-full h-full object-contain rounded-2xl" style={{ maxHeight: '140px', maxWidth: '90%' }} />
                {related.discountPercentage > 0 && (
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-green-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                    -{Math.round(related.discountPercentage)}%
                  </span>
                )}
              </div>
              <div className="p-4 flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-600 truncate">{related.brand}</span>
                <h3 className="font-semibold text-base truncate" style={{ color: 'var(--primary-text)' }}>{related.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-blue-600">${related.price}</span>
                  {related.discountPercentage > 0 && (
                    <span className="text-sm line-through text-red-400">${related.originalPrice}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Reviews Section */}
      {safeReviews.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--primary-text)' }}>Customer Reviews</h2>
          <div className="space-y-6">
            {safeReviews.map((review, idx) => (
              <div key={idx} className="rounded-xl border shadow p-6 theme-card">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-semibold text-base" style={{ color: 'var(--primary-text)' }}>{review.reviewerName}</span>
                  <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
                  <div className="flex ml-auto">{renderStars(review.rating)}</div>
                </div>
                <p className="text-sm" style={{ color: 'var(--secondary-text)' }}>{review.comment}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails; 