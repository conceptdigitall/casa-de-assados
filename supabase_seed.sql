-- Supabase Data Seed for Casa de Carnes

INSERT INTO public.products (name, description, price, category, image, stock, min_stock)
VALUES 
    ('Frango Assado Completo', 'Frango suculento assado na brasa, acompanha farofa e batatas.', 45.00, 'Assados', 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=600&auto=format&fit=crop', 20, 5),
    ('Costela Suína BBQ', 'Costela de porco defumada com molho barbecue caseiro.', 55.00, 'Assados', '/images/costela.png', 15, 5),
    ('Maionese da Casa', 'Porção de 500g da nossa tradicional salada de maionese.', 15.00, 'Acompanhamentos', '/images/maionese.png', 30, 10),
    ('Coca-Cola 2L', 'Refrigerante gelado para acompanhar.', 12.00, 'Bebidas', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop', 50, 10),
    ('Marmita Econômica', 'Arroz, feijão, frango assado e batata.', 18.00, 'Marmita', 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?q=80&w=600&auto=format&fit=crop', 40, 5);
