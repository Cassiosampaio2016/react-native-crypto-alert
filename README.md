# CriptoAlert

Aplicativo Expo para acompanhar criptomoedas, converter valores e criar alertas de preço.

## Atividade acadêmica — Maestro e IA generativa

**Professor:** Jeferson do Nascimento Soares. O objetivo é estudar a geração
assistida de cenários e validar fluxos completos pela interface Android.
Projeto-base: [Rocketseat Education](https://github.com/rocketseat-education/react-native-crypto-alert).
Entrega individual: [Cassiosampaio2016/react-native-crypto-alert](https://github.com/Cassiosampaio2016/react-native-crypto-alert).

- [Reflexão: cinco perguntas sobre GenIA-E2ETest](reflexao.md).
- [Prompt literal, resposta original, oito cenários e análise crítica](ia/planejamento.md).
- [Quatro fluxos Maestro](.maestro/).
- [Resultados efetivos, bloqueios e evidências](evidencias/execucao.md).

A reflexão e o planejamento identificam a assistência de IA. Os resultados
do artigo não são resultados deste aplicativo.

**Resultado em 10/11/2026:** os quatro fluxos têm execução real aprovada no
`emulator-5554`. A segunda rodada completa passou em 3/4; a conversão passou
na repetição isolada, sem alterações no YAML. As tentativas com falhas de
ambiente e transporte estão preservadas. Consulte o
[registro de execução](evidencias/execucao.md), o
[JUnit da rodada completa](evidencias/resultados.xml), o
[JUnit da conversão](evidencias/resultados-conversao.xml) e o
[resumo por fluxo](evidencias/resumo-resultados.json).

### Capturas reais selecionadas

| Fluxo | Evidência |
| --- | --- |
| 01 — Lista | [Bitcoin a USD 67,999.50](evidencias/01-lista.png) |
| 02 — Navegação | [Aba Alerts sem alertas](evidencias/02-alertas-vazios.png) |
| 03 — Conversão | [Zero inválido](evidencias/03-entrada-invalida.png) e [2 BTC em BRL](evidencias/03-conversao-brl.png) |
| 04 — Criar alerta | [Card Bitcoin abaixo de USD 70,000.00](evidencias/04-alerta-criado.png) |

As imagens foram inspecionadas e selecionadas por conteúdo; telas repetidas
com nomes diferentes não foram incluídas. Os JSONs em `evidencias/` preservam
os comandos executados pelo Maestro, inclusive os passos sem captura publicada.

### Cenários implementados

| Arquivo | Comportamento verificado |
| --- | --- |
| `.maestro/01-lista.yaml` | Abrir o aplicativo e conferir Bitcoin/BTC e seu preço de fixture |
| `.maestro/02-navegacao.yaml` | Visitar Convert, Alerts e List e conferir os títulos e estado vazio |
| `.maestro/03-conversao.yaml` | Rejeitar quantidade zero; converter 2 BTC em USD e BRL |
| `.maestro/04-criar-alerta.yaml` | Criar Bitcoin below a USD 70.000 e conferir o card salvo |

Cada fluxo começa com estado limpo e pode ser executado isoladamente. Isso apaga
os dados do app no emulador de testes. Use um emulador dedicado à atividade.
Os valores exatos exigem `EXPO_PUBLIC_E2E=true`: esse modo retorna o catálogo
local na fronteira de dados, mantendo a interface, navegação, cálculo e
AsyncStorage reais. Sem essa variável, a aplicação continua consultando CoinGecko.
O teste com fixture não valida a disponibilidade ou os dados reais da API.

### Pré-requisitos e emulador

Windows/PowerShell, Node 22 LTS com npm, JDK 17, Android Studio/SDK, ADB e Maestro.
No Android Studio, abra **Device Manager**, crie ou selecione um AVD e clique em
**Run**. Aguarde a inicialização do Android. Em seguida:

```powershell
. .\scripts\android-env.ps1
adb devices
```

O dispositivo usado nesta atividade é `emulator-5554`. Ele deve aparecer como
`device`, não `offline`. A configuração Android do app é `com.anonymous.cryptoalert`.

### Instalar Maestro no Windows

Baixe `maestro.zip` na [release oficial](https://github.com/mobile-dev-inc/Maestro/releases),
extraia e adicione a pasta `maestro\bin` ao PATH da sessão. Nesta máquina foi
baixada a release `cli-2.12.1` para `.android-tools/maestro-cli/`; o script de
ambiente detecta essa instalação. Exemplo para uma instalação própria:

```powershell
$env:PATH = 'C:\ferramentas\maestro\bin;' + $env:PATH
maestro --version
```

[Instruções oficiais de instalação](https://docs.maestro.dev/maestro-cli/how-to-install-maestro-cli).

### Executar os fluxos

Após gerar e instalar o APK conforme a seção Android abaixo, inicie Metro com
os dados E2E. O modo fixture é configuração do bundle JavaScript, não argumento
de `launchApp` do Maestro:

```powershell
$env:EXPO_PUBLIC_E2E = 'true'
$env:NODE_OPTIONS = '--dns-result-order=ipv4first'
npx expo start --localhost --port 8081 --clear
```

Em outro terminal, a partir da raiz do projeto:

```powershell
. .\scripts\android-env.ps1
adb -s emulator-5554 reverse tcp:8081 tcp:8081
adb -s emulator-5554 shell pm path com.anonymous.cryptoalert
maestro --device emulator-5554 hierarchy
maestro --device emulator-5554 test .maestro/01-lista.yaml
maestro --device emulator-5554 test .maestro/02-navegacao.yaml
maestro --device emulator-5554 test --format junit --output evidencias/resultados.xml --test-output-dir evidencias/maestro .maestro/
```

Nesta máquina, `localhost` sem a opção `ipv4first` fez o Metro escutar somente
em `::1`, enquanto o encaminhamento ADB precisava de IPv4. Confira o servidor
com `curl.exe --noproxy "*" http://127.0.0.1:8081/status`: o resultado esperado
é `packager-status:running`. Aguarde a geração inicial do bundle após limpar
o cache antes de executar os fluxos. O APK de desenvolvimento depende do Metro
ativo durante toda a suíte. A variável E2E precisa estar no processo Metro;
defini-la apenas no terminal do Maestro não altera o bundle.

`hierarchy` permite conferir IDs e textos expostos no dispositivo. Os YAMLs
contêm `takeScreenshot` para salvar capturas em `evidencias/`. A existência dos
comandos não comprova execução: consulte o [registro efetivo](evidencias/execucao.md)
para conferir o resultado de cada fluxo e das tentativas anteriores.

O arquivo `evidencias/android-build-parcial.log` é um log real de compilação
capturado às 12h50 de 10/11/2026, ainda sem APK concluído. Ele comprova a
tentativa e o progresso do ambiente; não substitui capturas do aplicativo,
relatório Maestro ou aprovação de cenários. As execuções E2E posteriores estão
documentadas separadamente no registro de execução, com capturas reais.

### Problemas conhecidos e limites

- Caminhos com acento no Windows afetaram a cópia do template e a compilação.
  SUBST com UTF-8 permitiu avançar, mas o autolinking resolve dependências para
  o caminho físico, podendo misturar unidades e bloquear codegen. Para build
  confiável, use uma **cópia física em caminho ASCII**, sem mover o workspace.
- Java 25 é incompatível com o Gradle 9.0 do template; foi preparado JDK 17.
- O app cadastra alertas locais, mas não implementa disparo de notificações.
- A listagem normal depende de rede; os fluxos acadêmicos usam fixture explícita.
- A gravação de alertas é assíncrona; os quatro fluxos não alegam validar
  persistência após reinício.
- `npm audit` ainda aponta dependências vulneráveis; não foi usado audit fix force.
- Os testes Jest existentes são validação complementar, não execuções Maestro.

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

O resumo JSON está em [`coverage/coverage-summary.json`](coverage/coverage-summary.json).
O [relatório HTML já versionado](coverage/index.html) corresponde à execução
anterior. Uma nova execução de `npm run test:coverage` gera o HTML em
`coverage/lcov-report/index.html`. Os números acima são do registro de cobertura
existente; Jest não foi reexecutado nesta rodada de E2E.

## Android no Windows (Expo SDK 55)

O identificador Android é `com.anonymous.cryptoalert`. Use JDK 17 e o Android SDK
com um emulador conectado. O template deste SDK usa Gradle 9.0: Java 8 é antigo
demais e Java 25 requer Gradle 9.1 ou superior. Não é necessário alterar o Java
global nem atualizar o Gradle fora do template do Expo.

**Use projeto e JDK em caminhos físicos ASCII.** O workspace atual,
`C:\Projetos\react-native-crypto-alert`, já atende a esse requisito. As notas
abaixo sobre cópia e SUBST registram o ambiente anterior em caminho acentuado;
não é necessário copiar novamente nem recompilar o APK já instalado para E2E.
O JDK desta sessão foi extraído em `C:\Users\cassi\jdk-e2e-17\jdk-17.0.21+9`,
detectado pelo script de ambiente. O Prefab/CMake também pode falhar quando o
próprio Java está em caminho acentuado. O helper
abaixo cria uma pasta nova, exclui da cópia `.env*`, `.git`, caches, ferramentas
e pastas nativas, sem apagar ou mover nada do original. Ele interrompe se o
destino já existir. Use dot-source para manter o ambiente e o diretório:

```powershell
. .\scripts\prepare-android-build.ps1 -Destination "$env:USERPROFILE\crypto-alert-android"
npm ci
$env:EXPO_PUBLIC_E2E = 'true'
npx expo prebuild --platform android
npx expo run:android
```

A cópia usada na execução desta sessão é `C:\Users\cassi\ca-e2e-20261110`.
Ela foi criada a partir do workspace sem mover arquivos ou copiar `.env`.
Não edite a cópia como fonte principal: faça alterações no workspace e prepare
uma nova cópia quando precisar recompilar mudanças nativas.

Para uma instalação nova em caminho físico ASCII, no PowerShell:

```powershell
. .\scripts\android-env.ps1
npm install
npx expo-doctor
npx expo prebuild --platform android
npx expo run:android
```

O ponto seguido de espaço no primeiro comando carrega as variáveis no terminal
atual. O script prioriza JDK 17 em `$env:USERPROFILE\jdk-e2e-17`, depois o portátil
em `.android-tools/` e então `JAVA_HOME`. Para instalações próprias, informe os caminhos:

```powershell
. .\scripts\android-env.ps1 -JdkHome 'C:\caminho\jdk-17' -SdkHome "$env:LOCALAPPDATA\Android\Sdk"
```

As ferramentas portáteis baixadas localmente ficam em `.android-tools/`, ignorado
pelo Git. O script também aceita `-NodeHome` e detecta um Node 22 portátil nessa
pasta; o npm/npx da instalação global continua necessário. Nenhuma instalação
global é modificada pelo script.

Quando o caminho contém acentos, o script mapeia o diretório pai para `S:` e entra
em `S:\react-native-crypto-alert`. Os arquivos continuam no local original.
Esse caminho contorna a cópia do template e a rejeição inicial de caminhos
não ASCII, mas é uma solução parcial: o autolinking/codegen pode misturar S: e C:.
Nesse caso, compile uma cópia física em diretório ASCII; veja os problemas conhecidos.
A raiz da unidade não é usada como raiz do
projeto, pois o autolinking do Expo precisa encontrar `package.json` em uma
subpasta. Se `S:` já apontar para outro local, o script interrompe sem alterar o
mapeamento existente. Execute os comandos seguintes no terminal preparado.

O script configura UTF-8 no Java para que caminhos emitidos por subprocessos Node
sejam lidos corretamente. As variáveis valem para a sessão atual; o mapeamento
SUBST pode continuar disponível após fechar o terminal.

A primeira compilação pode baixar Gradle, NDK, CMake e dependências Maven.
O Android Studio deve ter instalado as plataformas/ferramentas exigidas e as
licenças correspondentes. A pasta `android/` é gerada e permanece ignorada pelo
Git; após mudanças em plugins ou configuração nativa, repita o prebuild.

### Dependências e verificações

- Expo `55.0.32`, Router `55.0.18`, React Native `0.83.10` e React `19.2.0`.
- `@expo/log-box@55.0.13` declarado para resolver o peer exato do Router.
- `jest-expo` alinhado ao SDK e `test-renderer@1.2.0` fixado para evitar a seleção
  de um reconciliador que exige React 19.3.
- `expo-modules-core` permanece como dependência transitiva do Expo.
- O lockfile foi atualizado sem `--force` ou `--legacy-peer-deps`.

Para verificar os testes existentes sem regravar cobertura e conferir TypeScript:

```powershell
npm test -- --watch=false --testTimeout=30000
npx tsc --noEmit
```

O limite maior acomoda a primeira carga do Jest durante a compilação Android.
O npm ainda relata vulnerabilidades transitivas; nenhuma correção automática
com atualização forçada foi aplicada.
