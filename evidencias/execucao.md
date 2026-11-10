# Registro efetivo de execução

Data: 10/11/2026, horário de Brasília. Este documento será atualizado conforme
as verificações forem concluídas. YAML escrito não significa teste aprovado.

## Verificações já realizadas

| Comando / verificação | Resultado observado |
| --- | --- |
| `npm install` | Concluído sem force e sem legacy-peer-deps |
| `npx expo-doctor` | 20/20 verificações aprovadas após deduplicação |
| `npx expo prebuild --platform android` | Concluído; MainApplication.kt gerado |
| `npx tsc --noEmit` | Concluído antes da instrumentação E2E; revalidar após alterações |
| `npm test -- --watch=false --testTimeout=30000` | 5 suítes, 10 testes aprovados antes da instrumentação E2E; não é Maestro |
| Bundle Metro Android | HTTP 200, 1.219 módulos compilados antes da instrumentação E2E |
| ADB | emulator-5554 conectado, arquitetura x86_64 |
| Identificador configurado | com.anonymous.cryptoalert em app.json e applicationId gerado; instalação ainda não confirmada |

## Bloqueio Android observado

O build inicial falhou no caminho com acento. Um mapeamento SUBST permitiu
avançar, mas não resolveu tudo: o autolinking normaliza dependências para o
caminho físico C:, enquanto o codegen usa S:, gerando erro de raízes diferentes.
Portanto, R:/S: com UTF-8 foi apenas solução parcial, não um build aprovado.
Gradle 9.0 foi executado com JDK 17 portátil. NDK 27.1.12297006, plataforma 36
e Build Tools 35 foram instalados automaticamente usando licenças já aceitas.

## Estado dos cenários Maestro

| Fluxo | Estado | Confirmação dos seletores no dispositivo |
| --- | --- | --- |
| 01-lista | Pendente de execução | Pendente; IDs conferidos no código |
| 02-navegacao | Pendente de execução | Pendente; IDs conferidos no código |
| 03-conversao | Pendente de execução | Pendente; IDs conferidos no código |
| 04-criar-alerta | Pendente de execução | Pendente; IDs conferidos no código |

Nenhuma captura de tela de aprovação foi fabricada. Os caminhos takeScreenshot
dos YAMLs são destinos previstos, não evidências já existentes.

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
