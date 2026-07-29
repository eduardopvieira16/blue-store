<template>
  <main class="page-shell not-found">
    <span>Erro 404</span>
    <h1>Página não encontrada.</h1>
    <p>O endereço informado não corresponde a uma página da BlueStore.</p>
    <RouterLink to="/" class="primary-button">Voltar para a loja</RouterLink>
  </main>
</template>

<style scoped>
.not-found {
  text-align: center;
}

.not-found > span {
  color: var(--brand);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.not-found h1 {
  margin: 12px 0 10px;
  color: var(--ink);
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 500;
  letter-spacing: -0.04em;
}

.not-found p {
  margin: 0 0 24px;
  color: var(--muted);
  font-size: 0.88rem;
}
</style>
