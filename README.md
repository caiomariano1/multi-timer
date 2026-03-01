# Multi Timer

App de múltiplos cronômetros para desktop, inspirado no Relógio do Windows.

## Funcionalidades

- ✅ Múltiplos cronômetros simultâneos
- ✅ Label editável por cronômetro (nome da demanda)
- ✅ Iniciar / Pausar / Zerar cada cronômetro individualmente
- ✅ Modo flutuante (mini-timer sempre visível sobre outras janelas)
- ✅ Estado persistido no localStorage — sobrevive ao desligamento do PC
- ✅ Funciona 100% offline
- ✅ Formato: HH:MM:SS,cc

## Como usar

### Desenvolvimento

```bash
npm install
npm run dev
```

### Gerar instalador .exe (Windows)

```bash
npm run package
```

O instalador estará em `release/`.

## Estrutura

```
multi-timer/
├── electron/
│   ├── main.ts          # Processo principal do Electron
│   └── preload.ts       # Bridge Electron ↔ React
├── src/
│   ├── components/
│   │   ├── TimerCard.tsx        # Card de cada cronômetro
│   │   ├── MiniTimer.tsx        # Cronômetro flutuante
│   │   └── TitleBar.tsx         # Barra de título customizada
│   ├── hooks/
│   │   └── useTimer.ts          # Loop de tick com requestAnimationFrame
│   ├── store/
│   │   └── timersStore.ts       # Estado global (Zustand)
│   ├── utils/
│   │   ├── storage.ts           # localStorage helpers
│   │   └── formatTime.ts        # Formatação de ms → HH:MM:SS
│   ├── types/
│   │   └── timer.ts             # Interfaces TypeScript
│   ├── App.tsx
│   ├── main.tsx
│   └── styles.css
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── tsconfig.electron.json
```

## Como a persistência funciona

Cada timer armazena:
- `elapsedMs` — tempo acumulado em milissegundos
- `isRunning` — se estava rodando quando o app foi fechado
- `startedAt` — timestamp de quando o play foi acionado

Ao reabrir o app, se um timer estava rodando (`isRunning = true`), calcula:

```
tempoAtual = elapsedMs + (Date.now() - startedAt)
```

Isso faz o tempo continuar corretamente mesmo após desligar o PC.

## Evoluções futuras

- Exportar relatório de tempo por demanda (CSV/Excel)
- Backend .NET com banco de dados para histórico
- Integração com Jira/Azure DevOps para buscar nomes de cards automaticamente
