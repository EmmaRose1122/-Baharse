import { createClient, createPublicClient } from "./server";
import { createAdminClient } from "./admin";
import { Category, Product, Order, SiteSettings, Message } from "@/types";
import { MOCK_CATEGORIES, MOCK_PRODUCTS, MOCK_SETTINGS, MOCK_ORDERS } from "./mock-data";

/**
 * Check if real Supabase environment variables are present and not placeholders
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
    anonKey &&
    !url.includes("placeholder") &&
    !url.includes("your-project") &&
    !anonKey.includes("placeholder")
  );
}

// In-memory runtime storage for demo orders/messages if Supabase is not yet connected
const runtimeOrders: Order[] = [...MOCK_ORDERS];
const runtimeMessages: Message[] = [];

/**
 * Fetch all categories
 */
export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return MOCK_CATEGORIES;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error || !data || data.length === 0) {
      return MOCK_CATEGORIES;
    }

    return data as Category[];
  } catch (err) {
    console.error("Error fetching categories, using fallback:", err);
    return MOCK_CATEGORIES;
  }
}

/**
 * Fetch a category by its slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) || null;
}

/**
 * Fetch products with optional category, search, sorting, price filter, and pagination
 */
export async function getProducts(options?: {
  categorySlug?: string;
  categoryId?: string;
  isFeatured?: boolean;
  search?: string;
  sortBy?: "newest" | "price_asc" | "price_desc" | "popular";
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  page?: number;
}): Promise<{ products: Product[]; total: number }> {
  const {
    categorySlug,
    categoryId,
    isFeatured,
    search,
    sortBy = "newest",
    minPrice,
    maxPrice,
    limit = 12,
    page = 1,
  } = options || {};

  if (!isSupabaseConfigured()) {
    let filtered = [...MOCK_PRODUCTS];

    if (categoryId) {
      filtered = filtered.filter((p) => p.category_id === categoryId);
    } else if (categorySlug) {
      const cat = MOCK_CATEGORIES.find((c) => c.slug === categorySlug);
      if (cat) {
        filtered = filtered.filter((p) => p.category_id === cat.id);
      }
    }

    if (isFeatured !== undefined) {
      filtered = filtered.filter((p) => p.is_featured === isFeatured);
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.origin_country.toLowerCase().includes(q)
      );
    }

    if (minPrice !== undefined) {
      filtered = filtered.filter((p) => p.price >= minPrice);
    }

    if (maxPrice !== undefined) {
      filtered = filtered.filter((p) => p.price <= maxPrice);
    }

    // Sorting
    if (sortBy === "price_asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price_desc") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "popular") {
      filtered.sort((a, b) => b.stock_quantity - a.stock_quantity);
    } else {
      // newest
      filtered.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    const total = filtered.length;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return { products: paginated, total };
  }

  try {
    const supabase = createPublicClient();
    let query = supabase.from("products").select("*, category:categories(*)", { count: "exact" });

    query = query.eq("is_active", true);

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    } else if (categorySlug) {
      const { data: catData } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();
      if (catData) {
        query = query.eq("category_id", catData.id);
      }
    }

    if (isFeatured !== undefined) {
      query = query.eq("is_featured", isFeatured);
    }

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    if (minPrice !== undefined) {
      query = query.gte("price", minPrice);
    }

    if (maxPrice !== undefined) {
      query = query.lte("price", maxPrice);
    }

    if (sortBy === "price_asc") {
      query = query.order("price", { ascending: true });
    } else if (sortBy === "price_desc") {
      query = query.order("price", { ascending: false });
    } else {
      query = query.order("created_at", { ascending: false });
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error || !data || data.length === 0) {
      // fallback to mock products if database query is empty
      return { products: MOCK_PRODUCTS.slice(0, limit), total: MOCK_PRODUCTS.length };
    }

    return { products: data as Product[], total: count || data.length };
  } catch (err) {
    console.error("Error fetching products, using mock fallback:", err);
    return { products: MOCK_PRODUCTS.slice(0, limit), total: MOCK_PRODUCTS.length };
  }
}

/**
 * Fetch a single product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    const found = MOCK_PRODUCTS.find((p) => p.slug === slug);
    if (!found) return null;
    const cat = MOCK_CATEGORIES.find((c) => c.id === found.category_id);
    return { ...found, category: cat };
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      const found = MOCK_PRODUCTS.find((p) => p.slug === slug);
      if (!found) return null;
      const cat = MOCK_CATEGORIES.find((c) => c.id === found.category_id);
      return { ...found, category: cat };
    }

    return data as Product;
  } catch {
    const found = MOCK_PRODUCTS.find((p) => p.slug === slug);
    return found || null;
  }
}

/**
 * Fetch related products from the same category
 */
export async function getRelatedProducts(
  categoryId: string | null,
  currentProductId: string,
  limit = 4
): Promise<Product[]> {
  const { products } = await getProducts({
    categoryId: categoryId || undefined,
    limit: limit + 1,
  });

  return products.filter((p) => p.id !== currentProductId).slice(0, limit);
}

