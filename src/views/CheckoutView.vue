<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCommerceStore } from '../stores/commerce';
import { money } from '../utils/money';

const commerce = useCommerceStore();
const router = useRouter();

const name = ref('');
const email = ref('');
const cep = ref('');
const address = ref('');
const city = ref('');
const payment = ref('pix');
const error = ref('');

function submit(): void {
  if (
    !name.value.trim() ||
    !email.value.includes('@') ||
    cep.value.replace(/\D/g, '').length !== 8 ||
    !address.value.trim() ||
    !city.value.trim()
  ) {
    error.value = 'Preencha corretamente nome, e-mail, CEP, endereço e cidade.';
    return;
  }

  if (!commerce.detailedCart.length) {
    router.push('/carrinho');
    return;
  }

  commerce.createOrder({
    name: name.value.trim(),
    email: email.value.trim(),
    city: city.value.trim(),
  });
  router.push('/pedidos');
}
</script>

<template>
  <main class="page-shell">
    <header class="page-heading">
      <span>Finalização</span>
      <h1>Checkout</h1>
      <p>Ambiente demonstrativo. Os dados não são enviados e nenhuma cobrança é realizada.</p>
    </header>

    <div v-if="commerce.detailedCart.length" class="checkout-layout">
      <form @submit.prevent="submit">
        <section>
          <header>
            <span>01</span>
            <div>
              <h2>Dados pessoais</h2>
              <p>Informações usadas apenas para criar o pedido local.</p>
            </div>
          </header>

          <div class="form-grid two-columns">
            <label class="field">
              <span>Nome completo</span>
              <input v-model="name" autocomplete="name" />
            </label>

            <label class="field">
              <span>E-mail</span>
              <input v-model="email" type="email" autocomplete="email" />
            </label>
          </div>
        </section>

        <section>
          <header>
            <span>02</span>
            <div>
              <h2>Endereço de entrega</h2>
              <p>Preencha os dados para simular a entrega.</p>
            </div>
          </header>

          <div class="form-grid two-columns">
            <label class="field">
              <span>CEP</span>
              <input v-model="cep" placeholder="00000-000" autocomplete="postal-code" />
            </label>

            <label class="field">
              <span>Cidade</span>
              <input v-model="city" autocomplete="address-level2" />
            </label>
          </div>

          <label class="field full-field">
            <span>Endereço</span>
            <input v-model="address" autocomplete="street-address" />
          </label>
        </section>

        <section>
          <header>
            <span>03</span>
            <div>
              <h2>Forma de pagamento</h2>
              <p>Selecione uma opção para concluir a demonstração.</p>
            </div>
          </header>

          <div class="payment-options">
            <label :class="{ active: payment === 'pix' }">
              <input v-model="payment" value="pix" type="radio" />
              <strong>PIX</strong>
              <span>Aprovação simulada imediata</span>
            </label>

            <label :class="{ active: payment === 'card' }">
              <input v-model="payment" value="card" type="radio" />
              <strong>Cartão</strong>
              <span>Simulação em até 10 parcelas</span>
            </label>
          </div>
        </section>

        <p v-if="error" class="form-error">{{ error }}</p>
        <button type="submit" class="primary-button submit-button">Confirmar pedido demonstrativo</button>
      </form>

      <aside class="checkout-summary">
        <h2>Seu pedido</h2>

        <div class="summary-items">
          <article v-for="item in commerce.detailedCart" :key="item.productId">
            <img :src="item.product.image" :alt="item.product.name" />
            <div>
              <strong>{{ item.product.name }}</strong>
              <span>{{ item.quantity }} × {{ money(item.product.priceCents) }}</span>
            </div>
          </article>
        </div>

        <div class="checkout-total">
          <span>Total</span>
          <strong>{{ money(commerce.cartTotal) }}</strong>
        </div>
      </aside>
    </div>

    <section v-else class="empty-checkout">
      <h2>Não há itens para finalizar.</h2>
      <RouterLink to="/" class="primary-button">Voltar para a loja</RouterLink>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.checkout-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 330px;
  gap: 26px;
  align-items: start;
}

form {
  display: grid;
  border: 1px solid var(--line);
  background: var(--surface);
}

form section {
  padding: 24px;
}

form section + section {
  border-top: 1px solid var(--line);
}

form section > header {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

form section > header > span {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border: 1px solid var(--line-strong);
  color: var(--brand);
  font-size: 0.68rem;
  font-weight: 700;
}

form h2 {
  margin: 0;
  font-size: 1rem;
}

form section header p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 0.74rem;
  line-height: 1.5;
}

.form-grid {
  display: grid;
  gap: 16px;
}

.two-columns {
  grid-template-columns: 1fr 1fr;
}

.full-field {
  margin-top: 16px;
}

.payment-options {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.payment-options label {
  position: relative;
  display: grid;
  gap: 5px;
  padding: 16px 16px 16px 42px;
  border: 1px solid var(--line-strong);
  background: var(--surface);
  cursor: pointer;
}

.payment-options label.active {
  border-color: var(--brand);
  border-left: 4px solid var(--brand);
}

.payment-options input {
  position: absolute;
  top: 18px;
  left: 16px;
}

.payment-options strong {
  font-size: 0.82rem;
}

.payment-options span {
  color: var(--muted);
  font-size: 0.7rem;
}

.form-error {
  margin: 0;
  padding: 14px 24px;
  border-top: 1px solid #e4b6b6;
  background: #fff5f5;
  color: var(--danger);
  font-size: 0.78rem;
}

.submit-button {
  margin: 20px 24px 24px;
  border: 0;
}

.checkout-summary {
  position: sticky;
  top: 22px;
  border: 1px solid var(--line);
  background: var(--surface);
}

.checkout-summary h2 {
  margin: 0;
  padding: 18px 20px;
  border-bottom: 1px solid var(--line);
  font-family: Georgia, "Times New Roman", serif;
  font-size: 1.6rem;
  font-weight: 500;
}

.summary-items {
  padding: 0 20px;
}

.summary-items article {
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: 12px;
  align-items: center;
  padding: 15px 0;
}

.summary-items article + article {
  border-top: 1px solid var(--line);
}

.summary-items img {
  width: 64px;
  height: 58px;
  padding: 5px;
  object-fit: contain;
  background: #f0efeb;
}

.summary-items strong,
.summary-items span {
  display: block;
}

.summary-items strong {
  font-size: 0.76rem;
  line-height: 1.35;
}

.summary-items span {
  margin-top: 5px;
  color: var(--muted);
  font-size: 0.7rem;
}

.checkout-total {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 14px;
  padding: 18px 20px;
  border-top: 1px solid var(--line-strong);
  background: var(--surface-muted);
}

.checkout-total span {
  color: var(--muted);
  font-size: 0.76rem;
}

.checkout-total strong {
  font-size: 1.25rem;
}

.empty-checkout {
  padding: 56px 24px;
  border: 1px solid var(--line);
  background: var(--surface);
  text-align: center;
}

.empty-checkout h2 {
  margin: 0 0 20px;
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 500;
}

@media (max-width: 1060px) {
  .checkout-layout {
    grid-template-columns: 1fr;
  }

  .checkout-summary {
    position: static;
  }
}

@media (max-width: 620px) {
  .two-columns,
  .payment-options {
    grid-template-columns: 1fr;
  }
}
</style>
