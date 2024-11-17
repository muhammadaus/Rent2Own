export interface Agreement {
  id: number;
  borrower: string;
  lender: string;
  nftContract: string;
  nftId: string;
  monthlyPayment: string;
  totalPrice: string;
  totalPaid: string;
  totalRemaining: string;
  nextPaymentDue: string;
  isActive: boolean;
}