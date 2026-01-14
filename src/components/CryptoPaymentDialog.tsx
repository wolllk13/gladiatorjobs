import { useState, useEffect } from 'react';
import { Wallet, Copy, Check, ExternalLink, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface CryptoPaymentDialogProps {
  professionalId: string;
  professionalName: string;
  walletAddress: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CryptoPaymentDialog = ({
  professionalId,
  professionalName,
  walletAddress,
  open,
  onOpenChange,
}: CryptoPaymentDialogProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

  const [formData, setFormData] = useState({
    amount: '',
    txHash: '',
    description: '',
  });

  useEffect(() => {
    if (open && walletAddress) {
      generateQRCode();
    }
  }, [open, walletAddress]);

  const generateQRCode = () => {
    // Using QR Code API service
    const qrData = `tron:${walletAddress}`;
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrData)}`;
    setQrCodeUrl(qrApiUrl);
  };

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Wallet address copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to copy address',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('You must be logged in to make a payment');
      }

      const { error } = await supabase.from('transactions').insert({
        client_id: user.id,
        professional_id: professionalId,
        amount: parseFloat(formData.amount),
        currency: 'USDT',
        network: 'TRC20',
        recipient_wallet: walletAddress,
        tx_hash: formData.txHash || null,
        description: formData.description || null,
        status: formData.txHash ? 'confirming' : 'pending',
      });

      if (error) throw error;

      toast({
        title: 'Payment initiated!',
        description: formData.txHash
          ? 'Your transaction is being confirmed'
          : 'Please complete the payment and submit the transaction hash',
      });

      setFormData({ amount: '', txHash: '', description: '' });
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create transaction',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl glass border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text flex items-center gap-2">
            <Wallet className="w-6 h-6" />
            Pay with Crypto (USDT TRC20)
          </DialogTitle>
          <DialogDescription>
            Send USDT on the TRC20 network to {professionalName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* QR Code Section */}
          <Card className="p-6 glass border-border/50">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Scan QR Code or Copy Address
              </h3>

              {qrCodeUrl && (
                <div className="inline-block p-4 bg-white rounded-lg mb-4">
                  <img
                    src={qrCodeUrl}
                    alt="Wallet QR Code"
                    className="w-64 h-64"
                  />
                </div>
              )}

              {/* Wallet Address */}
              <div className="flex items-center gap-2 p-3 glass border border-border/50 rounded-lg">
                <code className="flex-1 text-sm font-mono text-foreground break-all">
                  {walletAddress}
                </code>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={handleCopyAddress}
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Network: <span className="font-semibold text-primary">TRC20 (TRON)</span>
              </p>
              <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-2">
                ⚠️ Only send USDT on TRC20 network. Sending other tokens or using other networks may result in loss of funds.
              </p>
            </div>
          </Card>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="amount" className="text-sm font-medium text-foreground">
                Amount (USDT) *
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="100.00"
                className="glass border-border/50 mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="txHash" className="text-sm font-medium text-foreground">
                Transaction Hash (Optional)
              </Label>
              <Input
                id="txHash"
                type="text"
                value={formData.txHash}
                onChange={(e) => setFormData({ ...formData, txHash: e.target.value })}
                placeholder="Enter transaction hash after payment..."
                className="glass border-border/50 mt-2 font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                You can submit the transaction hash now or later
              </p>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-foreground">
                Description / Project Title (Optional)
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="What is this payment for?"
                className="glass border-border/50 mt-2 min-h-[80px]"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1 glass border-border/50"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:shadow-lg text-primary-foreground"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Transaction'
                )}
              </Button>
            </div>
          </form>

          {/* Help Text */}
          <Card className="p-4 glass border-border/50 bg-blue-500/5">
            <h4 className="text-sm font-semibold text-foreground mb-2">How to pay:</h4>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Copy the wallet address or scan the QR code</li>
              <li>Open your crypto wallet (Trust Wallet, TronLink, etc.)</li>
              <li>Send USDT on TRC20 network to the address above</li>
              <li>Copy the transaction hash from your wallet</li>
              <li>Return here and submit the transaction details</li>
            </ol>
            <a
              href="https://tronscan.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-xs text-primary hover:underline mt-3"
            >
              View transactions on TronScan
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CryptoPaymentDialog;
