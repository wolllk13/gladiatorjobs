-- Crypto Payments Setup (USDT TRC20)
-- Run this script in your Supabase SQL Editor

-- 1. Add crypto wallet field to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS crypto_wallet_trc20 TEXT,
ADD COLUMN IF NOT EXISTS accepts_crypto BOOLEAN DEFAULT FALSE;

-- 2. Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  professional_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USDT',
  network TEXT NOT NULL DEFAULT 'TRC20',

  -- Payment details
  sender_wallet TEXT,
  recipient_wallet TEXT NOT NULL,
  tx_hash TEXT, -- Transaction hash from blockchain

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirming', 'completed', 'failed', 'refunded')),

  -- Metadata
  description TEXT,
  project_title TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- 3. Create indexes for faster queries
CREATE INDEX IF NOT EXISTS transactions_client_id_idx ON public.transactions(client_id);
CREATE INDEX IF NOT EXISTS transactions_professional_id_idx ON public.transactions(professional_id);
CREATE INDEX IF NOT EXISTS transactions_status_idx ON public.transactions(status);
CREATE INDEX IF NOT EXISTS transactions_tx_hash_idx ON public.transactions(tx_hash);
CREATE INDEX IF NOT EXISTS transactions_created_at_idx ON public.transactions(created_at DESC);

-- 4. Enable Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- 5. Create policies for transactions

-- Users can view their own transactions (as client or professional)
CREATE POLICY "Users can view own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = client_id OR auth.uid() = professional_id);

-- Only clients can create transactions
CREATE POLICY "Clients can create transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND user_type = 'client'
    )
  );

-- Users can update their own transactions (to add tx_hash or update status)
CREATE POLICY "Users can update own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = client_id OR auth.uid() = professional_id);

-- 6. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();

  -- Set completed_at when status becomes 'completed'
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger for updated_at
DROP TRIGGER IF EXISTS on_transactions_updated ON public.transactions;
CREATE TRIGGER on_transactions_updated
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.handle_transactions_updated_at();

-- 8. Create view for transaction summaries
CREATE OR REPLACE VIEW public.transaction_summaries AS
SELECT
  professional_id,
  COUNT(*) as total_transactions,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_transactions,
  SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as total_earned,
  AVG(CASE WHEN status = 'completed' THEN amount ELSE NULL END) as avg_transaction_amount
FROM public.transactions
GROUP BY professional_id;

-- Done! Crypto payments setup is complete
--
-- Next steps:
-- 1. Professionals should add their TRC20 wallet address in their profile
-- 2. Set accepts_crypto = true to enable crypto payments
-- 3. Clients can send USDT to the professional's wallet address
-- 4. After sending, client should provide the transaction hash
