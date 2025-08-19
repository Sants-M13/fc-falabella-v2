# 2. Arquitetura da Informação (IA)

## Mapa do Site / Inventário de Telas

### Painel do Administrador (Desktop):

```mermaid
graph TD
    subgraph Painel do Administrador
        A[Login] --> B(Dashboard Principal);
        B --> C[Gestão de Lojas];
        B --> D[Gestão de Produtos];
        B --> E[Gestão de Usuários];
        B --> F[Movimentações];
        B --> G[Conciliação de Vendas];
        B --> H[Auditorias];
        F --> F1[Entradas];
        F --> F2[Transferências];
        F --> F3[Saídas por Ajuste];
    end
```

### Web App da Promotora (Mobile):

```mermaid
graph TD
    subgraph Web App da Promotora
        P_A[Login] --> P_B(Tela Principal);
        P_B --> P_C[Registrar Venda];
        P_B --> P_D[Confirmar Recebimento];
        P_B --> P_E[Realizar Auditoria];
        P_B --> P_F[Consultar Estoque];
        P_B --> P_G[Meu Histórico];
    end
```

## Estrutura de Navegação (Painel do Administrador)

- **Navegação Primária**: Barra lateral fixa (Dashboard, Vendas, Inventário, Auditorias).
- **Navegação Secundária**: Menu "Configurações" (Lojas, Produtos, Usuários).
- **Breadcrumbs**: Serão usados em todas as telas internas (ex: Painel > Lojas > Editar Loja XYZ).
