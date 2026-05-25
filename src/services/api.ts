import type { Order, OrderDetailsResponse } from "@/types";

export const API_BASE = "http://localhost:3000";

export const normalizeMediaPath = (p?: string | null): string | null => {
  if (!p) return null;
  const clean = p.replace(/\\/g, "/").replace(/^\/+/, "");
  return `${API_BASE}/${clean}`;
};

async function http<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  listOrders: () => http<Order[]>("/orders"),
  getOrder: (id: number | string) => http<OrderDetailsResponse>(`/orders/${id}`),
};
