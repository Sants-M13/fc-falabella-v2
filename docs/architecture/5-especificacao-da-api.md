# 5. Especificação da API

A comunicação será via biblioteca de cliente JavaScript do Supabase e Funções Serverless para lógica de negócio. A segurança será garantida por Políticas de Segurança em Nível de Linha (RLS) do PostgreSQL.

## Endpoints de Negócio (Funções Serverless)

- `POST /api/sales`: Para registrar vendas
- `POST /api/incomings/{id}/confirm`: Para confirmar recebimentos
- `POST /api/transfers`: Para criar transferências
- `POST /api/audits/{id}/submit`: Para enviar resultados de auditoria

## Endpoints de Gestão de Produtos (Story 1.4-1.5)

### Curvas de Tamanho (Size Curves)
- `GET /api/size-curves`: Listar todas as curvas de tamanho
- `POST /api/size-curves`: Criar nova curva de tamanho
- `PUT /api/size-curves/{id}`: Atualizar curva de tamanho
- `DELETE /api/size-curves/{id}`: Deletar curva de tamanho
- `GET /api/size-curves/{id}`: Obter curva específica

### Produtos Aprimorados
- `GET /api/products`: Listar produtos (inclui image_url, size_curve_id)
- `POST /api/products`: Criar produto (suporte a imagem e curva)
- `PUT /api/products/{id}`: Atualizar produto
- `DELETE /api/products/{id}`: Deletar produto
- `POST /api/products/{id}/generate-variants`: Gerar variantes baseadas em curva

### Variantes com Código de Barras
- `GET /api/variants`: Listar variantes (inclui barcode)
- `POST /api/variants`: Criar variante (com barcode opcional)
- `PUT /api/variants/{id}`: Atualizar variante
- `DELETE /api/variants/{id}`: Deletar variante
- `GET /api/variants/by-barcode/{barcode}`: Buscar por código de barras