<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { useCommerceStore } from '../stores/commerce';

const commerce = useCommerceStore();
const route = useRoute();
const open = ref(false);

const catalogSelected = computed(
  () => (route.path === '/' && route.hash === '#catalogo') || route.name === 'product',
);

watch(
  () => route.fullPath,
  () => {
    open.value = false;
  },
);
</script>

<template>
  <header class="mobile-header">
    <RouterLink to="/" class="mobile-brand" aria-label="BlueStore, página inicial">
      <span>B</span>
      <strong>BlueStore</strong>
    </RouterLink>

    <div class="mobile-actions">
      <RouterLink to="/carrinho" class="mobile-cart" aria-label="Abrir carrinho">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 7h13l-1.3 8.2a2 2 0 0 1-2 1.7H9a2 2 0 0 1-2-1.6L5.2 4H3" />
          <circle cx="9" cy="20" r="1" />
          <circle cx="17" cy="20" r="1" />
        </svg>
        <b v-if="commerce.cartCount">{{ commerce.cartCount }}</b>
      </RouterLink>

      <button
        type="button"
        class="menu-button"
        :aria-expanded="open"
        :aria-label="open ? 'Fechar menu' : 'Abrir menu'"
        @click="open = !open"
      >
        <span />
        <span />
        <span />
      </button>
    </div>
  </header>

  <aside :class="['sidebar', { open }]">
    <div class="brand">
      <RouterLink to="/" aria-label="BlueStore, página inicial">
        <span class="brand-mark">B</span>
        <span class="brand-text">
          <strong>BlueStore</strong>
          <small>Tecnologia para o dia a dia</small>
        </span>
      </RouterLink>
    </div>

    <nav aria-label="Navegação principal">
      <RouterLink to="/" :class="{ selected: route.path === '/' && !route.hash }">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 10.5 12 4l8 6.5V20H4v-9.5Z" />
          <path d="M9 20v-6h6v6" />
        </svg>
        <span>Início</span>
      </RouterLink>

      <RouterLink :to="{ path: '/', hash: '#catalogo' }" :class="{ selected: catalogSelected }">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 5h16v14H4z" />
          <path d="M4 10h16M9 10v9" />
        </svg>
        <span>Produtos</span>
      </RouterLink>

      <RouterLink to="/carrinho" :class="{ selected: route.name === 'cart' || route.name === 'checkout' }">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 7h13l-1.3 8.2a2 2 0 0 1-2 1.7H9a2 2 0 0 1-2-1.6L5.2 4H3" />
          <circle cx="9" cy="20" r="1" />
          <circle cx="17" cy="20" r="1" />
        </svg>
        <span>Carrinho</span>
        <b v-if="commerce.cartCount">{{ commerce.cartCount }}</b>
      </RouterLink>

      <RouterLink to="/pedidos" :class="{ selected: route.name === 'orders' }">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 4h12v16H6z" />
          <path d="M9 8h6M9 12h6M9 16h4" />
        </svg>
        <span>Pedidos</span>
      </RouterLink>
    </nav>

    <div class="sidebar-note">
      <strong>Atendimento</strong>
      <p>Segunda a sexta, das 9h às 18h.</p>
      <a href="mailto:atendimento@bluestore.local">atendimento@bluestore.local</a>
    </div>

    <footer>
      <span>BlueStore</span>
      <small>Projeto demonstrativo</small>
    </footer>
  </aside>

  <button v-if="open" class="overlay" type="button" aria-label="Fechar menu" @click="open = false" />
</template>

<style lang="scss" scoped>
.sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 100;
  width: 220px;
  display: flex;
  flex-direction: column;
  padding: 28px 20px 20px;
  overflow-y: auto;
  background: var(--navy);
  color: #fff;
}

.brand {
  padding: 0 4px 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.brand a,
.mobile-brand {
  display: flex;
  align-items: center;
  gap: 11px;
  color: inherit;
  text-decoration: none;
}

.brand-mark,
.mobile-brand > span {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 2px;
  color: #fff;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.1rem;
  font-weight: 700;
}

.brand-text strong {
  display: block;
  font-size: 1rem;
  letter-spacing: -0.02em;
}

.brand-text small {
  display: block;
  margin-top: 3px;
  color: #aeb9c8;
  font-size: 0.64rem;
  line-height: 1.3;
}

nav {
  display: grid;
  margin-top: 24px;
}

nav a {
  min-height: 46px;
  display: grid;
  grid-template-columns: 22px 1fr auto;
  align-items: center;
  gap: 11px;
  padding: 0 9px;
  border-left: 3px solid transparent;
  color: #bfc9d5;
  text-decoration: none;
  font-size: 0.82rem;
}

nav a + a {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

nav a:hover,
nav a:focus-visible {
  color: #fff;
  background: rgba(255, 255, 255, 0.04);
}

nav a.selected {
  border-left-color: #8fa9e8;
  background: var(--navy-soft);
  color: #fff;
}

nav svg {
  width: 19px;
  height: 19px;
  stroke: currentColor;
  stroke-width: 1.6;
}

nav b {
  min-width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  padding: 0 5px;
  border-radius: 50%;
  background: #fff;
  color: var(--navy);
  font-size: 0.66rem;
}

.sidebar-note {
  margin-top: auto;
  padding: 20px 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}

.sidebar-note strong {
  display: block;
  font-size: 0.76rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.sidebar-note p {
  margin: 8px 0 5px;
  color: #aeb9c8;
  font-size: 0.7rem;
  line-height: 1.5;
}

.sidebar-note a {
  color: #d8e0ea;
  font-size: 0.68rem;
  word-break: break-word;
}

.sidebar footer {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 18px 4px 0;
  color: #8f9cac;
  font-size: 0.62rem;
}

.mobile-header,
.overlay {
  display: none;
}

@media (max-width: 980px) {
  .mobile-header {
    position: fixed;
    inset: 0 0 auto;
    z-index: 120;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 16px;
    background: var(--navy);
    color: #fff;
    border-bottom: 1px solid rgba(255, 255, 255, 0.14);
  }

  .mobile-brand > span {
    width: 30px;
    height: 30px;
  }

  .mobile-brand strong {
    font-size: 0.92rem;
  }

  .mobile-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mobile-cart {
    position: relative;
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    color: #fff;
    text-decoration: none;
  }

  .mobile-cart svg {
    width: 21px;
    height: 21px;
    stroke: currentColor;
    stroke-width: 1.7;
  }

  .mobile-cart b {
    position: absolute;
    top: 1px;
    right: 0;
    min-width: 17px;
    height: 17px;
    display: grid;
    place-items: center;
    padding: 0 4px;
    border-radius: 50%;
    background: #fff;
    color: var(--navy);
    font-size: 0.58rem;
  }

  .menu-button {
    width: 40px;
    height: 40px;
    display: grid;
    align-content: center;
    gap: 5px;
    padding: 0 10px;
    border: 0;
    background: transparent;
  }

  .menu-button span {
    display: block;
    height: 1px;
    background: #fff;
  }

  .sidebar {
    width: min(280px, 86vw);
    transform: translateX(-101%);
    transition: transform 180ms ease;
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .overlay {
    position: fixed;
    inset: 0;
    z-index: 90;
    display: block;
    border: 0;
    background: rgba(7, 13, 22, 0.56);
  }
}
</style>
