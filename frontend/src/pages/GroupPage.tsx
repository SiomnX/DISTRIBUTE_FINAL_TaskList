import React, { useState, useEffect } from 'react';
import GroupCard from '../components/GroupCard';
import GroupModal from '../components/GroupModal';
import { fetchWithAuth } from '../utils/fetchWithAuth'
import { useNavigate } from 'react-router-dom'
import DeleteGroupModal from '../components/deleteGroupModal';
import UpdateGroupModal from '../components/UpdateGroupModal';


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
  const [deleteGroup, setDeleteGroup] = useState(false);
  const [updateGroup, setUpdateGroup] = useState(false);
  const navigate = useNavigate()


  // 驗證用 fetchWithAuth ======================
  useEffect(() => {
  fetchWithAuth('http://localhost:5002/auth/protected')
    .then(res => {
      if (!res.ok) throw new Error(`錯誤狀態碼：${res.status}`)
      return res.json()
    })
    .then(data => console.log('✅ Token 驗證成功:', data))
    .catch(err => console.error('❌ Token 驗證失敗:', err))
}, [])
  //=============================================

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')  // 登出後導回首頁
  }


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

  const handleDeleteGroup = (groupId: number) => {
    setGroups(prevGroups => prevGroups.filter(group => group.id != groupId));
  }

  const handleUpdateGroup = (groupId: number, newName: string) => {
    setGroups(prevGroups => prevGroups.map(group =>
      group.id === groupId ? { ...group, name: newName } : group
    ));
  }

  const handleAddMember = (groupId: number, memberId: number) => {
    setGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
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
          <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">登出</button>
        </div>
      </header>

      <div>
        <h2 className="text-xl font-bold mb-1">我的群組</h2>
        <p className="text-sm text-gray-500 mb-4">管理您參與的所有工作群組</p>

        <div className="text-right space-x-4">
          <button
            className="border-2 border border-blue-500 text-blue-500 px-4 py-2 rounded hover:bg-blue-600 hover:text-white"
            onClick={() => setIsModalOpen(true)}
          >
            ＋ 新增群組
          </button>
          <button
            className="border-2 border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-600 hover:text-white"
            onClick={() => setDeleteGroup(true)}
          >
            -- 刪除群組
          </button>
          <button
            className="border-2 border border-green-500 text-green-500 px-4 py-2 rounded hover:bg-green-600 hover:text-white"
            onClick={() => setUpdateGroup(true)}
          >
            更改群組名稱
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

      <DeleteGroupModal
        isOpen={deleteGroup}
        onClose={() => setDeleteGroup(false)}
        onCreate={handleDeleteGroup}
      />

      <UpdateGroupModal
        isOpen={updateGroup}
        onClose={() => setUpdateGroup(false)}
        onCreate={handleUpdateGroup}
      />
    </div>
  );
}
