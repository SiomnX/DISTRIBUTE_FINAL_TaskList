import GroupCard from '../components/GroupCard';

type Group = {
  name: string;
  id: string;
  members: string[];
  totalMembers: number;
};

const groups: Group[] = [
  {
    name: "前端開發團隊",
    id: "GRP001",
    members: ["alice_dev", "bob_designer", "charlie_pm"],
    totalMembers: 5,
  },
  {
    name: "行銷企劃組",
    id: "GRP002",
    members: ["david_marketing", "eva_content"],
    totalMembers: 3,
  },
];

export default function App() {
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
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            ＋ 新增群組
          </button>
        </div>

        <div className="space-y-4">
          {groups.map((group, index) => (
            <GroupCard key={index} group={group} />
          ))}
        </div>
      </div>
    </div>
  );
}
