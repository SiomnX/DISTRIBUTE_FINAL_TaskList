import React, { useState } from 'react';
import GroupCard from '../components/GroupCard';
import GroupModal from '../components/GroupModal';


type Group = {
  name: string;
  id: number;
  members: number[];
  totalMembers: number;
};

export default function GroupPage() {
  const [groups, setGroups] = useState<Group[]>([
    {
      name: "前端開發團隊",
      id: 1,
      members: [101, 102, 103],
      totalMembers: 5,
    },
    {
      name: "行銷企劃組",
      id: 2,
      members: [101, 102, 103],
      totalMembers: 3,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateGroup = (name: string) => {
    const maxId = groups.length > 0 ? Math.max(...groups.map(g => g.id)) : 0;
    const newGroup: Group = {
      name,
      id: maxId + 1,
      members: [],
      totalMembers: 0,
    };
    setGroups((prev) => [...prev, newGroup]);
  };
  const handleAddMember = (groupId: number, memberId: number) => {
    setGroups(prevGroups =>
      prevGroups.map(group =>
        group.id == groupId
          ? {
              ...group,
              members: [...group.members, memberId],
              totalMembers: group.totalMembers + 1,
            }
          : group
      )
    );
  };
  const handleDeleteMember = (groupId: number, memberId: number) => {
    setGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? {
              ...group,
              members: group.members.filter(member => member != memberId),
              totalMembers: group.totalMembers - 1,
            }
          : group
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 px-8 py-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">TaskManager</h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm text-gray-800 font-semibold">username123</div>
            <div className="text-xs text-gray-500">ID: 12345</div>
          </div>
          <button className="bg-red-500 text-white px-3 py-1 rounded">登出</button>
        </div>
      </header>

      <div>
        <h2 className="text-xl font-bold mb-1">我的群組</h2>
        <p className="text-sm text-gray-500 mb-4">管理您參與的所有工作群組</p>

        <div className="mb-4 text-right">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setIsModalOpen(true)}
          >
            ＋ 新增群組
          </button>
        </div>

        <div className="space-y-4">
          {groups.map((group, index) => (
            <GroupCard 
              key={index} 
              group={group} 
              onAddMember={(memberId) => handleAddMember(group.id, memberId)}
              onDeleteMember={(memberId) => handleDeleteMember(group.id, memberId)}
            />
          ))}
        </div>
      </div>

      <GroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateGroup}
      />
    </div>
  );
}
