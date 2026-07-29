import { createRouter, createWebHashHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

export default createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth', top: 24 };
    }

    return { top: 0 };
  },
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/produto/:slug', name: 'product', component: () => import('../views/ProductView.vue') },
    { path: '/carrinho', name: 'cart', component: () => import('../views/CartView.vue') },
    { path: '/checkout', name: 'checkout', component: () => import('../views/CheckoutView.vue') },
    { path: '/pedidos', name: 'orders', component: () => import('../views/OrdersView.vue') },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
  ],
});
