# 5. Especificação da API

A comunicação será via biblioteca de cliente JavaScript do Supabase e Funções Serverless para lógica de negócio. A segurança será garantida por Políticas de Segurança em Nível de Linha (RLS) do PostgreSQL.

## Endpoints de Negócio (Funções Serverless)

- `POST /api/sales`: Para registrar vendas
- `POST /api/incomings/{id}/confirm`: Para confirmar recebimentos
- `POST /api/transfers`: Para criar transferências
- `POST /api/audits/{id}/submit`: Para enviar resultados de auditoria