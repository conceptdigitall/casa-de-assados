-- Supabase Schema for Couriers and Delivery Fees

-- 1. Couriers Table
CREATE TABLE public.couriers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.couriers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Couriers viewable by authenticated users" ON public.couriers FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Couriers insertable by authenticated users" ON public.couriers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Couriers updateable by authenticated users" ON public.couriers FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Couriers deletable by authenticated users" ON public.couriers FOR DELETE USING (auth.role() = 'authenticated');

-- 2. Delivery Fees Table
CREATE TABLE public.delivery_fees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.delivery_fees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Fees viewable by authenticated users" ON public.delivery_fees FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Fees insertable by authenticated users" ON public.delivery_fees FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Fees updateable by authenticated users" ON public.delivery_fees FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Fees deletable by authenticated users" ON public.delivery_fees FOR DELETE USING (auth.role() = 'authenticated');
