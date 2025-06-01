import React, { useEffect, useState } from 'react';
import GroupCard from '../components/GroupCard';
import GroupModal from '../components/GroupModal';
import { fetchWithAuth } from '../utils/fetchWithAuth'
import { useNavigate } from 'react-router-dom'
import DeleteGroupModal from '../components/DeleteGroupModal';
import UpdateGroupModal from '../components/UpdateGroupModal';

type Group = {
  name: string;
  id: number;
  members: number[];
  totalMembers: number;
};



export default function GroupPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');

    // 取得使用者資訊
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetchWithAuth('http://localhost:5001/auth/whoami'); // login microservice
        if (!res.ok) throw new Error('取得使用者資訊失敗');
        const data = await res.json();
        setUserName(data.username);
        setUserId(data.user_id);
      } catch (err) {
        console.error('載入使用者資訊失敗', err);
      }
    };

    fetchUserInfo();
  }, []);


  // 🚀 一開始就撈所有群組，然後一個個抓成員
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await  fetchWithAuth('http://localhost:5005/groups/my-groups');
        const data = await res.json();

        const enrichedGroups: Group[] = await Promise.all(
          data.map(async (g: any) => {	
            const membersRes = await fetchWithAuth(`http://localhost:5005/groups/${g.id}/members`);
            const members = await membersRes.json();

            return {
              id: g.id,
              name: g.title,
              members: members,
              totalMembers: members.length,
            };
          })
        );

        setGroups(enrichedGroups);
      } catch (err) {
        console.error("載入群組時出錯", err);
      }
    };

    fetchGroups();
  }, []);

  const [deleteGroup, setDeleteGroup] = useState(false);
  const [updateGroup, setUpdateGroup] = useState(false);
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')  // 登出後導回首頁
  }

 
  const handleCreateGroup = async (name: string) => {
  try {
    const token = localStorage.getItem('token');
    const payload = JSON.parse(atob(token!.split('.')[1]));
    const userId = payload.sub || payload.identity;

    const res = await fetchWithAuth('http://localhost:5005/groups/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: name }),
    });

    if (!res.ok) throw new Error('Failed to create group');
    const data = await res.json();

    const newGroup: Group = {
      name,
      id: data.group_id,
      members: [userId],
      totalMembers: 1,
    };

    setGroups((prev) => [...prev, newGroup]);
    setIsModalOpen(false);
  } catch (error) {
    console.error(error);
    alert('新增群組失敗');
  }
};


  const handleDeleteGroup = async (groupId: number) => {
   try {
     const res = await fetchWithAuth('http://localhost:5005/groups/delete', {
       method: 'DELETE',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ group_id: groupId }),
     });

     if (!res.ok) {
       const errText = await res.text();
       throw new Error(errText);
     }

    // 刪除成功後更新畫面
     setGroups(prevGroups => prevGroups.filter(group => group.id !== groupId));
   } catch (error: any) {
     console.error("刪除失敗：", error);
     alert(`刪除失敗：${error.message || '發生未知錯誤'}`);
   }
 };


  
  const handleUpdateGroup = async (groupId: number, newName: string) => {
  try {
    const res = await fetchWithAuth('http://localhost:5005/groups/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        group_id: groupId,
        new_title: newName,
      }),
    });

    if (!res.ok) throw new Error('更新群組名稱失敗');

    setGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId ? { ...group, name: newName } : group
      )
    );
    setUpdateGroup(false);  // ✅ 成功後關掉 modal
  } catch (error) {
    console.error(error);
    alert("更新群組名稱失敗");
  }
};

  const handleAddMember = async (groupId: number, memberId: number) => {
  try {
    const res = await fetchWithAuth('http://localhost:5005/groups/add_user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ group_id: groupId, user_id: memberId }),
    });

    const result = await res.json(); // ✅ 正確地解析 JSON

    if (!res.ok) {
      throw new Error(result.message || result.error || '邀請失敗');
    }

    // 更新畫面
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
  } catch (error: any) {
    console.error("邀請失敗：", error);
    alert(`邀請失敗：${error.message || '發生未知錯誤'}`);
  }
};


  const handleDeleteMember = async (groupId: number, memberId: number) => {
  try {
    const res = await fetchWithAuth('http://localhost:5005/groups/remove_user', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ group_id: groupId, user_id: memberId }),
    });

    if (!res.ok) {
      const result = await res.json(); // ← 拿到錯誤訊息
      throw new Error(result.message || '刪除失敗');
    }

    // ✅ 刪除成功：更新畫面
    setGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? {
              ...group,
              members: group.members.filter(m => m !== memberId),
              totalMembers: group.totalMembers - 1,
            }
          : group
      )
    );
  } catch (error: any) {
    console.error("刪除失敗：", error);
    alert(`刪除失敗：${error.message || '發生未知錯誤'}`);
  }
};



  return (
    <div className="min-h-screen bg-gray-50 px-8 py-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">TaskManager</h1>
        <div className="flex items-center gap-4">
          <div className="text-right">
			<div className="text-sm text-gray-800 font-semibold">{userName || '載入中...'}</div>
			<div className="text-xs text-gray-500">ID: {userId || '...'}</div>
          </div>
		  <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">登出</button>
		</div>
      </header>

      <div>
        <h2 className="text-xl font-bold mb-1">我的群組</h2>
        <p className="text-sm text-gray-500 mb-4">管理您參與的所有工作群組</p>
		
		<div className="text-right space-x-4">
          <button	
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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

