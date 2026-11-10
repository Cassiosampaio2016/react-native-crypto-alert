# Registro efetivo de execução

Data: 10/11/2026, horário de Brasília. Este documento será atualizado conforme
as verificações forem concluídas. YAML escrito não significa teste aprovado.

## Verificações já realizadas

| Comando / verificação | Resultado observado |
| --- | --- |
| `npm install` | Concluído sem force e sem legacy-peer-deps |
| `npx expo-doctor` | 20/20 verificações aprovadas após deduplicação |
| `npx expo prebuild --platform android` | Concluído; MainApplication.kt gerado |
| `npx tsc --noEmit` | Concluído também após a instrumentação E2E |
| `npm test -- --watch=false --testTimeout=30000` | 5 suítes, 10 testes aprovados também após a instrumentação E2E; não é Maestro |
| Bundle Metro Android | HTTP 200, 1.219 módulos compilados antes da instrumentação E2E |
| ADB | emulator-5554 conectado, arquitetura x86_64 |
| Identificador configurado | com.anonymous.cryptoalert em app.json e applicationId gerado; instalação ainda não confirmada |
| Maestro CLI | Release oficial 2.12.1 baixada localmente; `maestro --version` confirmou 2.12.1 |
| `maestro check-syntax <arquivo>` | Os quatro YAMLs retornaram OK individualmente; isso não é execução E2E |

## Bloqueio Android observado

O build inicial falhou no caminho com acento. Um mapeamento SUBST permitiu
avançar, mas não resolveu tudo: o autolinking normaliza dependências para o
caminho físico C:, enquanto o codegen usa S:, gerando erro de raízes diferentes.
Portanto, R:/S: com UTF-8 foi apenas solução parcial, não um build aprovado.
Gradle 9.0 foi executado com JDK 17 portátil. NDK 27.1.12297006, plataforma 36
e Build Tools 35 foram instalados automaticamente usando licenças já aceitas.

Foi criada uma cópia física em `C:\Users\cassi\ca-e2e-20261110`, sem mover o
workspace e sem copiar `.env`, `.git`, cobertura ou ferramentas portáteis.
Comando usado: `npx expo run:android --no-bundler`, com JDK 17, UTF-8,
`EXPO_PUBLIC_E2E=true` e Metro separado. Nessa cópia o codegen passou; o build
avançou para compilação Java/Kotlin e instalação de CMake. Isso ainda não
comprova conclusão do APK ou aprovação Maestro.

O usuário GitHub autenticado foi confirmado como `Cassiosampaio2016`. O remote
origin pertence a esse usuário e a API confirmou permissão de push. Nenhum
push foi realizado; depende de aprovação explícita.

## Estado dos cenários Maestro

| Fluxo | Estado | Confirmação dos seletores no dispositivo |
| --- | --- | --- |
| 01-lista | Pendente de execução | Pendente; IDs conferidos no código |
| 02-navegacao | Pendente de execução | Pendente; IDs conferidos no código |
| 03-conversao | Pendente de execução | Pendente; IDs conferidos no código |
| 04-criar-alerta | Pendente de execução | Pendente; IDs conferidos no código |

Os quatro arquivos passaram em `maestro check-syntax`, com retorno `OK`
individual para 01-lista, 02-navegacao, 03-conversao e 04-criar-alerta.
Isso valida o formato dos comandos, mas não a resolução dos IDs na tela.

Nenhuma captura de tela de aprovação foi fabricada. Os caminhos takeScreenshot
dos YAMLs são destinos previstos, não evidências já existentes.

## Situação às 12h42 (Brasília)

O APK ainda não estava instalado (`adb shell pm path com.anonymous.cryptoalert`
não retornou pacote). A tentativa mais recente usa tanto projeto quanto JDK em
caminhos físicos ASCII; seu log parcial real está em `android-build-parcial.log`. O build ainda
estava ativo, sem resultado final de aprovação. Houve falha anterior de
Prefab/CMake ao chamar Java pelo caminho com acento, antes dessa nova tentativa.
O JDK atual é `C:\Users\cassi\jdk-e2e-17\jdk-17.0.21+9`.

Os documentos, YAMLs, seletores e fixture foram commitados. Capturas do app e
aprovação dos fluxos continuam pendentes até a conclusão da instalação e da
execução. A prioridade de publicação não altera esse registro de fatos.

Uma cópia do log foi preservada às 12h50, antes da conclusão do APK. Ela é
evidência de tentativa de compilação, não de aprovação. O stream ativo
`android-build.log` fica ignorado pelo Git para não alterar continuamente o
snapshot revisado. Não há relatório JUnit ou captura do app aprovado até esse
registro. A conexão inicial `maestro hierarchy` também foi tentada, mas ainda
não forneceu uma hierarquia para confirmar seletores do aplicativo.

## Comandos planejados para execução real

O Metro precisa iniciar com `EXPO_PUBLIC_E2E=true` para os valores controlados.
Os fluxos usam `clearState: true`, apagando dados apenas do app no emulador de teste.

```powershell
adb devices
adb -s emulator-5554 shell pm path com.anonymous.cryptoalert
maestro --device emulator-5554 hierarchy
maestro --device emulator-5554 test --format junit --output evidencias/resultados.xml .maestro/
```

A confirmação ao vivo e os resultados deverão ser registrados aqui após a
execução. Não usar resultados Jest como substitutos.
