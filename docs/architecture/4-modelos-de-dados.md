# 4. Modelos de Dados

*Estruturas de tabelas para o banco de dados PostgreSQL no Supabase*

- **profiles (Usuários)**: id, email, role, store_id (FK para stores)
- **stores (Lojas)**: id, name, max_skus, max_brands, max_inventory
- **products (Produtos - Pai)**: id, sku_parent, brand, style, price, cost (opcional), image_url, size_curve_id (FK para size_curves)
- **variants (Variações - Filho)**: id, product_id (FK para products), sku_child, size, barcode (único opcional)
- **size_curves (Curvas de Tamanho)**: id, name (único), sizes[] (array), description, created_at, updated_at
- **inventory (Inventário)**: id, store_id (FK), variant_id (FK), quantity
- **transactions (Transações)**: id, variant_id (FK), store_id (FK), user_id (FK), transaction_type, quantity_change
- **incomings (Ingressos)**: id, store_id_destination, status, etc. (com tabela incoming_items)
- **audits (Auditorias)**: id, store_id, status, scope, etc. (com tabela audit_items)