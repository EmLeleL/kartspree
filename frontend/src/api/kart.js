// api/kart.js
export async function getKart(token) {
  const res = await fetch("http://localhost:5000/api/kart", {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

// Add new item to kart
export async function addToKart(itemId, quantity, token) {
  const res = await fetch("http://localhost:5000/api/kart", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ itemId, quantity }),
  });
  return res.json();
}

// Remove item from kart
export async function removeFromKart(itemId, token) {
  await fetch(`http://localhost:5000/api/kart/${itemId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Update item quantity in kart
export async function updateKartItem(itemId, quantity, token) {
  const res = await fetch(`http://localhost:5000/api/kart/${itemId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quantity }),
  });

   if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to update cart item");
  }

  return res.json();
}
