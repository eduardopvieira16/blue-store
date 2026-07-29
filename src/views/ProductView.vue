<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ProductCard from '../components/ProductCard.vue';
import { productBySlug, products } from '../domain/catalog';
import { money } from '../utils/money';
import { useCommerceStore } from '../stores/commerce';

const route = useRoute();
const router = useRouter();
const commerce = useCommerceStore();
const product = computed(() => productBySlug(String(route.params.slug)));
const quantity = ref(1);

const related = computed(() =>
  products
    .filter((item) => item.category === product.value?.category && item.id !== product.value?.id)
    .slice(0, 3),
);

function add(): void {
  if (!product.value) return;
  commerce.add(product.value.id, quantity.value);
  router.push('/carrinho');
}
</script>

<template>
  <main v-if="product" class="product-page page-shell">
    <nav class="breadcrumbs" aria-label="Navegação estrutural">
      <RouterLink to="/">Loja</RouterLink>
      <span>/</span>
      <RouterLink :to="{ path: '/', hash: '#catalogo' }">Produtos</RouterLink>
      <span>/</span>
      <span>{{ product.name }}</span>
    </nav>

    <section class="product-detail">
      <div class="product-visual">
        <span v-if="product.badge" class="detail-badge">{{ product.badge }}</span>
        <img :src="product.image" :alt="product.name" />
      </div>

      <div class="product-copy">
        <span class="category">{{ product.category }}</span>
        <h1>{{ product.name }}</h1>

        <div class="rating-row">
          <strong>★ {{ product.rating }}</strong>
          <span>{{ product.reviews }} avaliações verificadas</span>
        </div>

        <p class="description">{{ product.description }}</p>

        <section class="specifications">
          <h2>Características principais</h2>
          <ul>
            <li v-for="detail in product.details" :key="detail">{{ detail }}</li>
          </ul>
        </section>

        <div class="price-block">
          <del v-if="product.previousPriceCents">{{ money(product.previousPriceCents) }}</del>
          <strong>{{ money(product.priceCents) }}</strong>
          <span>ou 10x de {{ money(Math.round(product.priceCents / 10)) }} sem juros</span>
        </div>

        <div class="buy-row">
          <label>
            <span>Quantidade</span>
            <input v-model.number="quantity" type="number" min="1" :max="product.stock" />
          </label>

          <button type="button" class="primary-button" @click="add">Adicionar ao carrinho</button>

          <button
            type="button"
            class="favorite-detail"
            :aria-label="commerce.favorites.includes(product.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
            @click="commerce.toggleFavorite(product.id)"
          >
            {{ commerce.favorites.includes(product.id) ? '♥ Favoritado' : '♡ Favoritar' }}
          </button>
        </div>

        <p class="stock">{{ product.stock }} unidades disponíveis para esta demonstração.</p>
      </div>
    </section>

    <section v-if="related.length" class="related-products">
      <header>
        <span>Outras opções</span>
        <h2>Produtos da mesma categoria</h2>
      </header>

      <div class="related-grid">
        <ProductCard v-for="item in related" :key="item.id" :product="item" />
      </div>
    </section>
  </main>

  <main v-else class="page-shell missing-product">
    <span>Produto indisponível</span>
    <h1>Não encontramos este item.</h1>
    <RouterLink to="/" class="primary-button">Voltar para a loja</RouterLink>
  </main>
</template>

<style lang="scss" scoped>
.breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 24px;
  color: var(--muted);
  font-size: 0.74rem;
}

.breadcrumbs a {
  color: var(--brand);
  text-decoration: none;
}

.breadcrumbs a:hover {
  text-decoration: underline;
}

.product-detail {
  display: grid;
  grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
  border: 1px solid var(--line);
  background: var(--surface);
}

.product-visual {
  position: relative;
  min-height: 570px;
  display: grid;
  place-items: center;
  padding: 34px;
  background: #efeee9;
  border-right: 1px solid var(--line);
}

.product-visual img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.detail-badge {
  position: absolute;
  top: 18px;
  left: 18px;
  padding: 6px 9px;
  border: 1px solid var(--brand);
  border-radius: 2px;
  background: var(--surface);
  color: var(--brand);
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.product-copy {
  padding: clamp(30px, 4vw, 52px);
}

.category,
.related-products header > span,
.missing-product > span {
  color: var(--brand);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.product-copy h1,
.related-products h2,
.missing-product h1 {
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 500;
  letter-spacing: -0.04em;
}

.product-copy h1 {
  margin: 10px 0 13px;
  font-size: clamp(2.4rem, 4vw, 3.8rem);
  line-height: 1.02;
}

.rating-row {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 0.76rem;
}

.rating-row strong {
  color: var(--warning);
}

.rating-row span {
  color: var(--muted);
}

.description {
  margin: 24px 0;
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.7;
}

.specifications {
  padding: 20px 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.specifications h2 {
  margin: 0 0 13px;
  color: var(--ink);
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.specifications ul {
  display: grid;
  gap: 9px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.specifications li {
  color: #4f5b68;
  font-size: 0.82rem;
}

.specifications li::before {
  content: '—';
  margin-right: 8px;
  color: var(--brand);
}

.price-block {
  display: grid;
  margin-top: 24px;
}

.price-block del {
  color: #929ba6;
  font-size: 0.76rem;
}

.price-block strong {
  margin-top: 4px;
  color: var(--ink);
  font-size: 2rem;
}

.price-block span {
  margin-top: 5px;
  color: var(--muted);
  font-size: 0.78rem;
}

.buy-row {
  display: flex;
  align-items: end;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
}

.buy-row label {
  display: grid;
  gap: 7px;
}

.buy-row label span {
  color: #4f5b68;
  font-size: 0.72rem;
  font-weight: 700;
}

.buy-row input {
  width: 82px;
  min-height: 42px;
  padding: 8px 10px;
  border: 1px solid var(--line-strong);
  border-radius: 2px;
}

.favorite-detail {
  min-height: 42px;
  padding: 0 14px;
  border: 1px solid var(--line-strong);
  border-radius: 3px;
  background: var(--surface);
  color: var(--danger);
  font-size: 0.78rem;
  font-weight: 700;
}

.stock {
  margin: 14px 0 0;
  color: var(--success);
  font-size: 0.74rem;
}

.related-products {
  margin-top: 66px;
}

.related-products header {
  margin-bottom: 20px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--line-strong);
}

.related-products h2 {
  margin: 7px 0 0;
  font-size: clamp(1.9rem, 3vw, 2.7rem);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--line);
  border-left: 1px solid var(--line);
}

.missing-product {
  text-align: center;
}

.missing-product h1 {
  margin: 12px 0 24px;
  font-size: 2.8rem;
}

@media (max-width: 1060px) {
  .product-detail {
    grid-template-columns: 1fr;
  }

  .product-visual {
    min-height: 440px;
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }

  .related-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .product-visual {
    min-height: 330px;
    padding: 22px;
  }

  .product-copy {
    padding: 26px 22px;
  }

  .buy-row > * {
    width: 100%;
  }

  .buy-row input {
    width: 100%;
  }

  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>
