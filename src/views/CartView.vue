<script setup lang="ts">
import { useCommerceStore } from '../stores/commerce';
import { money } from '../utils/money';

const commerce = useCommerceStore();
</script>

<template>
  <main class="page-shell">
    <header class="page-heading">
      <span>Compra</span>
      <h1>Carrinho</h1>
      <p>{{ commerce.cartCount }} {{ commerce.cartCount === 1 ? 'item selecionado' : 'itens selecionados' }}.</p>
    </header>

    <div v-if="commerce.detailedCart.length" class="cart-layout">
      <section class="cart-items" aria-label="Itens do carrinho">
        <header>
          <span>Produto</span>
          <span>Quantidade</span>
          <span>Subtotal</span>
        </header>

        <article v-for="item in commerce.detailedCart" :key="item.productId">
          <RouterLink :to="`/produto/${item.product.slug}`" class="item-image">
            <img :src="item.product.image" :alt="item.product.name" />
          </RouterLink>

          <div class="item-copy">
            <small>{{ item.product.category }}</small>
            <RouterLink :to="`/produto/${item.product.slug}`">{{ item.product.name }}</RouterLink>
            <button type="button" @click="commerce.remove(item.productId)">Remover</button>
          </div>

          <label class="quantity-field">
            <span>Quantidade</span>
            <input
              type="number"
              min="1"
              :max="item.product.stock"
              :value="item.quantity"
              @change="commerce.setQuantity(item.productId, Number(($event.target as HTMLInputElement).value))"
            />
          </label>

          <strong class="item-subtotal">{{ money(item.subtotalCents) }}</strong>
        </article>
      </section>

      <aside class="order-summary">
        <h2>Resumo</h2>

        <dl>
          <div>
            <dt>Subtotal</dt>
            <dd>{{ money(commerce.cartTotal) }}</dd>
          </div>
          <div>
            <dt>Frete</dt>
            <dd>{{ commerce.cartTotal >= 50000 ? 'Grátis' : 'No checkout' }}</dd>
          </div>
        </dl>

        <div class="summary-total">
          <span>Total</span>
          <strong>{{ money(commerce.cartTotal) }}</strong>
        </div>

        <RouterLink to="/checkout" class="primary-button">Continuar para o checkout</RouterLink>
        <RouterLink to="/" class="secondary-button">Continuar comprando</RouterLink>
      </aside>
    </div>

    <section v-else class="empty-cart">
      <span>Carrinho vazio</span>
      <h2>Nenhum produto foi adicionado.</h2>
      <p>O catálogo reúne acessórios e equipamentos para trabalho, estudo e rotina digital.</p>
      <RouterLink to="/" class="primary-button">Ver produtos</RouterLink>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.cart-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 26px;
  align-items: start;
}

.cart-items {
  border: 1px solid var(--line);
  background: var(--surface);
}

.cart-items > header {
  display: grid;
  grid-template-columns: 1fr 120px 140px;
  gap: 18px;
  padding: 12px 18px;
  border-bottom: 1px solid var(--line);
  background: var(--surface-muted);
  color: #4f5b68;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.cart-items > header span:first-child {
  padding-left: 122px;
}

.cart-items article {
  display: grid;
  grid-template-columns: 104px minmax(0, 1fr) 120px 140px;
  gap: 18px;
  align-items: center;
  padding: 18px;
}

.cart-items article + article {
  border-top: 1px solid var(--line);
}

.item-image {
  display: block;
  width: 104px;
  height: 88px;
  padding: 7px;
  background: #f0efeb;
}

.item-image img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}

.item-copy {
  min-width: 0;
}

.item-copy small {
  display: block;
  color: var(--brand);
  font-size: 0.64rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
}

.item-copy > a {
  display: block;
  margin-top: 6px;
  color: var(--ink);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 700;
  line-height: 1.35;
}

.item-copy > a:hover {
  color: var(--brand);
  text-decoration: underline;
}

.item-copy button {
  margin-top: 9px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--danger);
  font-size: 0.7rem;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.quantity-field {
  display: grid;
  gap: 6px;
}

.quantity-field span {
  display: none;
  color: var(--muted);
  font-size: 0.68rem;
}

.quantity-field input {
  width: 76px;
  min-height: 40px;
  padding: 7px 9px;
  border: 1px solid var(--line-strong);
  border-radius: 2px;
}

.item-subtotal {
  text-align: right;
  font-size: 0.94rem;
}

.order-summary {
  position: sticky;
  top: 22px;
  padding: 22px;
  border: 1px solid var(--navy);
  background: var(--navy);
  color: #fff;
}

.order-summary h2 {
  margin: 0;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.7rem;
  font-weight: 500;
}

.order-summary dl {
  display: grid;
  gap: 12px;
  margin: 22px 0;
  padding: 18px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.16);
  border-bottom: 1px solid rgba(255, 255, 255, 0.16);
}

.order-summary dl div,
.summary-total {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 14px;
}

.order-summary dt,
.order-summary dd {
  margin: 0;
  font-size: 0.77rem;
}

.order-summary dt {
  color: #bdc7d3;
}

.summary-total span {
  color: #bdc7d3;
  font-size: 0.78rem;
}

.summary-total strong {
  font-size: 1.4rem;
}

.order-summary .primary-button,
.order-summary .secondary-button {
  width: 100%;
  margin-top: 18px;
}

.order-summary .primary-button {
  border-color: #fff;
  background: #fff;
  color: var(--navy);
}

.order-summary .secondary-button {
  margin-top: 9px;
  border-color: rgba(255, 255, 255, 0.32);
  background: transparent;
  color: #fff;
}

.empty-cart {
  padding: 64px 28px;
  border: 1px solid var(--line);
  background: var(--surface);
  text-align: center;
}

.empty-cart > span {
  color: var(--brand);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.empty-cart h2 {
  margin: 12px 0 10px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 2rem;
  font-weight: 500;
}

.empty-cart p {
  max-width: 560px;
  margin: 0 auto 22px;
  color: var(--muted);
  font-size: 0.86rem;
  line-height: 1.65;
}

@media (max-width: 1100px) {
  .cart-layout {
    grid-template-columns: 1fr;
  }

  .order-summary {
    position: static;
  }
}

@media (max-width: 760px) {
  .cart-items > header {
    display: none;
  }

  .cart-items article {
    grid-template-columns: 84px minmax(0, 1fr);
  }

  .item-image {
    width: 84px;
    height: 76px;
  }

  .quantity-field {
    grid-column: 1 / 2;
  }

  .quantity-field span {
    display: block;
  }

  .item-subtotal {
    grid-column: 2 / 3;
    align-self: end;
  }
}
</style>
