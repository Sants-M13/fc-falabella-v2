-- Create test store
INSERT INTO stores (id, name, max_skus, max_brands, max_inventory) 
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Loja Teste SP', 1000, 50, 10000)
ON CONFLICT (id) DO NOTHING;
