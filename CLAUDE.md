# Multi Timer — Contexto do Projeto

## O que é

Aplicação desktop de múltiplos cronômetros simultâneos, inspirada no Relógio do Windows.
Permite criar, nomear, pausar, zerar e monitorar vários cronômetros ao mesmo tempo.
Cada cronômetro pode ser destacado em uma janela flutuante sempre visível (mini modo).

## Stack tecnológico

| Camada | Tecnologia |
|---|---|
| Desktop runtime | Electron 28 |
| Build tool | electron-vite 2 + Vite 7 |
| UI | React 18 + TypeScript 5 |
| Estado global | Zustand 4 |
| Persistência | localStorage (via utils/storage.ts) |
| Geração de IDs | uuid 9 |
| Ícones | react-icons 5 |
| Empacotamento | electron-builder 24 (Windows NSIS) |
| Fonte UI | DM Sans, DM Mono (Google Fonts) |
| Fonte display | Segoe UI Variable Display (sistema Windows) |

## Comandos

```bash
yarn dev        # Inicia app em modo desenvolvimento (hot reload)
yarn build      # Compila TypeScript e faz bundle (saída: out/)
yarn package    # yarn build + gera instalador .exe (saída: release/)
yarn preview    # Visualiza o build de produção
```

## Arquitetura — 3 processos Electron

```
main/index.ts          ← Processo principal Node.js
  └── Gerencia janelas (BrowserWindow)
  └── IPC handlers (open-mini, close-mini, etc.)

preload/index.ts       ← Bridge segura (contextIsolation)
  └── Expõe window.electronAPI para o renderer

renderer/              ← Processo renderer (React + Vite)
  └── App.tsx detecta ?mini=true na URL e renderiza modo mini ou completo
```

## Estrutura de diretórios

```
src/
├── main/
│   └── index.ts              # Janelas, IPC, ciclo de vida do app
├── preload/
│   └── index.ts              # window.electronAPI (bridge IPC)
└── renderer/
    ├── main.tsx              # Entry point React
    ├── App.tsx               # Router: modo mini vs. completo
    ├── index.html            # Template HTML do renderer
    ├── styles.css            # Todos os estilos (BEM-like, sem CSS modules)
    ├── types/
    │   └── timer.ts          # Interface Timer, ElectronAPI, Window global
    ├── utils/
    │   ├── formatTime.ts     # formatTime(ms) → {h,min,seg,cs}; getElapsed(timer)
    │   └── storage.ts        # saveTimers / loadTimers / clearTimers (localStorage)
    ├── hooks/
    │   └── useTimer.ts       # useTimerTick(timer) — atualização via requestAnimationFrame
    ├── store/
    │   └── timersStore.ts    # Zustand store: add/remove/start/pause/reset/rename
    └── components/
        ├── TitleBar.tsx      # Barra de título customizada (frameless)
        ├── TimerCard.tsx     # Card de cronômetro completo (main window)
        └── MiniTimer.tsx     # Versão flutuante reduzida
```

## Modelo de dados

```typescript
interface Timer {
  id: string          // UUID
  label: string       // Nome editável pelo usuário
  elapsedMs: number   // Tempo acumulado em ms (quando pausado)
  isRunning: boolean
  startedAt: number | null  // Date.now() do último play
  createdAt: number
}
// Tempo real = elapsedMs + (Date.now() - startedAt) quando isRunning
```

## IPC — Comunicação entre processos

| Evento IPC | Sentido | O que faz |
|---|---|---|
| `open-mini` | renderer → main | Abre janela flutuante, minimiza main |
| `close-mini` | renderer → main | Fecha flutuante, restaura main |
| `expand-mini` | renderer → main | Fecha flutuante, restaura main |
| `minimize-app` | renderer → main | Minimiza main window |
| `maximize-app` | renderer → main | Toggle maximizar/restaurar |
| `close-app` | renderer → main | Encerra o app |
| `mini-closed` | main → renderer | Notifica quando flutuante é fechada |

## Fluxo do modo mini (janela flutuante)

1. Usuário clica no ícone de minimizar no `TimerCard`
2. `window.electronAPI.openMini(timerId, label)` dispara IPC `open-mini`
3. Main cria `BrowserWindow` 220×155 com `?mini=true&timerId=...&label=...`
4. Main minimiza a janela principal (mantém ícone na taskbar)
5. `App.tsx` detecta `?mini=true` e renderiza `MiniTimer`
6. `MiniTimer` faz `loadFromStorage()` para sincronizar estado
7. Ao restaurar via taskbar: evento `restore` fecha todas as mini janelas

## Padrões e convenções

- **CSS:** Classes BEM-like sem módulos (`.timer-card__display`, `.mini-timer__controls`)
- **Sem CSS modules:** Arquivo único `styles.css` com todas as classes
- **Estado:** Zustand sem selectors complexos — `useTimerStore()` direto nos componentes
- **Persistência automática:** Toda ação no store chama `saveTimers()` imediatamente
- **Renderização em tempo real:** `requestAnimationFrame` via `useTimerTick` (60fps)
- **Frameless window:** `frame: false` + `titleBarStyle: hidden` — UI customizada para controles de janela
- **Segurança Electron:** `contextIsolation: true`, `nodeIntegration: false`, API exposta via `contextBridge`

## Variáveis CSS relevantes

```css
--accent: #0078d4          /* Azul primário (botão play pausado) */
--running: #107c10         /* Verde (botão play rodando) */
--font-display: "Segoe UI Variable Display", "Segoe UI Light", system-ui
--font-ui: "DM Sans", sans-serif
--font-mono: "DM Mono", monospace
```
