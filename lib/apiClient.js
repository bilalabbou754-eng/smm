const API_URL = process.env.SMM_API_URL;
const API_KEY = process.env.SMM_API_KEY;

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`
  };
}

async function request(path, options = {}) {
  if (!API_URL || !API_KEY) {
    throw new Error("SMM API credentials are not configured.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "SMM provider request failed.");
  }

  return response.json();
}

export async function fetchServices() {
  return request("/services");
}

export async function createProviderOrder(payload) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export async function fetchProviderOrderStatus(orderId) {
  return request(`/orders/${orderId}`);
}

export async function fetchProviderBalance() {
  return request("/balance");
}