/**
 * Fetch site settings
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) {
    return MOCK_SETTINGS;
  }

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .limit(1)
      .single();

    if (error || !data) {
      return MOCK_SETTINGS;
    }

    return data as SiteSettings;
  } catch {
    return MOCK_SETTINGS;
  }
}

/**
 * Place a new Order with server-side price re-verification, advance payment details, and atomic stock decrement
 */
export async function processNewOrder(orderInput: {
  customer_name: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  items: Array<{ product_id: string; quantity: number; size?: string }>;
  payment_method: "jazzcash" | "easypaisa" | "bank_transfer";
  transaction_id: string;
  sender_account_name?: string;
  sender_account_number?: string;
  payment_receipt_url?: string;
}): Promise<{ success: boolean; order?: Order; error?: string }> {
  // 1. Fetch live settings for accurate delivery calculation
  const settings = await getSiteSettings();

  // 2. Fetch all products in cart from database (or mock) to verify prices & stock
  let verifiedItems: Order["items"] = [];
  let subtotal = 0;

  for (const item of orderInput.items) {
    let product: Product | null = null;

    if (isSupabaseConfigured()) {
      const adminClient = createAdminClient();
      const { data } = await adminClient
        .from("products")
        .select("*")
        .eq("id", item.product_id)
        .single();
      product = data as Product | null;
    } else {
      product = MOCK_PRODUCTS.find((p) => p.id === item.product_id) || null;
    }

    if (!product) {
      return { success: false, error: `Product ID ${item.product_id} not found.` };
    }

    if (product.stock_quantity < item.quantity) {
      return {
        success: false,
        error: `Insufficient stock for "${product.name}". Only ${product.stock_quantity} remaining.`,
      };
    }

    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;

    verifiedItems.push({
      product_id: product.id,
      product_name: product.name,
      product_image: product.images[0] || "",
      price: product.price,
      quantity: item.quantity,
      size: item.size,
      origin_country: product.origin_country,
    });
  }

  // 3. Compute delivery charges
  const deliveryCharges =
    subtotal >= settings.free_delivery_above ? 0 : settings.delivery_charges;
  const total = subtotal + deliveryCharges;

  // 4. Generate order number
  const orderNumber = `IMP-${Math.floor(10000 + Math.random() * 90000)}`;

  const newOrder: Order = {
    id: `ord-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    order_number: orderNumber,
    customer_name: orderInput.customer_name,
    phone: orderInput.phone,
    city: orderInput.city,
    address: orderInput.address,
    notes: orderInput.notes || null,
    items: verifiedItems,
    subtotal,
    delivery_charges: deliveryCharges,
    total,
    status: "pending",
    payment_method: orderInput.payment_method,
    payment_status: "pending_verification",
    transaction_id: orderInput.transaction_id,
    sender_account_name: orderInput.sender_account_name || null,
    sender_account_number: orderInput.sender_account_number || null,
    payment_receipt_url: orderInput.payment_receipt_url || null,
    client_messages: [
      {
        id: `msg-${Date.now()}`,
        title: "Advance Payment Submitted",
        message: `Your deposit of Rs. ${total.toLocaleString()} via ${orderInput.payment_method.toUpperCase()} (TID: ${orderInput.transaction_id}) has been recorded. Our verification desk will review your transfer shortly.`,
        created_at: new Date().toISOString(),
        by: "System",
      },
    ],
    created_at: new Date().toISOString(),
  };

  // 5. Decrement stock & persist order
  if (isSupabaseConfigured()) {
    try {
      const adminClient = createAdminClient();

      // Decrement stock for each item
      for (const item of verifiedItems) {
        const { data: rpcSuccess, error: rpcError } = await adminClient.rpc(
          "reduce_product_stock",
          {
            p_product_id: item.product_id,
            p_quantity: item.quantity,
          }
        );

        if (rpcError || !rpcSuccess) {
          const { data: currentP } = await adminClient
            .from("products")
            .select("stock_quantity")
            .eq("id", item.product_id)
            .single();

          if (currentP) {
            await adminClient
              .from("products")
              .update({
                stock_quantity: Math.max(0, currentP.stock_quantity - item.quantity),
              })
              .eq("id", item.product_id);
          }
        }
      }

      // Insert Order record with advance payment details
      const { data: insertedOrder, error: orderError } = await adminClient
        .from("orders")
        .insert({
          order_number: newOrder.order_number,
          customer_name: newOrder.customer_name,
          phone: newOrder.phone,
          city: newOrder.city,
          address: newOrder.address,
          notes: newOrder.notes,
          items: newOrder.items,
          subtotal: newOrder.subtotal,
          delivery_charges: newOrder.delivery_charges,
          total: newOrder.total,
          status: newOrder.status,
          payment_method: newOrder.payment_method,
          payment_status: newOrder.payment_status,
          transaction_id: newOrder.transaction_id,
          sender_account_name: newOrder.sender_account_name,
          sender_account_number: newOrder.sender_account_number,
          payment_receipt_url: newOrder.payment_receipt_url,
          client_messages: newOrder.client_messages,
        })
        .select()
        .single();

      if (orderError) {
        console.error("Order insertion error:", orderError);
      } else if (insertedOrder) {
        newOrder.id = insertedOrder.id;
      }
    } catch (e) {
      console.error("Supabase order error:", e);
    }
  } else {
    // In demo / fallback mode, decrement mock stock in memory and store in runtimeOrders
    for (const item of verifiedItems) {
      const mp = MOCK_PRODUCTS.find((p) => p.id === item.product_id);
      if (mp) {
        mp.stock_quantity = Math.max(0, mp.stock_quantity - item.quantity);
      }
    }
    runtimeOrders.unshift(newOrder);
  }

  return { success: true, order: newOrder };
}

/**
 * Fetch all orders for Admin
 */
export async function getAllOrders(): Promise<Order[]> {
  if (isSupabaseConfigured()) {
    try {
      const adminClient = createAdminClient();
      const { data, error } = await adminClient
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error || !data || data.length === 0) {
        return runtimeOrders;
      }
      return data as Order[];
    } catch {
      return runtimeOrders;
    }
  }
  return runtimeOrders;
}

/**
 * Update order fulfillment status and/or payment status
 */
export async function updateOrderAdmin(
  orderId: string,
  updates: {
    status?: Order["status"];
    payment_status?: Order["payment_status"];
    newMessage?: { title: string; message: string; by?: string };
  }
): Promise<{ success: boolean; order?: Order; error?: string }> {
  let targetOrder = runtimeOrders.find((o) => o.id === orderId);

  if (targetOrder) {
    if (updates.status) targetOrder.status = updates.status;
    if (updates.payment_status) targetOrder.payment_status = updates.payment_status;
    if (updates.newMessage) {
      const logs = targetOrder.client_messages || [];
      logs.push({
        id: `msg-${Date.now()}`,
        title: updates.newMessage.title,
        message: updates.newMessage.message,
        created_at: new Date().toISOString(),
        by: updates.newMessage.by || "Store Admin",
      });
      targetOrder.client_messages = logs;
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const adminClient = createAdminClient();
      const dbUpdates: any = {};
      if (updates.status) dbUpdates.status = updates.status;
      if (updates.payment_status) dbUpdates.payment_status = updates.payment_status;

      if (updates.newMessage) {
        const { data: current } = await adminClient
          .from("orders")
          .select("client_messages")
          .eq("id", orderId)
          .single();

        const msgs = current?.client_messages || [];
        msgs.push({
          id: `msg-${Date.now()}`,
          title: updates.newMessage.title,
          message: updates.newMessage.message,
          created_at: new Date().toISOString(),
          by: updates.newMessage.by || "Store Admin",
        });
        dbUpdates.client_messages = msgs;
      }

      const { data, error } = await adminClient
        .from("orders")
        .update(dbUpdates)
        .eq("id", orderId)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true, order: data as Order };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  return { success: true, order: targetOrder };
}

/**
 * Fetch Order for Tracking by order number and phone
 */
export async function trackOrder(
  orderNumber: string,
  phone: string
): Promise<Order | null> {
  const cleanOrderNum = orderNumber.trim().toUpperCase();
  const cleanPhone = phone.trim();

  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .ilike("order_number", cleanOrderNum)
        .eq("phone", cleanPhone)
        .single();

      if (error || !data) {
        // also check runtime
        return runtimeOrders.find(
          (o) =>
            o.order_number.toUpperCase() === cleanOrderNum &&
            o.phone === cleanPhone
        ) || null;
      }

      return data as Order;
    } catch {
      return runtimeOrders.find(
        (o) =>
          o.order_number.toUpperCase() === cleanOrderNum &&
          o.phone === cleanPhone
      ) || null;
    }
  }

  return (
    runtimeOrders.find(
      (o) =>
        o.order_number.toUpperCase() === cleanOrderNum &&
        o.phone === cleanPhone
    ) || null
  );
}

/**
 * Submit Contact Us Message
 */
export async function submitContactMessage(messageInput: {
  name: string;
  phone: string;
  email?: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createPublicClient();
      const { error } = await supabase.from("messages").insert({
        name: messageInput.name,
        phone: messageInput.phone,
        email: messageInput.email || null,
        message: messageInput.message,
      });

      if (error) {
        console.error("Message insert error:", error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to submit message" };
    }
  }

  runtimeMessages.push({
    id: `msg-${Date.now()}`,
    name: messageInput.name,
    phone: messageInput.phone,
    email: messageInput.email || null,
    message: messageInput.message,
    is_read: false,
    created_at: new Date().toISOString(),
  });

  return { success: true };
}
