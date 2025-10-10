import { useKYC } from '@/hooks/use-kyc';
import KYCVerification from '@/components/kyc/KYCVerification';
import WalletDashboard from '@/components/wallet/WalletDashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Wallet = () => {
  const { kycStatus } = useKYC();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Wallet & Verification</h1>

      <Tabs defaultValue={kycStatus?.is_verified ? 'wallet' : 'kyc'}>
        <TabsList>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
          <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="wallet">
          {kycStatus?.is_verified ? (
            <WalletDashboard />
          ) : (
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-2">Complete KYC First</h2>
              <p className="text-muted-foreground">
                Please complete your KYC verification to access the wallet features.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="kyc">
          <KYCVerification />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Wallet;
