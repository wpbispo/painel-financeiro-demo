# Painel financeiro web — loja de purificadores (demonstração)

Painel que lê a planilha financeira de uma pequena loja (`.xlsx`) e mostra, no computador ou no celular, o resumo do dia, o resultado do mês, as despesas, as contas a pagar e a margem de cada produto.

> **Dados fictícios.** Esta é uma versão de demonstração. A loja "Fonte Clara", os clientes, fornecedores e valores foram inventados. A versão real tem senha e lê a planilha verdadeira da loja.

**Testar online:** https://wpbispo.github.io/painel-financeiro-demo/

## O problema

O dono e a gestora da loja pediam com frequência "quanto vendeu hoje", "quanto tem a pagar este mês" e "estamos tendo lucro?". As respostas estavam numa planilha grande, difícil de consultar pelo celular.

## O que o painel faz

| Aba | O que mostra |
| --- | --- |
| **Hoje** | Vendas e saídas do dia, formas de pagamento, comparação com o mês anterior e botão para gerar PDF do dia |
| **Mês** | Faturamento, despesas, saldo, quem está devendo e todos os lançamentos com busca e filtros |
| **Resultado** | Ponto de equilíbrio, metas de lucro, DRE simplificado e a diferença entre caixa e competência |
| **Despesas** | Gastos fixos e variáveis por categoria e contas a pagar por período, com botão para copiar a lista e mandar no WhatsApp |
| **Produtos** | Mais vendidos, margem por produto e maiores clientes |
| **Ano** | Mês a mês com a linha do ponto de equilíbrio, DRE anual e reserva |

Todos os cálculos são refeitos no navegador a partir das linhas da planilha. Os resultados foram conferidos com os da planilha original e batem nos centavos.

Também pode ser instalado no celular como aplicativo (PWA): tem ícone próprio, abre em tela cheia e mostra os últimos números quando está sem internet.

## Tecnologias

- HTML, CSS e JavaScript puros, sem framework. Gráficos em SVG feitos à mão.
- [SheetJS](https://sheetjs.com/) para ler a planilha `.xlsx` no navegador.
- Service worker e manifest para funcionar como aplicativo no celular.
- Git e GitHub Pages para publicar. Para atualizar os números, basta subir a planilha nova.

## Como rodar

O painel busca a planilha `Relatorio_Financeiro_2026.xlsx` na mesma pasta, então precisa ser aberto por um servidor (o GitHub Pages já faz isso). No computador:

```
python -m http.server 8000
```

Depois, abra `http://localhost:8000` no navegador. Se abrir o `index.html` com dois cliques, o painel pede para você escolher a planilha manualmente.

## Como foi feito

Desenvolvido com apoio de IA (Claude). As regras de cálculo vêm das rotinas financeiras que eu executo na loja: lançamento de vendas e despesas, contas a pagar e a receber e fechamento do mês. Eu defini o que cada tela precisava responder, conferi os números com a planilha e publico as atualizações com Git.

---
Wiliam Bispo · [LinkedIn](https://www.linkedin.com/in/wiliambispo/)
