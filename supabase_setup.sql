-- Supabase Schema for Casa de Carnes

-- 1. Profiles Table (Extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'employee', -- 'admin' or 'employee'
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS e Políticas para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Products Table
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Todos',
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  stock INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 5,
  image TEXT,
  barcode TEXT,
  unit_type TEXT DEFAULT 'unit',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins and Employees can update products" ON public.products FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'employee'))
);
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 3. Orders Table
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number SERIAL UNIQUE, -- Useful for friendly IDs like #101
  customer_name TEXT,
  customer_phone TEXT,
  customer_cpf TEXT,
  type TEXT DEFAULT 'in_person', -- 'in_person', 'delivery'
  status TEXT DEFAULT 'Finalizado', -- 'Pendente', 'Finalizado', 'Cancelado'
  payment_method TEXT DEFAULT 'dinheiro',
  total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Orders are viewable by authenticated users" ON public.orders FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update orders" ON public.orders FOR UPDATE USING (auth.role() = 'authenticated');

-- 4. Order Items Table
CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Order items viewable by authenticated" ON public.order_items FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Order items insertable by authenticated" ON public.order_items FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 5. Inventory Logs Table
CREATE TABLE public.inventory_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  change_amount INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'sale', 'manual_adjustment'
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.inventory_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Logs viewable by authenticated" ON public.inventory_logs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Logs insertable by authenticated" ON public.inventory_logs FOR INSERT WITH CHECK (auth.role() = 'authenticated');


-- 6. RPC Function for Safe POS Order Creation
-- Ensures stock decreases transactionally when creating an order
CREATE OR REPLACE FUNCTION process_pos_order(
  p_customer_name TEXT,
  p_customer_phone TEXT,
  p_customer_cpf TEXT,
  p_type TEXT,
  p_status TEXT,
  p_payment_method TEXT,
  p_total DECIMAL,
  p_items JSONB -- [{ "product_id": "uuid", "quantity": 1, "unit_price": 10.50 }]
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_order_id UUID;
  v_item RECORD;
BEGIN
  -- Insert into orders
  INSERT INTO public.orders (customer_name, customer_phone, customer_cpf, type, status, payment_method, total)
  VALUES (p_customer_name, p_customer_phone, p_customer_cpf, p_type, p_status, p_payment_method, p_total)
  RETURNING id INTO v_order_id;
  
  -- Loop through items JSON array
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    -- Insert into order items
    INSERT INTO public.order_items (order_id, product_id, quantity, unit_price)
    VALUES (
      v_order_id, 
      (v_item.value->>'product_id')::UUID, 
      (v_item.value->>'quantity')::INTEGER, 
      (v_item.value->>'unit_price')::DECIMAL
    );
    
    -- Update product stock
    UPDATE public.products 
    SET stock = stock - (v_item.value->>'quantity')::INTEGER
    WHERE id = (v_item.value->>'product_id')::UUID;
    
    -- Insert into inventory logs
    INSERT INTO public.inventory_logs (product_id, change_amount, type, reason)
    VALUES (
      (v_item.value->>'product_id')::UUID, 
      -(v_item.value->>'quantity')::INTEGER, 
      'sale', 
      'Venda pelo PDV'
    );
  END LOOP;

  RETURN v_order_id;
END;
$$;
