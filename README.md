# Notion Board (Hybrid Productivity Platform)

> A hybrid workspace platform combining **Notion's** structured relational document engine with **Trello's** spatial drag-and-drop Kanban canvas and **Butler's** visual automation engine.

---

## 🚀 Features

- 🗂️ **Dual-Pane & Slide-Over 3-Pane Architecture**:
  - Left navigation tree with multiple boards & canvases.
  - Center drag-and-drop Kanban canvas with live column WIP limit indicators.
  - Right slide-over deep-dive card canvas for rich document editing without losing board context.
- 📝 **Rich Block-Based Document Editor**:
  - Slash commands (`/`): Headings (H1, H2, H3), Interactive Checklists (`/todo`), Code Blocks (`/code`), Toggle Lists (`/toggle`), Callouts (`/callout`), Quotes, and Dividers.
- 📊 **Multi-View Engine**:
  - **Kanban Board**: Tactile drag-and-drop card & column reordering.
  - **Relational Table View**: Spreadsheet-style multi-property editing with real-time progress rollups.
  - **List View**: Rapid execution task lists with priority and date indicators.
- ⚡ **Butler Visual Automation Engine**:
  - No-code trigger & action builder (*When card is moved to Done -> Set Completed Date to NOW & check all to-do tasks*).
  - Custom Butler action buttons inside cards.
  - Confetti celebration on completion.
- 💾 **Local-First Persistence & Export**:
  - Zero database configuration required for instant Vercel deployment.
  - 1-click JSON Workspace Export and Import.

---

## 🛠️ Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: GitHub Repository Push
1. Push this project to your GitHub repository.
2. Import the repository into [Vercel Dashboard](https://vercel.com/new).
3. Framework Preset: **Next.js**
4. Click **Deploy**.

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

