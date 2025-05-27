import React from 'react';

interface Notification {
    type: string;
    time: string;
    content: string;
    typeColor?: string;
}

interface Props {
    isOpen: boolean
    onClose: () => void
    notifications: Notification[];
    onMarkAllRead?: () => void;
}

const getColorClass = (type: string) => {
  switch (type) {
    case '任務更新':
      return 'text-blue-400';
    case '截止提醒':
      return 'text-orange-400';
    case '新成員':
      return 'text-red-400';
    case '任務完成':
      return 'text-gray-400';
    default:
      return 'text-black';
  }
};

export default function NotificationModal({ isOpen, onClose, notifications, onMarkAllRead }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-80 bg-white shadow-lg rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">通知</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg ml-2">×</button>
        </div>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-sm text-gray-400">目前沒有通知</p>
          ) : (
            notifications.map((n, i) => (
              <div key={i} className="border-b pb-2">
                <p className={`text-sm font-medium ${getColorClass(n.type)}`}>{n.type}</p>
                <p className="text-sm text-gray-800">{n.content}</p>
                <p className="text-xs text-gray-400 mt-1">{n.time}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
