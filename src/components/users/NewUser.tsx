import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { AccountType } from '../../types/supabase';
import toast, { Toaster } from 'react-hot-toast';

// Account types for the dropdown
const accountTypes = [
  { value: 'admin', label: 'Admin' },
  { value: 'chamber', label: 'Ethiopian Chamber of Commerce' },
  { value: 'business', label: 'Business' },
  { value: 'government', label: 'Government Organization' },
];

export function NewUser() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('admin');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Insert the user profile into the 'profiles' table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email,
              account_type: accountType,
            },
          ]);

        if (profileError) throw profileError;

        // Success notification
        toast.success('User created successfully!');
        navigate('/dashboard/users');
      }
    } catch (err) {
      // Handle errors and show error notification
      console.error('Error creating user:', err);
      setError('Failed to create user. Please try again.');
      toast.error('Failed to create user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#4CAF50', // Green for success
            color: '#fff',
            zIndex: 9999, // Ensure it's on top
          },
          error: {
            style: {
              background: '#FF5252', // Red for errors
              color: '#fff',
              zIndex: 9999, // Ensure it's on top
            },
          },
        }}
      />

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Add New User</h1>

        <div className="bg-white shadow-md rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Type Dropdown */}
            <div>
              <label htmlFor="accountType" className="block text-sm font-medium text-gray-700">
                Account Type
              </label>
              <div className="mt-1">
                <select
                  id="accountType"
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value as AccountType)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  {accountTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && <div className="text-red-600 text-sm">{error}</div>}

            {/* Form Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/dashboard/users')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
