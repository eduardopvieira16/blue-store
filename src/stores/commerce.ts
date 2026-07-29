import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { products } from '../domain/catalog';
import type { CartItem, Order } from '../domain/product';
const KEY = 'bluestore:commerce:v2';
interface Persisted {
    cart: CartItem[];
    favorites: string[];
    orders: Order[];
}
function read(): Persisted { try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) as Persisted : { cart: [], favorites: [], orders: [] };
}
catch {
    return { cart: [], favorites: [], orders: [] };
} }
export const useCommerceStore = defineStore('commerce', () => { const initial = read(); const cart = ref(initial.cart); const favorites = ref(initial.favorites); const orders = ref(initial.orders); watch([cart, favorites, orders], () => localStorage.setItem(KEY, JSON.stringify({ cart: cart.value, favorites: favorites.value, orders: orders.value })), { deep: true }); const detailedCart = computed(() => cart.value.flatMap(item => { const product = products.find(p => p.id === item.productId); return product ? [{ ...item, product, subtotalCents: product.priceCents * item.quantity }] : []; })); const cartCount = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0)); const cartTotal = computed(() => detailedCart.value.reduce((sum, item) => sum + item.subtotalCents, 0)); function add(productId: string, quantity = 1) { const product = products.find(p => p.id === productId); if (!product)
    return; const existing = cart.value.find(i => i.productId === productId); if (existing)
    existing.quantity = Math.min(product.stock, existing.quantity + quantity);
else
    cart.value.push({ productId, quantity: Math.min(product.stock, Math.max(1, quantity)) }); } function setQuantity(productId: string, quantity: number) { const product = products.find(p => p.id === productId); if (!product)
    return; if (quantity <= 0) {
    remove(productId);
    return;
} const item = cart.value.find(i => i.productId === productId); if (item)
    item.quantity = Math.min(product.stock, quantity); } function remove(productId: string) { cart.value = cart.value.filter(i => i.productId !== productId); } function toggleFavorite(productId: string) { favorites.value = favorites.value.includes(productId) ? favorites.value.filter(id => id !== productId) : [...favorites.value, productId]; } function createOrder(customer: Order['customer']): Order { const order: Order = { id: `BS-${Date.now().toString().slice(-8)}`, createdAt: new Date().toISOString(), totalCents: cartTotal.value, items: detailedCart.value.map(item => ({ productId: item.product.id, quantity: item.quantity, priceCents: item.product.priceCents })), customer, status: 'confirmado' }; orders.value = [order, ...orders.value]; cart.value = []; return order; } return { cart, favorites, orders, detailedCart, cartCount, cartTotal, add, setQuantity, remove, toggleFavorite, createOrder }; });
