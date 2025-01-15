import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { UserProfile } from '../../types/supabase';

export function UserList() {
  const [users, setUsers] = React.useState<UserProfile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    setUsers(data || []);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Authenticated user:', user?.id);
    console.log(user);

    if (!user?.id) {
      console.error('No authenticated user found.');
      return;
    }

    // Perform deletion with an additional condition for the admin ID
    try {
      const { error: deleteError } = await supabase.rpc('delete_user_with_admin_check', {
        target_user_id: userId,
        deleter_user_id: user.id,
      });

      console.log(userId);

      if (deleteError) {
        console.error('Delete error:', deleteError.message);
        return;
      }

      console.log('User successfully deleted.');
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Caught error:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">Manage Users</h1>
        <button
          onClick={() => navigate('/dashboard/users/new')}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add User
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account Type
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
              <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                  {user.account_type}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(user.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-900 focus:outline-none"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}