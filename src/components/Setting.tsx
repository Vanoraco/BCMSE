import React from 'react';
import { supabase } from '../lib/supabase';
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

export function Setting() {
  const [categories, setCategories] = React.useState<{ id: number; name: string }[]>([]);
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [editingCategory, setEditingCategory] = React.useState<{ id: number; name: string } | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const [categoryToDelete, setCategoryToDelete] = React.useState<number | null>(null);

  // Fetch categories
  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('message_categories')
      .select('id, name')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories.');
      return;
    }

    setCategories(data || []);
    setLoading(false);
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  // Handle adding a new category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newCategoryName.trim()) {
      toast.error('Category name cannot be empty.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('message_categories')
        .insert([{ name: newCategoryName }])
        .select();

      if (error) {
        console.error('Error adding category:', error);
        toast.error('Failed to add category.');
        return;
      }

      toast.success('Category added successfully.');
      setNewCategoryName(''); // Reset form
      fetchCategories(); // Refresh the category list
    } catch (error) {
      console.error('Caught error:', error);
      toast.error('An error occurred while adding the category.');
    }
  };

  // Handle editing a category
  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingCategory || !editingCategory.name.trim()) {
      toast.error('Category name cannot be empty.');
      return;
    }

    try {
      const { error } = await supabase
        .from('message_categories')
        .update({ name: editingCategory.name })
        .eq('id', editingCategory.id);

      if (error) {
        console.error('Error updating category:', error);
        toast.error('Failed to update category.');
        return;
      }

      toast.success('Category updated successfully.');
      setEditingCategory(null); // Reset editing state
      fetchCategories(); // Refresh the category list
    } catch (error) {
      console.error('Caught error:', error);
      toast.error('An error occurred while updating the category.');
    }
  };

  // Handle opening the delete confirmation modal
  const openDeleteModal = (categoryId: number) => {
    setCategoryToDelete(categoryId);
    setIsDeleteModalOpen(true);
  };

  // Handle closing the delete confirmation modal
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  // Handle confirming the deletion
  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      const { error } = await supabase
        .from('message_categories')
        .delete()
        .eq('id', categoryToDelete);

      if (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category.');
        return;
      }

      toast.success('Category deleted successfully.');
      fetchCategories(); // Refresh the category list
    } catch (error) {
      console.error('Caught error:', error);
      toast.error('An error occurred while deleting the category.');
    } finally {
      closeDeleteModal();
    }
  };

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
        message="Are you sure you want to delete this category?"
      />

      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Manage Categories</h1>

      {/* Add Category Form */}
      <div className="mb-6 bg-white shadow-md rounded-lg p-4 sm:p-6">
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label htmlFor="newCategory" className="block text-sm font-medium text-gray-700">
              Add New Category
            </label>
            <input
              type="text"
              id="newCategory"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter category name"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>

      {/* Edit Category Form (if editing) */}
      {editingCategory && (
        <div className="mb-6 bg-white shadow-md rounded-lg p-4 sm:p-6">
          <form onSubmit={handleEditCategory} className="space-y-4">
            <div>
              <label htmlFor="editCategory" className="block text-sm font-medium text-gray-700">
                Edit Category
              </label>
              <input
                type="text"
                id="editCategory"
                value={editingCategory.name}
                onChange={(e) =>
                  setEditingCategory({ ...editingCategory, name: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter category name"
                required
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category Name
              </th>
              <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-gray-50">
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {category.name}
                </td>
                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="text-indigo-600 hover:text-indigo-900 focus:outline-none"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteModal(category.id)}
                    className="text-red-600 hover:text-red-900 focus:outline-none"
                  >
                    Delete
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