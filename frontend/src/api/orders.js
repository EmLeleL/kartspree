// Checkout cart -> creates new order
export async function checkout(items, total, token) {
  const res = await fetch("http://localhost:5000/api/orders/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ items, total }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Checkout failed");
  }

  return res.json();
}

// Get all orders for logged-in user
export async function getOrders(token) {
  const res = await fetch("http://localhost:5000/api/orders", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
