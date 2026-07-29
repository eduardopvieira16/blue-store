<script setup lang="ts">
import { computed, ref } from 'vue';
import ProductCard from '../components/ProductCard.vue';
import { categories, products } from '../domain/catalog';
import { money } from '../utils/money';

const query = ref('');
const category = ref('Todos');
const sort = ref('featured');

const featuredProduct = products[0];

const visibleProducts = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase();
  let result = products.filter((product) => {
    const matchesCategory = category.value === 'Todos' || product.category === category.value;
    const searchableText = `${product.name} ${product.category} ${product.description}`.toLowerCase();
    return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
  });

  if (sort.value === 'price-asc') {
    result = [...result].sort((a, b) => a.priceCents - b.priceCents);
  }

  if (sort.value === 'price-desc') {
    result = [...result].sort((a, b) => b.priceCents - a.priceCents);
  }

  if (sort.value === 'rating') {
    result = [...result].sort((a, b) => b.rating - a.rating);
  }

  return result;
});

function resetFilters(): void {
  query.value = '';
  category.value = 'Todos';
  sort.value = 'featured';
}
</script>

<template>
  <main class="store-home">
    <section class="hero">
      <div class="hero-copy">
        <span class="eyebrow">Destaque da semana</span>
        <h1>Trabalho confortável começa com escolhas simples.</h1>
        <p>
          Equipamentos para escritório, estudo e rotina digital. Informações claras, estoque
          atualizado e compra sem etapas desnecessárias.
        </p>

        <div class="hero-actions">
          <RouterLink :to="`/produto/${featuredProduct.slug}`" class="primary-button">
            Ver {{ featuredProduct.name }}
          </RouterLink>
          <a href="#catalogo" class="secondary-button">Ir para o catálogo</a>
        </div>

        <div class="featured-price">
          <small>A partir de</small>
          <strong>{{ money(featuredProduct.priceCents) }}</strong>
        </div>
      </div>

      <RouterLink :to="`/produto/${featuredProduct.slug}`" class="hero-product">
        <img :src="featuredProduct.image" :alt="featuredProduct.name" />
        <div>
          <span>{{ featuredProduct.category }}</span>
          <strong>{{ featuredProduct.name }}</strong>
          <small>★ {{ featuredProduct.rating }} · {{ featuredProduct.reviews }} avaliações</small>
        </div>
      </RouterLink>
    </section>

    <section class="service-strip" aria-label="Condições de compra">
      <article>
        <strong>Frete grátis</strong>
        <span>Em pedidos acima de R$ 500</span>
      </article>
      <article>
        <strong>Troca em 7 dias</strong>
        <span>Solicitação direta pelo atendimento</span>
      </article>
      <article>
        <strong>Pagamento simulado</strong>
        <span>Nenhuma cobrança real é realizada</span>
      </article>
    </section>

    <section id="catalogo" class="catalog">
      <header class="catalog-heading">
        <div>
          <span>Catálogo</span>
          <h2>Produtos para uma rotina mais organizada</h2>
          <p>{{ visibleProducts.length }} {{ visibleProducts.length === 1 ? 'produto' : 'produtos' }}</p>
        </div>

        <label class="search-field">
          <span>Buscar</span>
          <input v-model="query" type="search" placeholder="Nome, categoria ou característica" />
        </label>
      </header>

      <div class="catalog-controls">
        <div class="category-tabs" aria-label="Categorias">
          <button
            v-for="item in categories"
            :key="item"
            type="button"
            :class="{ active: category === item }"
            @click="category = item"
          >
            {{ item }}
          </button>
        </div>

        <label class="sort-field">
          <span>Ordenar por</span>
          <select v-model="sort">
            <option value="featured">Destaques</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="rating">Melhor avaliação</option>
          </select>
        </label>
      </div>

      <div v-if="visibleProducts.length" class="product-grid">
        <ProductCard v-for="product in visibleProducts" :key="product.id" :product="product" />
      </div>

      <div v-else class="empty-results">
        <strong>Nenhum produto encontrado.</strong>
        <p>Revise a busca ou limpe os filtros.</p>
        <button type="button" class="secondary-button" @click="resetFilters">Limpar filtros</button>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.store-home {
  width: min(1220px, calc(100% - 48px));
  margin: 0 auto;
  padding: 36px 0 72px;
}

.hero {
  min-height: 430px;
  display: grid;
  grid-template-columns: 1.04fr 0.96fr;
  border: 1px solid var(--line);
  background: var(--surface);
}

.hero-copy {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(34px, 5vw, 66px);
  border-right: 1px solid var(--line);
}

.eyebrow,
.catalog-heading > div > span {
  color: var(--brand);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.hero h1 {
  max-width: 680px;
  margin: 12px 0 18px;
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.5rem, 5vw, 4.6rem);
  font-weight: 500;
  letter-spacing: -0.055em;
  line-height: 0.98;
}

