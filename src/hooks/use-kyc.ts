import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { KYCDocument, KYCStatus } from '@/types/kyc';
import { useAuth } from '@/context/AuthContext';

export const useKYC = () => {
  const { user } = useAuth();

  const {
    data: kycStatus,
    isLoading: isStatusLoading,
    refetch: refetchStatus,
  } = useQuery<KYCStatus>({
    queryKey: ['kycStatus', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('kyc_status')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      return data as KYCStatus;
    },
    enabled: !!user,
  });

  const {
    data: documents,
    isLoading: isDocumentsLoading,
    refetch: refetchDocuments,
  } = useQuery<KYCDocument[]>({
    queryKey: ['kycDocuments', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      return data as KYCDocument[];
    },
    enabled: !!user,
  });

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

      // Create document record
      const { error: docError } = await supabase.from('kyc_documents').insert({
        user_id: user.id,
        document_type: type,
        document_url: uploadData.path,
        status: 'pending',
      });

      if (docError) throw docError;

      // Update KYC status
      const statusUpdate =
        type === 'id_proof' ? { id_proof_status: 'pending' } : { address_proof_status: 'pending' };

      const { error: statusError } = await supabase
        .from('kyc_status')
        .update(statusUpdate)
        .eq('user_id', user.id);

      if (statusError) throw statusError;

      await Promise.all([refetchStatus(), refetchDocuments()]);
    },
  });

  return {
    kycStatus,
    documents,
    uploadDocument,
    isLoading: isStatusLoading || isDocumentsLoading,
  };
};
