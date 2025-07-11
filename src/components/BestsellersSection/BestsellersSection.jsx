import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';

const BestsellersSection = ({ products, loading }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToCart, isInCart, getItemQuantity } = useCart();

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const cartProduct = {
      id: product.id,
      name: product.title,
      price: `$${product.price}`,
      image: product.thumbnail,
      category: product.category,
      brand: product.brand
    };
    addToCart(cartProduct);
    toast.success(t('cart.addedToCart', { product: product.title }), {
      icon: '🛒',
      style: {
        background: '#10b981',
        color: '#ffffff',
      },
    });
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleShopMoreClick = () => {
    navigate('/products');
  };

  return (
    <section className="py-8 px-4 md:py-6 md:px-6 lg:py-8 lg:px-8 xl:py-12 xl:px-12 bg-white dark:bg-slate-900 w-full box-border overflow-x-hidden">
      <div className="w-full max-w-[1400px] mx-auto p-0 box-border overflow-x-hidden">
        {loading ? (
          <div className="text-center text-lg py-12 text-slate-400 dark:text-slate-500">{t('common.loading')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6 md:gap-6 xl:gap-8 w-full box-border overflow-x-hidden">
            {/* Intro Card */}
            <div className="relative flex flex-col justify-center rounded-2xl shadow-[0_8px_32px_rgba(37,99,235,0.15)] bg-gradient-to-br from-blue-600 to-blue-900 p-8 md:p-8 lg:p-10 xl:p-12 mb-4 md:mb-0 overflow-hidden col-span-1 md:col-span-2 lg:col-span-3">
              {/* Decorative circle */}
              <div 
                className="absolute top-0 right-0 w-48 h-48 rounded-full transform translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)'
                }}
              />
              
              <span className="text-white/90 font-semibold text-sm mb-2 uppercase tracking-wider bg-white/15 px-4 py-2 rounded-full w-fit backdrop-blur-sm">
                {t('bestsellers.subtitle')}
              </span>
              <h2 className="text-3xl md:text-2xl lg:text-3xl xl:text-4xl mb-4 text-white font-bold leading-tight" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
                {t('bestsellers.title')}
              </h2>
              <p className="text-white/90 text-base md:text-base lg:text-lg xl:text-lg leading-relaxed mb-6 max-w-[70%]">
                {t('bestsellers.description')}
              </p>
              <button
                onClick={handleShopMoreClick}
                className="bg-white/90 hover:bg-white text-blue-700 font-semibold px-8 py-4 rounded-full text-base uppercase tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-fit mt-2"
              >
                {t('bestsellers.shopMore')}
              </button>
            </div>

            {/* Product Cards */}
            {products.slice(0, 9).map((product) => (
              <div
                className="relative flex flex-col justify-between bg-white dark:bg-slate-800 p-6 md:p-5 lg:p-5 xl:p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 transition-all duration-300 h-full cursor-pointer hover:shadow-[0_8px_32px_rgba(37,99,235,0.15)] hover:-translate-y-1 hover:border-blue-400 col-span-1"
                key={product.id}
                onClick={() => handleProductClick(product)}
              >
                {product.discountPercentage > 0 && (
                  <span className="absolute top-4 left-4 z-10 bg-gradient-to-br from-blue-600 to-blue-400 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-[0_2px_8px_rgba(37,99,235,0.3)]">
                    {t('bestsellers.sale')}
                  </span>
                )}
                
                <div className="relative pt-[100%] lg:pt-[90%] xl:pt-[85%] mb-4 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="absolute top-0 left-0 w-full h-full object-contain p-4 transition-transform duration-300 hover:scale-105"
                  />
                </div>
                
                <div className="flex justify-between items-center text-xs text-slate-400 dark:text-slate-400 mb-2">
                  <span>{t('bestsellers.stockBrand')}</span>
                  <span className="font-semibold text-blue-500 uppercase tracking-wide text-sm">{product.brand || product.category}</span>
                </div>
                
                <h3 className="text-base lg:text-base xl:text-lg font-semibold text-slate-900 dark:text-white mb-2 leading-tight line-clamp-2 min-h-[2.8em]">
                  {product.title}
                </h3>
                
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="font-bold text-lg md:text-lg lg:text-xl text-blue-600 dark:text-blue-400">
                    {t('common.currency')}{product.price}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="text-base text-slate-400 line-through">
                      {t('common.currency')}{(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                    </span>
                  )}
                </div>
                
                <button
                  className={`flex items-center justify-center gap-2 px-3 py-1.5 md:px-2.5 md:py-1.5 lg:px-2.5 lg:py-1.5 xl:px-2.5 xl:py-1.5 text-xs md:text-xs font-medium md:font-medium lg:font-medium xl:font-medium rounded-xl w-full min-h-[32px] md:min-h-[32px] max-h-[32px] md:max-h-[32px] shadow-[0_2px_8px_rgba(37,99,235,0.2)] uppercase tracking-wide transition-all duration-300 mt-auto ${
                    isInCart(product.id) 
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white border-none' 
                      : 'bg-gradient-to-br from-blue-600 to-blue-400 hover:from-blue-900 hover:to-blue-600 text-white'
                  } hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(37,99,235,0.3)]`}
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  <svg viewBox="0 0 20 20" className="w-3.5 h-3.5 md:w-3.5 md:h-3.5 fill-white">
                    <path d="M7 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm7 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM7.333 14h7.334a2 2 0 0 0 1.98-1.735l1-7A2 2 0 0 0 15.667 3H4.333l-.2-1.2A1 1 0 0 0 3.15 1H1a1 1 0 0 0 0 2h1.18l1.6 9.6A2 2 0 0 0 5.667 14zm7.334-9a1 1 0 0 1 .995 1.1l-1 7a1 1 0 0 1-.995.9H7.333a1 1 0 0 1-.995-.9L5.34 5h9.327z"/>
                  </svg>
                  {isInCart(product.id) ? `${t('cart.inCart')} (${getItemQuantity(product.id)})` : t('cart.addToCart')}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default BestsellersSection;