import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { UserProfile } from '../../types/supabase';
import toast, { Toaster } from 'react-hot-toast';

// Reusable Modal Component
function ConfirmationModal({ isOpen, onClose, onConfirm, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Confirm Deletion</h2>
        <p className="text-gray-700 mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export function UserList() {
  const [users, setUsers] = React.useState<UserProfile[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [userToDelete, setUserToDelete] = React.useState<string | null>(null);

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users.');
      return;
    }

    setUsers(data || []);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  // Handle opening the delete confirmation modal
  const openDeleteModal = (userId: string) => {
    setUserToDelete(userId);
    setIsDeleteModalOpen(true);
  };

  // Handle closing the delete confirmation modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  // Handle confirming the deletion
  const confirmDelete = async () => {
    if (!userToDelete) return;

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.id) {
      console.error('No authenticated user found.');
      toast.error('No authenticated user found.');
      return;
    }

    // Perform deletion with an additional condition for the admin ID
    try {
      const { error: deleteError } = await supabase.rpc('delete_user_with_admin_check', {
        target_user_id: userToDelete,
        deleter_user_id: user.id,
      });

      if (deleteError) {
        console.error('Delete error:', deleteError.message);
        toast.error('Failed to delete user.');
        return;
      }

      toast.success('User deleted successfully.');
      fetchUsers(); // Refresh the user list
    } catch (error) {
      console.error('Caught error:', error);
      toast.error('An error occurred while deleting the user.');
    } finally {
      closeDeleteModal();
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
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#4CAF50', // Green for success
            color: '#fff',
          },
          error: {
            style: {
              background: '#FF5252', // Red for errors
              color: '#fff',
            },
          },
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this user?"
      />

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
                    onClick={() => openDeleteModal(user.id)}
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