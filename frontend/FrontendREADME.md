src/
├── api/                     # 所有與後端互動的封裝 (fetch, axios)
│   ├── auth.ts              # login、register
│   ├── group.ts             # group CRUD
│   └── task.ts              # task CRUD
│
├── context/                 # 全域狀態 (如 token)
│   └── AuthContext.tsx      # 存取與監控 JWT token
│
├── pages/                   # 完整頁面（與 Router 對應）
│   ├── WelcomePage.tsx
│   ├── GroupPage.tsx
│   └── TaskListPage.tsx
│
├── modals/                  # 所有彈跳視窗元件（獨立控制 show/hide）
│   ├── LoginModal.tsx
│   ├── RegisterModal.tsx
│   ├── AddGroupModal.tsx
│   ├── AddTaskModal.tsx
│   ├── UpdateTaskModal.tsx
│   └── TaskSelectionModal.tsx
│
│
├── hooks/                   # 自定義 hook（如 useTasks/useGroup）
│   └── useTasks.ts
│
├── utils/                   # 公用函式（jwt 處理、時間格式）
│   └── token.ts             # getToken、setToken、removeToken
│
├── App.tsx                  # 全域路由設定（Router、Route、AuthProvider）
├── main.tsx                 # App 根掛載點
├── index.css                # Tailwind 啟用點 (@tailwind base/components/utilities)
└── vite-env.d.ts
