# Reflexão — GenIA-E2ETest

**Professor:** Jeferson do Nascimento Soares  
**Atividade:** testes E2E com Maestro e IA generativa  
**Data:** 10/11/2026

> Rascunho elaborado com assistência de IA. Leia, revise e adapte com suas
> próprias palavras antes da entrega. Não representa uma declaração de autoria
> exclusivamente humana nem uma execução do experimento dos pesquisadores.

## 1. Qual problema a abordagem GenIA-E2ETest procura resolver?

A abordagem procura reduzir o esforço de transformar cenários escritos em
linguagem natural em testes E2E executáveis. Mapear elementos e programar
interações exige tempo e conhecimento técnico. O artigo trata essa distância
entre a descrição do fluxo e sua automação, além do foco frequente de outras
soluções em testes unitários. [Fonte: introdução e seção 3][artigo].

## 2. Como a IA generativa pode ajudar na criação de testes E2E?

Ela pode organizar cenários, associar ações aos elementos da interface e gerar
scripts. O trabalho estrutura essas tarefas em níveis de prompts: modularização,
extração/refinamento de elementos e geração. A implementação estudada usa Robot
Framework e Selenium em aplicações web. [Fonte: seção 3][artigo].

No Crypto Alert, minha aplicação dessa ideia é descrever uma ação concreta,
como criar um alerta, conferir os componentes React Native e então construir
um YAML Maestro com ações e resultados observáveis. Essa é uma adaptação
didática, não uma reprodução da ferramenta do artigo.

## 3. Quais limitações ou riscos existem ao usar testes gerados por IA?

O artigo identifica dificuldades com navegação dependente de contexto, conteúdo
dinâmico, elementos inferidos incorretamente e localizadores frágeis. Sua avaliação
abrange duas aplicações web e doze casos, o que limita generalizações.
[Fonte: seções 4.2.4 e 4.3][artigo].

Neste projeto, um risco concreto seria a IA inventar um botão de conversão:
o resultado é automático. Outro seria tratar cotações variáveis como valores
fixos ou afirmar que o aplicativo dispara notificações, embora ele apenas
cadastre alertas locais. Um script pode executar e ainda verificar pouco;
por isso, abrir uma tela não comprova o cálculo ou a persistência.

## 4. Por que um teste gerado por IA ainda precisa de revisão humana?

Os próprios scripts do estudo foram revisados e executados; houve necessidade
de adaptações. Assim, geração não equivale a validação. [Fonte: seções 4.1.3 e
4.2.3][artigo].

A revisão, nesta atividade, precisa conferir se o cenário existe no aplicativo,
se cada seletor aponta ao componente correto, se o estado inicial é conhecido
e se as asserções detectam uma falha real. Também é responsabilidade humana
separar um resultado comprovado de uma hipótese e registrar honestamente
fluxos que não puderam ser executados.

## 5. Como o Maestro pode ser usado para validar, na prática, um fluxo sugerido por uma IA?

Minha proposta prática é traduzir o cenário revisado em um YAML que abra o APK,
toque nas abas, preencha os campos e confira os resultados visíveis. Para criar
um alerta, por exemplo: abrir `Alerts`, tocar `New Alert`, selecionar Bitcoin,
informar o preço, escolher a condição, salvar e conferir o card.

O Maestro permite expressar essas interações e asserções pela interface real.
Uma execução deve produzir resultado e evidências identificáveis; somente
escrever YAML ou passar testes Jest não comprova esse fluxo. O estado efetivo
das execuções desta atividade está em `evidencias/execucao.md`.
[Referências: comandos Maestro][maestro].

## Referências

- JÚNIOR, Elvis; VALEJO, Alan; VALVERDE-REBAZA, Jorge; NEVES, Vânia de Oliveira.
  **GenIA-E2ETest: A Generative AI-Based Approach for End-to-End Test Automation**.
  SBES, 2025. [Preprint e texto completo][artigo].
  [Versão publicada — DOI](https://doi.org/10.5753/sbes.2025.9927).
- [Documentação oficial do Maestro: assertVisible][maestro] e
  [launchApp](https://docs.maestro.dev/reference/commands-available/launchapp).

[artigo]: https://arxiv.org/html/2510.01024v1
[maestro]: https://docs.maestro.dev/reference/commands-available/assertvisible
