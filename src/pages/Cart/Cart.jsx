import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import './Cart.css';

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
      <div className="cart-page">
        <div className="cart-container">
          <div className="empty-cart">
            <div className="empty-cart-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any items to your cart yet.</p>
            <button 
              className="continue-shopping-btn"
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
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
        </div>

        <div className="cart-content">
          <div className="cart-items">
            <div className="cart-items-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span></span>
            </div>

            {items.map((item) => {
              const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
              const itemTotal = price * item.quantity;

              return (
                <div key={item.id} className="cart-item">
                  <div className="item-info">
                    <img src={item.image} alt={item.name} className="item-image" />
                    <div className="item-details">
                      <h3>{item.name}</h3>
                      <p>{item.category}</p>
                      {item.color && <span className="item-color">Color: {item.color}</span>}
                    </div>
                  </div>

                  <div className="item-price">
                    ${price.toFixed(2)}
                  </div>

                  <div className="item-quantity">
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-total">
                    ${itemTotal.toFixed(2)}
                  </div>

                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.id, item.name)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="3,6 5,6 21,6"/>
                      <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
                    </svg>
                  </button>
                </div>
              );
            })}

            <div className="cart-actions">
              <button className="clear-cart-btn" onClick={handleClearCart}>
                Clear Cart
              </button>
              <button 
                className="continue-shopping"
                onClick={() => navigate('/')}
              >
                Continue Shopping
              </button>
            </div>
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="promo-code">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button onClick={handlePromoCode}>Apply</button>
              </div>

              <div className="order-details">
                <div className="detail-row">
                  <span>Subtotal ({getCartCount()} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="detail-row discount">
                    <span>Discount ({(discount * 100).toFixed(0)}%)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="detail-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                </div>
                
                <div className="detail-row">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                
                <div className="detail-row total">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button 
                className="checkout-btn"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <div className="checkout-loading">
                    <div className="spinner"></div>
                    Processing...
                  </div>
                ) : (
                  'Proceed to Checkout'
                )}
              </button>

              <div className="secure-checkout">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
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