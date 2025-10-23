import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { AdminUserProfile } from '../../types/admin';
import { useState } from 'react';

interface UsersTableProps {
  users: AdminUserProfile[];
  onUpdateStatus: (userId: string, action: 'suspend' | 'activate') => void;
}

export const UsersTable = ({ users, onUpdateStatus }: UsersTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter((user) => {
    const email = user.email ?? '';
    const name = user.full_name ?? '';
    return (
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
        <Input
          placeholder="Search users..."
          className="w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>KYC Status</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.full_name ?? '—'}</TableCell>
                <TableCell>{user.email ?? '—'}</TableCell>
                <TableCell>{user.country ?? '—'}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.kyc_status?.is_verified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {user.kyc_status?.is_verified ? 'Verified' : 'Pending'}
                  </span>
                </TableCell>
                <TableCell>${(user.wallet_balance?.available_balance ?? 0).toFixed(2)}</TableCell>
                <TableCell>
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    onClick={() =>
                      onUpdateStatus(user.id, user.kyc_status?.is_verified ? 'suspend' : 'activate')
                    }
                  >
                    {user.kyc_status?.is_verified ? 'Suspend' : 'Activate'}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
