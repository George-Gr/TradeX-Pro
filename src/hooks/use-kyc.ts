import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { KYCDocument, KYCStatus } from '@/types/kyc';
import { useAuth } from '@/context/AuthContext';

export const useKYC = () => {
  const { user } = useAuth();

  // Mock data for now
  const kycStatus: KYCStatus | undefined = undefined;
  const documents: KYCDocument[] = [];

  const uploadDocument = useMutation({
    mutationFn: async ({ file, type }: { file: File; type: 'id_proof' | 'address_proof' }) => {
      if (!user) throw new Error('User not authenticated');

      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${type}_${Date.now()}.${fileExt}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('kyc_documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      return uploadData;
    },
  });

  return {
    kycStatus,
    documents,
    uploadDocument,
    isLoading: false,
  };
};
