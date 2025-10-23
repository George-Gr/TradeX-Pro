import { useKYC } from '../../hooks/use-kyc';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useToast } from '../../hooks/use-toast';
import { toast } from '../../utils/toast';
import { useState } from 'react';

const KYCVerification = () => {
  const { kycStatus, documents, uploadDocument, isLoading } = useKYC();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [documentType, setDocumentType] = useState<'id_proof' | 'address_proof'>('id_proof');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      await uploadDocument.mutateAsync({
        file: selectedFile,
        type: documentType,
      });

      toast({
        title: 'Document uploaded successfully',
        description: 'Your document has been submitted for verification.',
      });

      setSelectedFile(null);
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>KYC Verification</CardTitle>
          <CardDescription>Submit your documents for identity verification</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">ID Proof Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <span
                    className={`font-semibold capitalize ${
                      kycStatus?.id_proof_status === 'approved'
                        ? 'text-green-500'
                        : kycStatus?.id_proof_status === 'rejected'
                          ? 'text-red-500'
                          : 'text-yellow-500'
                    }`}
                  >
                    {kycStatus?.id_proof_status || 'Not Submitted'}
                  </span>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Address Proof Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <span
                    className={`font-semibold capitalize ${
                      kycStatus?.address_proof_status === 'approved'
                        ? 'text-green-500'
                        : kycStatus?.address_proof_status === 'rejected'
                          ? 'text-red-500'
                          : 'text-yellow-500'
                    }`}
                  >
                    {kycStatus?.address_proof_status || 'Not Submitted'}
                  </span>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Input
                  type="radio"
                  id="id_proof"
                  name="document_type"
                  value="id_proof"
                  checked={documentType === 'id_proof'}
                  onChange={(e) => setDocumentType(e.target.value as 'id_proof' | 'address_proof')}
                />
                <label htmlFor="id_proof">ID Proof</label>
                <Input
                  type="radio"
                  id="address_proof"
                  name="document_type"
                  value="address_proof"
                  checked={documentType === 'address_proof'}
                  onChange={(e) => setDocumentType(e.target.value as 'id_proof' | 'address_proof')}
                />
                <label htmlFor="address_proof">Address Proof</label>
              </div>

              <Input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFileChange} />

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full"
              >
                {uploading ? 'Uploading...' : 'Upload Document'}
              </Button>
            </div>

            {documents && documents.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Submitted Documents</h3>
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex justify-between items-center p-2 bg-secondary rounded"
                    >
                      <span className="capitalize">{doc.document_type.replace('_', ' ')}</span>
                      <span
                        className={`capitalize ${
                          doc.status === 'approved'
                            ? 'text-green-500'
                            : doc.status === 'rejected'
                              ? 'text-red-500'
                              : 'text-yellow-500'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KYCVerification;
