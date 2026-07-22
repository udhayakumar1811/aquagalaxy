import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // LocalStorage-la irundhu saved cart items load panrom
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("aquagalaxy_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Cart update aagumbodhu LocalStorage-la auto save panrom
  useEffect(() => {
    localStorage.setItem("aquagalaxy_cart", JSON.stringify(cart));
  }, [cart]);

  // 1. Add to Cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item._id === product._id);

      if (existingIndex > -1) {
        // Already irundha quantity-a +1 panrom
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += 1;
        return updatedCart;
      } else {
        // Pudhu product na quantity=1 pottu add panrom
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // 2. Remove Item from Cart
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  // 3. Update Item Quantity (+ / -)
  const updateQuantity = (id, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item._id === id) {
            const newQty = item.quantity + amount;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // 4. Clear Full Cart
  const clearCart = () => {
    setCart([]);
  };

  // 5. Total Price & Total Items Calculation
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};