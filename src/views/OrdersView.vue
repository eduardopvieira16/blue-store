<script setup lang="ts">
import { useCommerceStore } from '../stores/commerce';
import { products } from '../domain/catalog';
import { money } from '../utils/money';

const commerce = useCommerceStore();

function productName(id: string): string {
  return products.find((product) => product.id === id)?.name ?? 'Produto';
}
</script>

<template>
  <main class="page-shell">
    <header class="page-heading">
      <span>Histórico local</span>
      <h1>Meus pedidos</h1>
      <p>Pedidos demonstrativos armazenados neste navegador.</p>
    </header>

    <section v-if="commerce.orders.length" class="orders-list">
      <article v-for="order in commerce.orders" :key="order.id">
        <header>
          <div>
            <span>Pedido</span>
            <strong>{{ order.id }}</strong>
          </div>
          <div>
            <span>Data</span>
            <strong>{{ new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(order.createdAt)) }}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong class="status">{{ order.status }}</strong>
          </div>
        </header>

        <ul>
          <li v-for="item in order.items" :key="item.productId">
            <span>{{ item.quantity }} × {{ productName(item.productId) }}</span>
            <strong>{{ money(item.quantity * item.priceCents) }}</strong>
          </li>
        </ul>

        <footer>
          <span>Entrega simulada para {{ order.customer.city }}</span>
          <strong>Total: {{ money(order.totalCents) }}</strong>
        </footer>
      </article>
    </section>

    <section v-else class="empty-orders">
      <span>Nenhum pedido</span>
      <h2>Seu histórico ainda está vazio.</h2>
      <p>Conclua uma compra demonstrativa para visualizar o pedido nesta página.</p>
      <RouterLink to="/" class="primary-button">Ir para a loja</RouterLink>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.orders-list {
  display: grid;
  gap: 20px;
}

.orders-list article {
  border: 1px solid var(--line);
  background: var(--surface);
}

.orders-list article > header {
  display: grid;
  grid-template-columns: 1fr 1fr 160px;
  gap: 20px;
  padding: 17px 20px;
  border-bottom: 1px solid var(--line);
  background: var(--surface-muted);
}

.orders-list article > header div {
  display: grid;
  gap: 5px;
}

.orders-list article > header span {
  color: var(--muted);
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.orders-list article > header strong {
  color: var(--ink);
  font-size: 0.78rem;
}

.status {
  width: max-content;
  padding-bottom: 2px;
  border-bottom: 2px solid var(--success);
  color: var(--success) !important;
  text-transform: capitalize;
}

.orders-list ul {
  margin: 0;
  padding: 12px 20px;
  list-style: none;
}

.orders-list li {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 9px 0;
  color: #4f5b68;
  font-size: 0.8rem;
}

.orders-list li + li {
  border-top: 1px solid #eceef1;
}

.orders-list footer {
  display: flex;
  justify-content: space-between;
  gap: 18px;
  padding: 16px 20px;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.78rem;
}

.orders-list footer strong {
  color: var(--ink);
}

.empty-orders {
  padding: 64px 28px;
  border: 1px solid var(--line);
  background: var(--surface);
  text-align: center;
}

.empty-orders > span {
  color: var(--brand);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.empty-orders h2 {
  margin: 12px 0 10px;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 2rem;
  font-weight: 500;
}

.empty-orders p {
  max-width: 560px;
  margin: 0 auto 22px;
  color: var(--muted);
  font-size: 0.84rem;
  line-height: 1.65;
}

@media (max-width: 700px) {
  .orders-list article > header {
    grid-template-columns: 1fr;
  }

  .orders-list footer {
    flex-direction: column;
  }
}
</style>
