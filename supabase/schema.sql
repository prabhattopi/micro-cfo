-- ==============================================================================
-- MicroCFO: Student Side-Hustle Database Schema (PostgreSQL on Supabase)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Side-Hustle Projects Table
CREATE TABLE IF NOT EXISTS public.hustles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g. "Campus Bakery", "Freelance Editing", "Thrift Reselling"
    selling_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    variable_cost_per_unit NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    fixed_monthly_costs NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    target_monthly_units INTEGER NOT NULL DEFAULT 10,
    hours_per_unit NUMERIC(5, 2) NOT NULL DEFAULT 1.00,
    platform_take_rate NUMERIC(5, 4) NOT NULL DEFAULT 0.05, -- e.g. 5% platform cut (Etsy, Stripe, Instagram)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Side-Hustle Transactions / Expense Ledger
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hustle_id UUID REFERENCES public.hustles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    type TEXT CHECK (type IN ('INCOME', 'FIXED_EXPENSE', 'VARIABLE_EXPENSE')) NOT NULL,
    receipt_url TEXT,
    date DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Row Level Security (RLS)
ALTER TABLE public.hustles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Allow users to manage their own records
CREATE POLICY "Users can manage own hustles"
    ON public.hustles
    FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own transactions"
    ON public.transactions
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.hustles 
            WHERE public.hustles.id = public.transactions.hustle_id 
            AND public.hustles.user_id = auth.uid()
        )
    );
