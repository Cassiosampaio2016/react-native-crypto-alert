# CriptoAlert

Aplicativo Expo para acompanhar criptomoedas, converter valores e criar alertas de preço.

## Instalar dependências

```bash
npm install
```

## Executar os testes

```bash
npm test
```

## Gerar cobertura

```bash
npm run test:coverage
```

O relatório detalhado em HTML é gerado em `coverage/lcov-report/index.html`. O comando também apresenta o resumo no terminal e grava os dados brutos em `coverage/coverage-summary.json`.

## Testes incluídos

- Formatadores de preço e variação, incluindo valores positivos, negativos, zero e diferentes precisões.
- Componentes `ConditionOptionRow` e `AlertCard`: conteúdo, propriedades de acessibilidade e interações.
- Hook do provedor de alertas: hidratação inicial, inclusão, remoção, persistência e falha ao ler o armazenamento.
- Fluxo integrado de criação: seleção de moeda, preço e condição, salvamento e apresentação do alerta na lista.
- Interações usam React Native Testing Library com consultas semânticas e `waitFor` para atualizações assíncronas.

O armazenamento local e a navegação Expo são simulados nas fronteiras externas; telas, componentes, hooks e regras de negócio testados permanecem reais.

## Relatório de cobertura

Resumo calculado pelo Jest sobre os módulos principais cobertos pela suíte (alvo mínimo: 50% em cada métrica):

| Métrica | Cobertura |
| --- | ---: |
| Instruções | 91.11% |
| Ramificações | 81.13% |
| Funções | 91.42% |
| Linhas | 92.50% |

O resumo JSON está em [`coverage/coverage-summary.json`](coverage/coverage-summary.json) e o relatório navegável está em [`coverage/lcov-report/index.html`](coverage/lcov-report/index.html).
