import React, { useState } from 'react';

interface GroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}

export default function GroupModal({ isOpen, onClose, onCreate }: GroupModalProps) {
  const [groupName, setGroupName] = useState('');

  const handleConfirm = () => {
    if (groupName.trim()) {
      onCreate(groupName.trim());
      setGroupName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">新增群組</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        </div>

        <label className="block text-sm font-semibold text-gray-700 mb-1">群組名稱</label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="請輸入群組名稱"
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200">取消</button>
          <button onClick={handleConfirm} className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">確定</button>
        </div>
      </div>
    </div>
  );
}



