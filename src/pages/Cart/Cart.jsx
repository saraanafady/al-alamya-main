import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    getCartCount 
  } = useCart();

  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 0) {
      updateQuantity(productId, newQuantity);
      if (newQuantity === 0) {
        toast.success('Item removed from cart', {
          icon: '🗑️',
        });
      }
    }
  };

  const handleRemoveItem = (productId, productName) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`, {
      icon: '🗑️',
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared successfully', {
      icon: '🧹',
    });
  };

  const handlePromoCode = () => {
    // Simple promo code logic - you can expand this
    const validCodes = {
      'SAVE10': 0.1,
      'WELCOME20': 0.2,
      'STUDENT15': 0.15
    };

    if (validCodes[promoCode.toUpperCase()]) {
      setDiscount(validCodes[promoCode.toUpperCase()]);
      toast.success(`Promo code applied! ${(validCodes[promoCode.toUpperCase()] * 100).toFixed(0)}% discount`, {
        icon: '🎉',
      });
    } else {
      toast.error('Invalid promo code', {
        icon: '❌',
      });
      setDiscount(0);
    }
  };

  const subtotal = getCartTotal();
  const discountAmount = subtotal * discount;
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = (subtotal - discountAmount) * 0.08; // 8% tax
  const total = subtotal - discountAmount + shipping + tax;

  const handleCheckout = () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    setTimeout(() => {
      toast.success('Order placed successfully! 🎉', {
        duration: 4000,
        style: {
          background: '#10b981',
          color: '#ffffff',
        },
      });
      clearCart();
      setIsCheckingOut(false);
      navigate('/');
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center py-20">
            <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8">
              <svg className="w-12 h-12 text-slate-400 dark:text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Your cart is empty</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-md">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button 
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Shopping Cart</h1>
          <p className="text-slate-600 dark:text-slate-400">
            {getCartCount()} {getCartCount() === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-6 bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                <div className="col-span-6 font-semibold text-slate-700 dark:text-slate-300">Product</div>
                <div className="col-span-2 font-semibold text-slate-700 dark:text-slate-300 text-center">Price</div>
                <div className="col-span-2 font-semibold text-slate-700 dark:text-slate-300 text-center">Quantity</div>
                <div className="col-span-2 font-semibold text-slate-700 dark:text-slate-300 text-right">Total</div>
              </div>

              {/* Items */}
              {items.map((item) => {
                const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
                const itemTotal = price * item.quantity;

                return (
                  <div key={item.id} className="p-6 border-b border-slate-200 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                    <div className="flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center">
                      {/* Product Info */}
                      <div className="col-span-6 flex items-center gap-4 mb-4 md:mb-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-20 h-20 object-cover rounded-xl border border-slate-200 dark:border-slate-600" 
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-1">{item.name}</h3>
                          <p className="text-slate-600 dark:text-slate-400 text-sm mb-1 capitalize">{item.category}</p>
                          {item.color && (
                            <span className="inline-block bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs px-2 py-1 rounded-md">
                              Color: {item.color}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-2 text-center mb-4 md:mb-0">
                        <span className="text-lg font-semibold text-slate-900 dark:text-white">
                          ${price.toFixed(2)}
                        </span>
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2 flex justify-center mb-4 md:mb-0">
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                          <button 
                            className="w-8 h-8 rounded-md bg-white dark:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-semibold text-slate-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button 
                            className="w-8 h-8 rounded-md bg-white dark:bg-slate-600 text-slate-700 dark:text-slate-300 font-bold hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center justify-center"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="col-span-2 flex justify-between items-center md:justify-end">
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                          ${itemTotal.toFixed(2)}
                        </span>
                        <button 
                          className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center"
                          onClick={() => handleRemoveItem(item.id, item.name)}
                          title="Remove item"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Actions */}
              <div className="p-6 bg-slate-50 dark:bg-slate-700 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <button 
                  className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </button>
                <button 
                  className="px-6 py-3 text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  onClick={() => navigate('/')}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 sticky top-8">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Order Summary</h3>
              
              {/* Promo Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button 
                    onClick={handlePromoCode}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal ({getCartCount()} items)</span>
                  <span className="font-semibold text-slate-900 dark:text-white">${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount ({(discount * 100).toFixed(0)}%)</span>
                    <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Tax</span>
                  <span className="font-semibold text-slate-900 dark:text-white">${tax.toFixed(2)}</span>
                </div>
                
                <div className="border-t border-slate-200 dark:border-slate-600 pt-4">
                  <div className="flex justify-between text-xl font-bold text-slate-900 dark:text-white">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button 
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  isCheckingOut 
                    ? 'bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                }`}
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>

              {/* Secure Checkout */}
              <div className="flex items-center justify-center gap-2 mt-6 text-slate-500 dark:text-slate-400 text-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <circle cx="12" cy="16" r="1"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>Secure checkout guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 