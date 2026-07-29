# BlueStore — Vue 3

Loja demonstrativa construída com Vue 3, TypeScript, Vite, Pinia, Vue Router e SASS.

## Execução local

Requisito: Node.js 20 ou superior.

```bash
npm ci
npm run dev
```

## Validação

```bash
npm run typecheck
npm run test
npm run build
```

## Direção visual

A interface foi redesenhada para eliminar padrões visuais artificiais e excesso de ornamentação:

- sem gradientes;
- sem cartões flutuantes ou sombras decorativas;
- cantos predominantemente retos, com raio máximo de 3 px nos controles;
- catálogo com grade editorial e divisórias simples;
- hierarquia tipográfica baseada em títulos serifados e texto de interface sem serifa;
- nomes completos e explícitos para todos os produtos;
- 12 imagens PNG armazenadas diretamente em `public/products`;
- navegação lateral sólida e sem bloco promocional decorativo.

## GitHub Pages

O workflow `.github/workflows/deploy-pages.yml` executa instalação, typecheck, testes, build e publicação.

No GitHub:

1. acesse **Settings → Pages**;
2. selecione **GitHub Actions** como fonte;
3. faça push para a branch `main`.

A base do Vite é resolvida automaticamente pelo nome do repositório durante o workflow. O roteamento usa `createWebHashHistory`, evitando erro 404 ao atualizar páginas internas.

## Observação

O checkout é demonstrativo, não processa cobranças e mantém carrinho, favoritos e pedidos apenas no `localStorage` do navegador.