.hero-copy > p {
  max-width: 620px;
  margin: 0;
  color: var(--muted);
  font-size: 0.94rem;
  line-height: 1.72;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 26px;
}

.featured-price {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-top: 26px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

.featured-price small {
  color: var(--muted);
  font-size: 0.75rem;
}

.featured-price strong {
  color: var(--ink);
  font-size: 1.5rem;
}

.hero-product {
  display: grid;
  grid-template-rows: 1fr auto;
  min-width: 0;
  padding: 30px;
  background: #efeee9;
  color: inherit;
  text-decoration: none;
}

.hero-product img {
  width: 100%;
  min-height: 280px;
  object-fit: contain;
}

.hero-product > div {
  padding-top: 18px;
  border-top: 1px solid #ced1d5;
}

.hero-product span,
.hero-product strong,
.hero-product small {
  display: block;
}

.hero-product span {
  color: var(--brand);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-product strong {
  margin-top: 6px;
  font-size: 1.12rem;
}

.hero-product small {
  margin-top: 7px;
  color: var(--muted);
  font-size: 0.72rem;
}

.service-strip {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 20px;
  border: 1px solid var(--line);
  background: var(--surface);
}

.service-strip article {
  padding: 18px 20px;
}

.service-strip article + article {
  border-left: 1px solid var(--line);
}

.service-strip strong,
.service-strip span {
  display: block;
}

.service-strip strong {
  font-size: 0.82rem;
}

.service-strip span {
  margin-top: 5px;
  color: var(--muted);
  font-size: 0.72rem;
  line-height: 1.45;
}

.catalog {
  padding-top: 68px;
  scroll-margin-top: 24px;
}

.catalog-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 30px;
  padding-bottom: 22px;
  border-bottom: 1px solid var(--line-strong);
}

.catalog-heading h2 {
  margin: 8px 0 0;
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2rem, 4vw, 3.15rem);
  font-weight: 500;
  letter-spacing: -0.04em;
}

.catalog-heading p {
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 0.78rem;
}

.search-field {
  width: min(380px, 100%);
  display: grid;
  gap: 7px;
}

.search-field > span,
.sort-field > span {
  color: #4f5b68;
  font-size: 0.72rem;
  font-weight: 700;
}

.search-field input,
.sort-field select {
  min-height: 43px;
  padding: 9px 11px;
  border: 1px solid var(--line-strong);
  border-radius: 2px;
  outline: none;
  background: var(--surface);
}

.search-field input:focus,
.sort-field select:focus {
  border-color: var(--brand);
}

.catalog-controls {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin: 20px 0 24px;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  border-bottom: 1px solid var(--line);
}

.category-tabs button {
  padding: 10px 13px 9px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: var(--muted);
  font-size: 0.75rem;
  font-weight: 700;
}

.category-tabs button:hover {
  color: var(--ink);
}

.category-tabs button.active {
  border-bottom-color: var(--brand);
  color: var(--ink);
}

.sort-field {
  min-width: 170px;
  display: grid;
  gap: 7px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  border-top: 1px solid var(--line);
  border-left: 1px solid var(--line);
}

.empty-results {
  padding: 64px 20px;
  border: 1px solid var(--line);
  background: var(--surface);
  text-align: center;
}

.empty-results strong {
  font-size: 1rem;
}

.empty-results p {
  margin: 8px 0 18px;
  color: var(--muted);
  font-size: 0.82rem;
}

@media (max-width: 1180px) {
  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 980px) {
  .store-home {
    width: min(100% - 32px, 1220px);
    padding-top: 28px;
  }

  .hero {
    grid-template-columns: 1fr;
  }

  .hero-copy {
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }

  .hero-product {
    grid-template-columns: 1fr minmax(180px, 280px);
    grid-template-rows: auto;
    align-items: center;
    gap: 24px;
  }

  .hero-product > div {
    padding-top: 0;
    padding-left: 20px;
    border-top: 0;
    border-left: 1px solid #ced1d5;
  }
}

@media (max-width: 720px) {
  .service-strip {
    grid-template-columns: 1fr;
  }

  .service-strip article + article {
    border-left: 0;
    border-top: 1px solid var(--line);
  }

  .catalog-heading,
  .catalog-controls {
    align-items: stretch;
    flex-direction: column;
  }

  .search-field,
  .sort-field {
    width: 100%;
  }

  .category-tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
  }

  .category-tabs button {
    white-space: nowrap;
  }
}

@media (max-width: 560px) {
  .store-home {
    width: min(100% - 24px, 1220px);
    padding-bottom: 48px;
  }

  .hero-copy,
  .hero-product {
    padding: 24px;
  }

  .hero-product {
    grid-template-columns: 1fr;
  }

  .hero-product > div {
    padding-top: 16px;
    padding-left: 0;
    border-top: 1px solid #ced1d5;
    border-left: 0;
  }

  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
