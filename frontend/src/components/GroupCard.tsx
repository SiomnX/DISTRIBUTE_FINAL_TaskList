type GroupCardProps = {
  group: {
    name: string;
    id: string;
    members: string[];
    totalMembers: number;
  };
};

export default function GroupCard({ group }: GroupCardProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-lg font-semibold">{group.name}</h3>
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
      <div className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
        {group.totalMembers} 成員
      </div>
    </div>
  );
}
