# Execução real — Maestro e IA generativa

Data: 10/11/2026, horário de Brasília (UTC−03:00).
Projeto executado: `C:\Projetos\react-native-crypto-alert`.

## Ambiente e correção do carregamento

- JDK 17.0.21+9 já instalado; Maestro CLI 2.12.1.
- Emulador `emulator-5554`, Android AVD `Medium_Phone_API_37.0`.
- APK `com.anonymous.cryptoalert` confirmado por `adb shell pm path`.
- Nenhuma recompilação Android ou instalação de dependências nesta execução.
- Metro iniciado com `EXPO_PUBLIC_E2E=true` e cache limpo.
- O Metro com `--localhost` escutava apenas em IPv6: `::1` retornava HTTP 200,
  enquanto `127.0.0.1` retornava `ECONNREFUSED`. O app exibia `Unable to load script`.
- Correção somente no ambiente do processo: `NODE_OPTIONS=--dns-result-order=ipv4first`
  e reinício do Metro. Confirmados `packager-status:running` por IPv4,
  bundle Android HTTP 200 e `adb reverse tcp:8081 tcp:8081`.
- O fluxo 01 confirmou Bitcoin/BTC a USD 67,999.50. A fixture retorna os dados
  localmente; imagens remotas podem ficar como placeholders por causa do DNS
  do emulador. Os testes não validam disponibilidade da CoinGecko.

## Tentativa inicial preservada

Execução iniciada às 14h31, ainda com o bloqueio IPv4 do Metro. Os quatro fluxos
falharam na espera inicial por `Cryptocurrencies`, sem chegar às verificações
funcionais. Ver [JUnit inicial](resultados-tentativa-inicial.xml),
[captura do fluxo 01](tentativa-inicial-01-lista.png).
A captura foi produzida automaticamente pelo Maestro na falha. A imagem
equivalente do fluxo 02 foi omitida por repetir a mesma tela de erro.

## Reexecução após a correção

Comando real, iniciado às 14h37:

```powershell
maestro --device emulator-5554 test --format junit --output evidencias/resultados.xml --test-output-dir evidencias/maestro .maestro/
```

| Fluxo | Resultado confirmado | Evidências |
| --- | --- | --- |
| 01-lista | PASSOU | [Lista com preço de fixture](01-lista.png), [comandos](01-lista-comandos.json) |
| 02-navegacao | PASSOU | [Alertas vazios](02-alertas-vazios.png), [comandos](02-navegacao-comandos.json) |
| 03-conversao | PASSOU na repetição isolada | [Zero inválido](03-entrada-invalida.png), [2 BTC em BRL](03-conversao-brl.png), [comandos](03-conversao-comandos.json) |
| 04-criar-alerta | PASSOU | [Bitcoin below USD 70,000.00](04-alerta-criado.png), [comandos](04-criar-alerta-comandos.json) |

O [JUnit da segunda tentativa](resultados.xml) registra três aprovações e uma
falha na abertura do fluxo 03. O log do dispositivo identificou
`java.net.ProtocolException: Expected leading [0-9a-fA-F] character but was 0xd`
no download HTTP do bundle, antes da execução do cálculo. O
[trecho real de transporte](segunda-tentativa-03-transporte.log) foi preservado.

O mesmo YAML de conversão foi repetido sem alteração, às 14h45:

```powershell
maestro --device emulator-5554 test --format junit --output evidencias/resultados-conversao.xml --test-output-dir evidencias/maestro .maestro/03-conversao.yaml
```

O [JUnit da conversão](resultados-conversao.xml) confirma aprovação em 162,845 s:
zero inválido, 2 BTC = USD 135,999.00 e BRL 696,314.88. A suíte de quatro fluxos
teve 3/4 aprovações; a repetição isolada teve 1/1. Assim, os **quatro fluxos têm
aprovação comprovada**, sem alegar uma única execução completa 4/4.
O [resumo derivado](resumo-resultados.json) aponta o XML original de cada
resultado mais recente. Foram nove execuções de fluxos no total: quatro
aprovações e cinco falhas anteriores de ambiente/transporte. Não há fluxo
obrigatório sem aprovação, mas a falha intermitente de transporte pode reaparecer.

As capturas publicadas são cópias sem edição dos arquivos `takeScreenshot`
produzidos pelo Maestro em `evidencias/maestro/2026-11-10_143758/` e
`evidencias/maestro/2026-11-10_144505/`.
Foram revisadas visualmente: cinco telas distintas de sucesso/validação e uma
tela de falha inicial. A volta à lista do fluxo 02 foi omitida por repetir o
conteúdo da imagem do fluxo 01; o retorno continua comprovado no JSON de comandos.
Os JSONs de comandos são os artefatos originais de execução do Maestro.
Diagnósticos brutos ficam ignorados pelo Git para evitar logs extensos e
informações irrelevantes à entrega. Logs de build não são evidência E2E.

## Requisitos revisados

- `reflexao.md`: cinco respostas com referências e declaração da assistência de IA.
- `ia/planejamento.md`: prompt literal, resposta original preservada, oito cenários,
  seleção de quatro e análise crítica das adaptações.
- `.maestro/`: quatro fluxos com preparação independente, asserções e capturas.
- `README.md`: instalação, JDK/emulador, modo E2E, execução e correção IPv4.
- Evidências reais dos quatro fluxos aprovados produzidas e inspecionadas.
- Histórico incremental preservado, incluindo reflexão, planejamento,
  instrumentação E2E e preparação Android em commits separados.
- Documentação e artefatos revisados; sem mudanças em código, dependências,
  configuração Android ou YAMLs. `src.zip` removido por autorização do usuário.

Nenhum requisito obrigatório listado na solicitação ficou sem comprovação local.
Os commits de entrega e a confirmação do push são informados no relatório final.

## Limites

A execução usa fixture explícita e valida interface, navegação, cálculo e cadastro
local. Não comprova API real, carregamento das imagens remotas, notificações,
exclusão ou persistência após reinício. O app não implementa notificações.
Os testes Jest e o log histórico `android-build-parcial.log` não substituem Maestro.
