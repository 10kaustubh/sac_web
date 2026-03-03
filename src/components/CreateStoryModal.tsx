import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreateStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, description: string) => void;
}

export const CreateStoryModal: React.FC<CreateStoryModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate(title, description);
      setTitle('');
      setDescription('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold text-sap-dark">Create New Story</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Story Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter story title"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sap-blue"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              rows={3}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sap-blue"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sap-blue text-white rounded-lg hover:bg-blue-700"
            >
              Create Story
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
