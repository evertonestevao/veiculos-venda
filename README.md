# AutoMarket — protótipo de marketplace de veículos

Demonstração visual: sem backend, sem banco, sem autenticação real. Tudo fica no `localStorage` do navegador.

## Como rodar
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # gera /dist (deploy estático, ex.: Vercel — vercel.json já incluso)
```

## O que existe
- Público: `/` (busca, hero, filtros completos, ordenação, grade/lista, carregar mais, filtros na URL), `/veiculo/:id` (galeria, ficha, opcionais, contato, simulador de financiamento), `/favoritos`
- Login: `/login` aceita qualquer valor (inclusive vazio) ou "Entrar como demonstração"
- Admin: `/admin` (dashboard), `/admin/veiculos` (tabela, ações, seleção em massa), `/admin/veiculos/novo` e `/:id/editar` (formulário com preview ao vivo), `/admin/mensagens`, `/admin/configuracoes`
- "Restaurar dados de exemplo" na sidebar do admin

## O que é simulado
Login, telefone/mensagens do vendedor, envio de mensagem (só gera toast e entra na caixa do admin), financiamento (Tabela Price ilustrativa), visualizações e vendedores. Fotos de exemplo vêm de picsum.photos.

## Estrutura
`src/lib` (tipos, seed, store Zustand persistido, filtros puros, formatadores) · `src/components` · `src/layouts` · `src/pages`
