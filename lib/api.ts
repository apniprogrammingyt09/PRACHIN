const API_BASE = "/api"

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE}${endpoint}`
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }))
      throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
  }

  // Products API
  products = {
    getAll: (params?: { category?: string; search?: string; featured?: boolean }) => {
      const searchParams = new URLSearchParams()
      if (params?.category) searchParams.set("category", params.category)
      if (params?.search) searchParams.set("search", params.search)
      if (params?.featured) searchParams.set("featured", "true")

      const query = searchParams.toString()
      return this.request<any[]>(`/products${query ? `?${query}` : ""}`)
    },

    getById: (id: string) => this.request<any>(`/products/${id}`),

    create: (data: any) =>
      this.request<any>("/products", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id: string, data: any) =>
      this.request<any>(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      this.request<any>(`/products/${id}`, {
        method: "DELETE",
      }),
  }

  // Orders API
  orders = {
    getAll: (params?: { status?: string; customer?: string }) => {
      const searchParams = new URLSearchParams()
      if (params?.status) searchParams.set("status", params.status)
      if (params?.customer) searchParams.set("customer", params.customer)

      const query = searchParams.toString()
      return this.request<any[]>(`/orders${query ? `?${query}` : ""}`)
    },

    getById: (id: string) => this.request<any>(`/orders/${id}`),

    create: (data: any) =>
      this.request<any>("/orders", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    updateStatus: (id: string, status: string) =>
      this.request<any>(`/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),

    updatePaymentStatus: (id: string, paymentStatus: string) =>
      this.request<any>(`/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ paymentStatus }),
      }),

    bulkUpdateStatus: (orderIds: string[], status: string) =>
      this.request<any>("/orders/bulk", {
        method: "PATCH",
        body: JSON.stringify({ orderIds, status }),
      }),

    bulkUpdatePaymentStatus: (orderIds: string[], paymentStatus: string) =>
      this.request<any>("/orders/bulk", {
        method: "PATCH",
        body: JSON.stringify({ orderIds, paymentStatus }),
      }),
  }

  // Payment API
  payment = {
    getConfig: () =>
      this.request<{
        key: string
        currency: string
        name: string
        description: string
        theme: { color: string }
      }>("/payment/config"),

    createOrder: (amount: number, receipt: string) =>
      this.request<{
        id: string
        amount: number
        currency: string
        receipt: string
      }>("/payment/create-order", {
        method: "POST",
        body: JSON.stringify({ amount, receipt }),
      }),

    verifyPayment: (data: {
      razorpay_order_id: string
      razorpay_payment_id: string
      razorpay_signature: string
      order_id: string
    }) =>
      this.request<{
        success: boolean
        order: any
      }>("/payment/verify", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    getPaymentStatus: (orderId: string) =>
      this.request<{
        orderNumber: string
        paymentStatus: string
        paymentMethod: string
        total: number
        razorpayPayment: any
        orderStatus: string
        createdAt: string
        updatedAt: string
      }>(`/payment/status/${orderId}`),

    retryPayment: (orderId: string) =>
      this.request<{
        razorpayOrderId: string
        amount: number
        currency: string
        orderNumber: string
      }>("/payment/retry", {
        method: "POST",
        body: JSON.stringify({ orderId }),
      }),
  }

  // Customers API
  customers = {
    getAll: () => this.request<any[]>("/customers"),
    getById: (id: string) => this.request<any>(`/customers/${id}`),
  }

  // Dashboard API
  dashboard = {
    getStats: () => this.request<any>("/dashboard/stats"),
  }
}

export const api = new ApiClient()
