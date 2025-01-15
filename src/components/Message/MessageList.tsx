import React from 'react';
import { Message } from '../../types/supabase';
import { supabase } from '../../lib/supabase';
import { Trash2, Plus, Search, Mail } from 'lucide-react';
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

export function MessageList() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showAddMessageForm, setShowAddMessageForm] = React.useState(false);
  const [newMessage, setNewMessage] = React.useState({
    message: '',
    category_id: '',
  });
  const [categories, setCategories] = React.useState<{ id: number; name: string }[]>([]);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [categoryFilter, setCategoryFilter] = React.useState<string>('');
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [showOnlyMyMessages, setShowOnlyMyMessages] = React.useState(false); // For admins only
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null); // Store current user ID
  const [showSentMessages, setShowSentMessages] = React.useState(false); // For non-admins to toggle their messages
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [messageToDelete, setMessageToDelete] = React.useState<string | null>(null);

  // Fetch the current user's profile to check if they are an admin
  const fetchCurrentUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found.');
      return;
    }

    setCurrentUserId(user.id); // Set the current user ID

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('account_type')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    setIsAdmin(profile.account_type === 'admin');
  };

  // Fetch messages
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        message,
        created_at,
        user_id,
        category_id,
        profiles:user_id (email),
        message_categories:category_id (name)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages.');
      return;
    }

    setMessages(data || []);
    setLoading(false);
  };

  // Fetch categories
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('message_categories')
      .select('id, name');

    if (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories.');
      return;
    }

    setCategories(data || []);
  };

  React.useEffect(() => {
    fetchCurrentUserProfile();
    fetchMessages();
    fetchCategories();
  }, []);

  // Handle opening the delete confirmation modal
  const openDeleteModal = (messageId: string) => {
    setMessageToDelete(messageId);
    setIsDeleteModalOpen(true);
  };

  // Handle closing the delete confirmation modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setMessageToDelete(null);
  };

  // Handle confirming the deletion
  const confirmDelete = async () => {
    if (!messageToDelete) return;

    try {
      const { error } = await supabase
        .from('messages')
        .delete()
        .eq('id', messageToDelete);

      if (error) {
        console.error('Error deleting message:', error);
        toast.error('Failed to delete message.');
        return;
      }

      toast.success('Message deleted successfully.');
      fetchMessages(); // Refresh the message list
    } catch (error) {
      console.error('Caught error:', error);
      toast.error('An error occurred while deleting the message.');
    } finally {
      closeDeleteModal();
    }
  };

  // Handle adding a new message
  const handleAddMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No authenticated user found.');
      toast.error('No authenticated user found.');
      return;
    }

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          message: newMessage.message,
          category_id: Number(newMessage.category_id),
          user_id: user.id,
        }]);

      if (error) {
        console.error('Error adding message:', error);
        toast.error('Failed to add message.');
        return;
      }

      toast.success('Message added successfully.');
      setNewMessage({ message: '', category_id: '' }); // Reset form
      setShowAddMessageForm(false); // Hide form
      fetchMessages(); // Refresh the message list
    } catch (error) {
      console.error('Caught error:', error);
      toast.error('An error occurred while adding the message.');
    }
  };

  // Handle opening Gmail with pre-filled subject and body
  const handleOpenGmail = (category: string, message: string) => {
    const subject = encodeURIComponent(category);
    const body = encodeURIComponent(message);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  // Filter messages based on category, search term, and user filter
  const filteredMessages = messages.filter((message) => {
    const matchesCategory = categoryFilter ? message.category_id === Number(categoryFilter) : true;
    const matchesSearch = searchTerm
      ? message.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    const matchesUser = isAdmin && showOnlyMyMessages ? message.user_id === currentUserId : true;
    return matchesCategory && matchesSearch && matchesUser;
  });

  // Messages sent by the current user (for non-admins)
  const userMessages = messages.filter((message) => message.user_id === currentUserId);

  if (loading) {
    return (
      <div className="p-4 sm:p-8 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
        message="Are you sure you want to delete this message?"
      />

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4 sm:mb-0">Manage Messages</h1>
        {/* Only show "Add Message" button for admins */}
        {isAdmin && (
          <button
            onClick={() => setShowAddMessageForm(!showAddMessageForm)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Message
          </button>
        )}
      </div>

      {/* Add Message Form (Only for admins) */}
      {isAdmin && showAddMessageForm && (
        <div className="mb-6 bg-white shadow-md rounded-lg p-4 sm:p-6">
          <form onSubmit={handleAddMessage} className="space-y-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                value={newMessage.category_id}
                onChange={(e) => setNewMessage({ ...newMessage, category_id: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                id="message"
                value={newMessage.message}
                onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                rows={3}
                required
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddMessageForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar (Hidden when Add Message Form is open) */}
      {!showAddMessageForm && (
        <div className="mb-6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          {/* Show "Show only my messages" toggle only for admins */}
          {isAdmin && (
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showOnlyMyMessages}
                onChange={(e) => setShowOnlyMyMessages(e.target.checked)}
                className="form-checkbox h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">Show only my messages</span>
            </label>
          )}
        </div>
      )}

      {/* Messages Table for Admins */}
      {isAdmin && !showAddMessageForm && (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
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
              {filteredMessages.map((message) => (
                <tr key={message.id} className="hover:bg-gray-50">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {message.profiles?.email || 'Unknown'}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {message.message_categories?.name || 'Uncategorized'}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {message.message}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(message.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openDeleteModal(message.id)}
                      className="text-red-600 hover:text-red-900 focus:outline-none mr-2"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        handleOpenGmail(
                          message.message_categories?.name || 'Uncategorized',
                          message.message
                        )
                      }
                      className="text-blue-600 hover:text-blue-900 focus:outline-none"
                    >
                      <Mail className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Message List for Non-Admins */}
      {!isAdmin && !showAddMessageForm && (
        <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
          {!showSentMessages ? (
            <div className="text-center">
              <p className="text-gray-700 mb-4">You do not have permission to view the message list.</p>
              <button
                onClick={() => setShowSentMessages(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Show My Sent Messages
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setShowSentMessages(false)}
                className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Hide My Sent Messages
              </button>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {userMessages.map((message) => (
                      <tr key={message.id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {message.message_categories?.name || 'Uncategorized'}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {message.message}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(message.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}