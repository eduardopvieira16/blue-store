<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import type { Product } from '../domain/product';
import { money } from '../utils/money';
import { useCommerceStore } from '../stores/commerce';

const props = defineProps<{ product: Product }>();
const commerce = useCommerceStore();
const favorite = computed(() => commerce.favorites.includes(props.product.id));

function add(): void {
  commerce.add(props.product.id);
}
</script>

<template>
  <article class="product-card">
    <div class="product-media">
      <span v-if="product.badge" class="product-badge">{{ product.badge }}</span>

      <button
        class="favorite-button"
        type="button"
        :aria-label="favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
        @click="commerce.toggleFavorite(product.id)"
      >
        {{ favorite ? '♥' : '♡' }}
      </button>

      <RouterLink :to="`/produto/${product.slug}`" class="product-image-link">
        <img
          :src="product.image"
          :alt="product.name"
          loading="lazy"
          decoding="async"
          width="900"
          height="900"
        />
      </RouterLink>
    </div>

    <div class="product-content">
      <span class="product-category">{{ product.category }}</span>

      <RouterLink :to="`/produto/${product.slug}`" class="product-name-link">
        <h3>{{ product.name }}</h3>
      </RouterLink>

      <p>{{ product.description }}</p>

      <div class="product-rating">
        <strong>★ {{ product.rating }}</strong>
        <span>{{ product.reviews }} avaliações</span>
      </div>

      <div class="product-footer">
        <div class="product-price">
          <del v-if="product.previousPriceCents">{{ money(product.previousPriceCents) }}</del>
          <strong>{{ money(product.priceCents) }}</strong>
        </div>

        <button type="button" @click="add">Adicionar</button>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.product-card {
  min-width: 0;
  display: flex;
  flex-direction: column;
  background: var(--surface);
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.product-card:hover {
  outline: 1px solid var(--line-strong);
  outline-offset: -1px;
}

.product-media {
  position: relative;
  aspect-ratio: 4 / 3;
  padding: 20px;
  background: #f2f1ed;
  border-bottom: 1px solid var(--line);
}

.product-image-link {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
}

.product-media img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}

.product-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 2;
  padding: 5px 8px;
  border: 1px solid var(--brand);
  border-radius: 2px;
  background: var(--surface);
  color: var(--brand);
  font-size: 0.64rem;
  font-weight: 700;
  line-height: 1;
  text-transform: uppercase;
}

.favorite-button {
  position: absolute;
  top: 11px;
  right: 12px;
  z-index: 2;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--danger);
  font-size: 1rem;
}

.product-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 20px;
}

.product-category {
  color: var(--brand);
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.product-name-link {
  color: inherit;
  text-decoration: none;
}

.product-name-link h3 {
  min-height: 2.65em;
  margin: 7px 0 0;
  color: var(--ink);
  font-size: 1.06rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.32;
}

.product-name-link:hover h3 {
  color: var(--brand);
  text-decoration: underline;
  text-underline-offset: 3px;
}

.product-content > p {
  min-height: 3.15em;
  margin: 12px 0 0;
  color: var(--muted);
  font-size: 0.78rem;
  line-height: 1.55;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 15px;
  font-size: 0.69rem;
}

.product-rating strong {
  color: var(--warning);
}

.product-rating span {
  color: var(--muted);
}

.product-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  margin-top: auto;
  padding-top: 20px;
}

.product-price {
  min-width: 0;
  display: grid;
  gap: 3px;
}

.product-price del {
  color: #929ba6;
  font-size: 0.68rem;
}

.product-price strong {
  color: var(--ink);
  font-size: 1.18rem;
  line-height: 1.1;
  white-space: nowrap;
}

.product-footer > button {
  min-height: 38px;
  padding: 0 13px;
  border: 1px solid var(--brand);
  border-radius: 3px;
  background: var(--brand);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 700;
}

.product-footer > button:hover {
  border-color: var(--brand-dark);
  background: var(--brand-dark);
}

@media (max-width: 420px) {
  .product-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .product-footer > button {
    width: 100%;
  }
}
</style>
