import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("cart");
    setCart(raw ? JSON.parse(raw) : []);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCart((c) => c.map(item => item.id === id ? { ...item, qty } : item));
  };

  const removeItem = (id) => {
    setCart((c) => c.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((s, item) => s + item.price * item.qty, 0);

  if (cart.length === 0) {
    return (
      <main>
        <h1>Корзина</h1>
        <p>Ваша корзина пуста.</p>
      </main>
    );
  }

  return (
    <main>
      <h1>Корзина</h1>
      <ul>
        {cart.map(item => (
          <li key={item.id} style={{ marginBottom: 16 }}>
            <div>
              <strong>{item.name}</strong>
            </div>
            <div>Цена: {item.price.toFixed(2)}</div>
            <div>
              Количество:
              <button onClick={() => updateQty(item.id, item.qty - 1)}>-</button>
              <span style={{ margin: "0 8px" }}>{item.qty}</span>
              <button onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
            </div>
            <div>Сумма: {(item.price * item.qty).toFixed(2)}</div>
            <button onClick={() => removeItem(item.id)}>Удалить</button>
          </li>
        ))}
      </ul>

      <div>
        <strong>Итого: {subtotal.toFixed(2)}</strong>
      </div>

      <div style={{ marginTop: 16 }}>
        <button onClick={clearCart}>Очистить корзину</button>
        <button onClick={() => navigate("/checkout")} style={{ marginLeft: 8 }}>
          Оформить заказ
        </button>
      </div>
    </main>
  );
}
