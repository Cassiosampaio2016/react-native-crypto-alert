# Planejamento de cenários com IA

**Data:** 10/11/2026. **Ferramenta:** assistente Codex nesta conversa.

Este registro contém uma nova rodada de planejamento feita após inspeção do
código. Não é uma transcrição retroativa de prompts de outras sessões. O prompt
e a resposta originais abaixo ficam preservados; ajustes posteriores são
registrados somente na análise crítica e nos arquivos de implementação.

## Prompt exato usado para solicitar os cenários

```text
Atue como assistente de testes. Proponha pelo menos seis cenários E2E para o projeto React Native Crypto Alert inspecionado neste workspace. Use somente funcionalidades reais: abas List, Convert e Alerts; listagem CoinGecko; conversão automática; criação e exclusão de alertas locais; persistência AsyncStorage. A criação usa catálogo estático e condição above ou below. Não existe login, busca, botão Convert ou disparo de notificações. Para cada cenário informe estado inicial, ações e resultado esperado. Identifique dependências de rede e proponha quatro cenários iniciais: lista, navegação, conversão com entrada inválida e criação de alerta. Não afirme que houve execução no dispositivo.
```

## Resposta original da IA — preservada integralmente

```text
1. Abertura e lista: iniciar o aplicativo em estado limpo; aguardar Cryptocurrencies e um card Bitcoin com BTC. Esperado: lista visível. Depende da CoinGecko, salvo uso explícito de dados controlados.
2. Navegação: iniciar sem alertas; visitar Convert, Alerts e List. Esperado: Convert Crypto, Price Alerts com No alerts yet e Cryptocurrencies, respectivamente. A navegação não depende de resposta da API.
3. Conversão e entrada inválida: abrir Convert; conferir Enter an amount; digitar 0 e conferir Invalid amount; substituir por 2 e conferir o resultado; trocar USD por BRL. Esperado: resultado positivo com símbolo e valor coerentes. Um valor exato exige preço controlado.
4. Criação de alerta: iniciar sem alertas; abrir Alerts e New Alert; selecionar Bitcoin, informar 70000, escolher Below target price e salvar. Esperado: card Bitcoin com condição below e $70,000.00 em Price Alerts. O cadastro usa catálogo estático e independe da API.
5. Exclusão: criar um único alerta no próprio cenário e excluí-lo por Delete alert. Esperado: remoção do card e retorno a No alerts yet. Não há confirmação de exclusão.
6. Persistência: criar um alerta; encerrar e reabrir o aplicativo sem limpar seus dados. Esperado: moeda, condição e preço preservados. Exige aguardar a gravação assíncrona.
7. Cancelamento: abrir criação, preencher parcialmente e usar Go back. Esperado: voltar à lista sem cadastrar alerta.
8. Formulário inválido: abrir criação e selecionar moeda; manter preço vazio ou informar 0. Esperado: Save Alert desabilitado, habilitando apenas com preço positivo. Não esperar mensagens de validação acionadas por um botão desabilitado.
Seleciono inicialmente os cenários 1, 2, 3 e 4, por cobrirem as quatro áreas solicitadas e combinarem navegação, validação e alteração de estado. Os seletores precisam de confirmação no dispositivo; nenhum cenário foi executado por esta resposta.
```

## Quatro cenários selecionados para implementar

| Cenário | Arquivo | Critério verificável |
| --- | --- | --- |
| 1. Abertura e lista | `.maestro/01-lista.yaml` | Título e Bitcoin/BTC renderizados |
| 2. Navegação | `.maestro/02-navegacao.yaml` | Títulos corretos em cada aba e estado vazio |
| 3. Conversão | `.maestro/03-conversao.yaml` | Zero inválido; 2 BTC = USD 135,999.00 e BRL 696,314.88 com fixture |
| 4. Criação | `.maestro/04-criar-alerta.yaml` | Bitcoin, condição below e preço USD 70,000.00 na lista |

## Análise crítica e adaptações após a inspeção

- **Aproveitado:** a sequência corresponde às rotas em `src/app/(tabs)` e aos
  textos de `src/screens`. Os quatro fluxos têm preparação própria e não chamam
  outro cenário para preparar seus dados.
- **Corrigido para repetibilidade:** a lista depende da CoinGecko e não mostra
  os dados de fallback quando a requisição falha. Apenas desligar a rede não
  resolve. O modo explícito `EXPO_PUBLIC_E2E=true` retorna o catálogo local na
  fronteira de dados; o teste valida o aplicativo com fixture, não a API real.
- **Conversão adaptada:** não existe botão `Convert` dentro do formulário.
  O cálculo é reativo; a aba tem esse nome. O preço estático de Bitcoin é
  67999.5 e a taxa BRL é 5.12. Valores numéricos exatos só são válidos com essa
  fixture. Zero foi escolhido como entrada inválida por funcionar no teclado
  decimal sem depender de digitação de letras.
- **Seletores:** textos e accessibilityLabels foram conferidos no código.
  Foram adicionados testIDs estáveis para abas, campos, opções e resultados.
  Conferência estática não equivale a confirmação na hierarquia Android;
  o resultado dessa confirmação deve constar no registro de execução.
- **Alertas adaptados:** o catálogo do formulário tem oito moedas fixas,
  seleção abre um Modal, a condição inicial é above e o salvamento retorna
  para `/alerts`. O cenário seleciona below explicitamente. Não espera toast,
  popup de sucesso, login ou permissão de notificação inexistentes.
- **Descartado do escopo inicial:** persistência, exclusão, cancelamento e
  formulário inválido são úteis, mas ficam para expansão após os quatro
  requisitos prioritários. Nenhuma funcionalidade de notificações será testada,
  pois não está implementada.
- **Isolamento:** `launchApp` com `clearState: true` prepara cada cenário e
  apaga os alertas do aplicativo de teste. Execute somente no emulador de
  atividade; não se trata de exclusão de arquivos do repositório.
- **Execução real posterior:** os quatro fluxos passaram no
  emulador em 10/11/2026. A conversão teve uma falha no download do bundle antes
  de abrir a tela e passou na reexecução isolada sem alteração do YAML. Capturas, relatórios
  e o estado atualizado estão em `evidencias/execucao.md`; a resposta original
  acima continua preservada, inclusive sua declaração de não execução.
- **Ambiente versus funcionalidade:** a primeira tentativa falhou porque Metro
  escutava somente IPv6. A opção `NODE_OPTIONS=--dns-result-order=ipv4first`
  corrigiu o acesso IPv4 sem editar dependências, Android ou asserções. Uma
  `ProtocolException` no transporte do bundle também não comprova erro no
  cálculo de conversão; é necessário executar o fluxo até suas asserções.

## Relação com o artigo

A atividade adapta a sequência interpretar cenário → conferir interface →
gerar script → revisar/executar, inspirada em
[GenIA-E2ETest](https://arxiv.org/html/2510.01024v1). Os autores estudaram web,
Robot Framework e Selenium; esta entrega usa React Native e Maestro e não
reivindica os resultados experimentais do artigo.
