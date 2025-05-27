import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import AddMemberModal from "./AddMemberModal";
import DeleteMemberModal from "./DeleteMemberModal";

type GroupCardProps = {
  group: {
    name: string;
    id: number;
    members: number[];
    totalMembers: number;
  };
  onAddMember : (memberId: number) => void;
  onDeleteMember: (memberId: number) => void;
};
export default function GroupCard({ group, onAddMember, onDeleteMember }: GroupCardProps) {
  const navigate = useNavigate();  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenForDelete, setIsModalOpenForDelete] = useState(false);
  return (
    <div className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 mb-4">
      {/* 左側：群組名稱 */}
      <div>
        <button 
          type="button" 
          className="text-lg font-semibold py-1 rounded hover:bg-gray-300 transition"
          onClick={() => navigate(`/groups/${group.id}`)}
        >
          {group.name}
        </button>
        <p className="text-sm text-gray-500">群組 ID: {group.id}</p>
        <div className="mt-2">
          <p className="text-sm text-gray-500">成員列表:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {group.members.map((member, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full"
              >
                {member}
              </span>
            ))}
          </div>
        </div>
      </div>
      {/* 右側：新增成員＋刪除成員 */}
      <div className="flex items-center space-x-4">
        <button
          className="bg-green-500 text-white px-4 py-1 rounded hover:bg-gray-600"
          onClick={() => setIsModalOpen(true)}
        >
          加＋
        </button>
        <button
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-gray-600"
          onClick={() => setIsModalOpenForDelete(true)}
        >
          踢！
        </button>
      </div>
      {/* 新增成員彈窗 */}
      <AddMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={(memberId) => {
          onAddMember(Number(memberId));
          setIsModalOpen(false);
        }}
      />
      <DeleteMemberModal
        isOpen={isModalOpenForDelete}
        onClose={() => setIsModalOpenForDelete(false)}
        onCreate={(memberId) => {
          onDeleteMember(Number(memberId));
          setIsModalOpenForDelete(false);
        }}
      />
    </div>
  );
}
