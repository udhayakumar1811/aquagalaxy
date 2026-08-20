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

  // 1. Add to Cart — capped at the product's available stock (item.qnt) so
  // customers can't add more than what's actually in stock. Returns a
  // result object so callers can show a message if the request was
  // capped/rejected.
  const addToCart = (product, requestedQty = 1) => {
    const stock = typeof product.qnt === "number" ? product.qnt : Infinity;

    if (stock <= 0) {
      return { success: false, message: "This product is out of stock." };
    }

    let result = { success: true, message: "Added to cart." };

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item._id === product._id);

      if (existingIndex > -1) {
        const updatedCart = [...prevCart];
        const currentQty = updatedCart[existingIndex].quantity;
        const newQty = Math.min(currentQty + requestedQty, stock);

        if (newQty === currentQty) {
          result = { success: false, message: `Only ${stock} in stock — you already have the max in your cart.` };
          return prevCart;
        }
        if (newQty < currentQty + requestedQty) {
          result = { success: true, message: `Only ${stock} in stock — cart updated to the maximum available.` };
        }

        updatedCart[existingIndex] = { ...updatedCart[existingIndex], quantity: newQty };
        return updatedCart;
      } else {
        const newQty = Math.min(requestedQty, stock);
        if (newQty < requestedQty) {
          result = { success: true, message: `Only ${stock} in stock — added ${newQty}.` };
        }
        return [...prevCart, { ...product, quantity: newQty }];
      }
    });

    return result;
  };

  // 2. Remove Item from Cart
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  // 3. Update Item Quantity (+ / -), capped at available stock (item.qnt)
  const updateQuantity = (id, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item._id === id) {
            const stock = typeof item.qnt === "number" ? item.qnt : Infinity;
            const newQty = Math.min(item.quantity + amount, stock);
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