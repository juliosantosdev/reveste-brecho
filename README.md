# 🌿 ReVeste — Moda Circular Colaborativa

> **Atividade de Extensão Universitária (UNIASSELVI)** — Curso Superior de Tecnologia em **Análise e Desenvolvimento de Sistemas (ADS)**  
> **Título do Projeto:** *Solução colaborativa em um cenário de moda sustentável - brechó*  
> **Modalidade:** Prestação de Serviços Técnicos Especializados | **ODS ONU:** Objetivo 12 (Consumo e Produção Responsáveis)

---

## 📖 Sobre o Projeto

O **ReVeste** é uma aplicação web responsiva com experiência mobile-first desenvolvida como atividade extensionista para apoiar brechós locais e comunitários na transição digital, fortalecendo a **moda lenta (*slow fashion*)** e a **economia circular**.

Diferente da indústria tradicional de *fast fashion*, o sistema conecta compradores e vendedores da comunidade em um ambiente colaborativo, transparentemente engajado na redução de resíduos têxteis e na economia de recursos hídricos por meio do reaproveitamento de vestuário.

---

## 🧠 Fundamentação Teórica e Metodologia Aplicada

O desenvolvimento seguiu as etapas práticas e metodológicas definidas no plano de extensão:

### 1. Modelo 3C de Colaboração (Comunicação, Coordenação e Cooperação)
* **Comunicação:** Chat integrado por peça entre comprador e brechó para tirar dúvidas sobre medidas, tecido e estado de conservação antes da reserva.
* **Coordenação:** Fluxo visual de pedidos em **Kanban** (*Disponível → Reservado pelo Cliente → Aguardando Retirada → Concluído/Vendido*), controle de estoque em tempo real e reorganização da vitrine via *Drag and Drop*.
* **Cooperação:** Canal aberto para **solicitações de desapego da comunidade** (onde membros enviam peças paradas no armário para avaliação do brechó) e mural de **reputação e avaliações** comunitárias.

### 2. Design Thinking (DT) & Engenharia de Requisitos
* **Imersão e Ideação:** Levantamento de dores reais de compradores e gestores de brechó, definição de personas, mapa de jornada do usuário e prototipação de baixa fidelidade.
* **Validação Iterativa:** Entregas incrementais validadas com foco em simplicidade operacional para pequenos empreendedores e transparência para consumidores conscientes.

### 3. UX/UI, Material Design e Heurísticas de Nielsen
* **Visibilidade do status do sistema:** Badges dinâmicas de disponibilidade em cada peça, indicadores de impacto ambiental (litros de água economizados e gramas de resíduo evitado) e feedbacks instantâneos via *Snackbars*.
* **Correspondência entre o sistema e o mundo real:** Vitrine organizada em estilo *lookbook* com pareamento vertical de peças (parte superior e inferior) preservado tanto no mobile quanto no desktop.
* **Controle e liberdade do usuário / Prevenção de erros:** Diálogos de confirmação antes de ações destrutivas (exclusão de peças), autenticação protegida para o painel administrativo e opção de desfazer reservas.
* **Design Mobile-First e Minimalista:** Navegação por **barra inferior flutuante animada (*Floating Bottom Navigation*)** no celular, cards limpos com revelação progressiva (*hover* no desktop e toque interativo no mobile) e carrossel editorial de destaques.

---

## 🛠️ Stack Tecnológica e Bibliotecas

### Linguagens e Core
* **TypeScript (`5.7.3`)** — Tipagem estática para modelos de domínio (`Product`, `OrderStatus`, `ChatMessage`, `DesapegoRequest`, `Review`) e gerenciamento de estado.
* **JavaScript (ES2022+) / HTML5 / CSS3** — Base estrutural, semântica e estilização responsiva.

### Frontend, Estilização & UI/UX
* **Next.js (`16.3.0` — App Router)** — Framework React para renderização híbrida, roteamento e otimização de performance.
* **React (`19`)** — Arquitetura modular baseada em componentes reutilizáveis e gerenciamento de estado global via Context API (`lib/store.tsx`).
* **Material UI (`@mui/material` `9.3.1` + `@emotion/react` / `@emotion/styled`)** — Implementação dos padrões do **Material Design** (Cards, Dialogs, Chips, ToggleButtons, Snackbars, Grid responsivo e ícones `@mui/icons-material`).
* **Tailwind CSS (`4.3.3`) + `tw-animate-css` + `clsx` / `tailwind-merge`** — Utilitários de layout, animações fluidas e composição dinâmica de classes.
* **Base UI (`@base-ui/react` `1.5.0`) + `shadcn/ui` + `Lucide React`** — Primitivos acessíveis e suporte a componentes modulares.
* **@dnd-kit (`core` `6.3.1`, `sortable` `10.0.0`, `utilities` `3.2.2`)** — Reordenação interativa da vitrine via *Drag and Drop* com persistência automática no banco de dados.

### Backend as a Service (BaaS) & Observabilidade
* **Supabase (`@supabase/supabase-js` `2.112.3`)**
  * **PostgreSQL:** Persistência relacional das tabelas `produtos`, `mensagens`, `avaliacoes` e `solicitacoes_desapego`.
  * **Supabase Auth:** Autenticação por e-mail/senha para acesso restrito ao painel administrativo do brechó.
  * **Supabase Storage:** Armazenamento em nuvem e upload direto de fotografias reais das peças.
* **Vercel Analytics (`1.6.1`)** — Telemetria e métricas de acesso em produção.

---

## 📂 Estrutura de Pastas

```text
brecho-sustentavel/
├── app/                          # Rotas e layout principal (Next.js App Router)
├── components/
│   ├── admin/                    # Painel do brechó, métricas, Kanban e formulário de cadastro
│   ├── community/                # Avaliações da comunidade e caixa de solicitações de desapego
│   ├── home/                     # Banner editorial, grid pareado e cards interativos
│   ├── header.tsx                # Cabeçalho com busca, filtros por categoria e login admin
│   ├── mobile-bottom-nav.tsx     # Barra de navegação inferior flutuante animada (mobile)
│   └── product-detail-dialog.tsx # Modal de detalhes, impacto ambiental, chat e reserva
├── lib/
│   ├── store.tsx                 # Estado global reativo e integração CRUD com Supabase
│   ├── supabase.ts               # Cliente de conexão com Supabase
│   └── types.ts                  # Interfaces e tipagens TypeScript
└── public/                       # Identidade visual e ativos estáticos