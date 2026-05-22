# 📝 Task Manager Web

A full stack Task Manager frontend built with React, TypeScript, Redux Toolkit and Tailwind CSS.

## 🚀 Live URL

```
https://task-manager-web-sable.vercel.app
```

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI library |
| TypeScript | Type safety |
| Vite | Build tool |
| Redux Toolkit | Global state management |
| React Redux | Connect Redux to React |
| React Router DOM | Client side routing |
| Axios | HTTP requests |
| Tailwind CSS v3 | Styling |
| DaisyUI | UI component library |

## 📁 Folder Structure

```
task-manager-web/
├── src/
│   ├── components/
│   │   ├── Body.tsx          # Layout wrapper with auth check
│   │   ├── NavBar.tsx        # Navigation bar
│   │   ├── Footer.tsx        # Footer
│   │   ├── Login.tsx         # Login and Signup (single component)
│   │   ├── Task.tsx          # Create task form
│   │   ├── TaskList.tsx      # Task list with filter, search, sort
│   │   ├── TaskDetail.tsx    # Single task detail view
│   │   └── EditTask.tsx      # Edit task modal
│   ├── utils/
│   │   ├── appStore.ts       # Redux store configuration
│   │   ├── userSlice.ts      # User state slice
│   │   ├── taskSlice.ts      # Tasks state slice
│   │   ├── types.ts          # TypeScript interfaces
│   │   └── constants.ts      # Base URL and constants
│   ├── App.tsx               # Routes configuration
│   └── main.tsx              # Entry point
├── .env                      # Production environment variables
├── .env.local                # Local environment variables
├── vercel.json               # Vercel SPA routing config
├── tailwind.config.js        # Tailwind configuration
└── package.json
```

## ⚙️ Environment Variables

Create `.env` file for production:
```env
VITE_BASE_URL=https://task-manager-backend-9zmt.onrender.com
```

Create `.env.local` file for local development:
```env
VITE_BASE_URL=http://localhost:5000
```

## 🏃 Running Locally

```bash
# Clone the repository
git clone https://github.com/shasidara/task-manager-web.git

# Install dependencies
npm install

# Run in development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📱 Features

### Authentication
- ✅ Login and Signup in single component with toggle
- ✅ JWT token stored in HTTP-only cookie
- ✅ Auto login on page refresh using /profile API
- ✅ Logout clears cookie and Redux store
- ✅ Redirect to login if not authenticated

### Task Management
- ✅ Create task with title, description, status and target date
- ✅ View all tasks in card grid layout
- ✅ View single task detail page
- ✅ Edit task with pre-filled modal form
- ✅ Delete task with confirmation alert

### Filter & Search
- ✅ Filter tasks by status — All, Todo, In Progress, Done
- ✅ Task count cards showing count per status
- ✅ Real time search with 500ms debouncing
- ✅ Sort by Latest or Oldest

### Deadline Tracking
- ✅ Set target deadline date on tasks
- ✅ Due Today indicator (yellow) when deadline is today
- ✅ Overdue indicator (red) when deadline has passed
- ✅ Future deadline shown in green
- ✅ No indicator shown for completed tasks

### UX Features
- ✅ Loading spinner while fetching data
- ✅ Optimistic UI for delete
- ✅ Toast notifications for success and error
- ✅ Empty state with create task button
- ✅ Responsive design for mobile and desktop

## 🗂️ Redux Store Structure

```ts
store = {
    user: User | null,    // logged in user data
    tasks: Task[]         // all tasks array
}
```

### User Slice Actions
| Action | Description |
|---|---|
| addUser | Set user after login or profile fetch |
| removeUser | Clear user on logout |

### Task Slice Actions
| Action | Description |
|---|---|
| addTask | Add single task after create |
| setTasks | Set all tasks after fetch |
| removeTask | Remove task by ID after delete |
| updateTask | Update task by ID after edit |

## 🛣️ Routes

| Path | Component | Description |
|---|---|---|
| / | TaskList | Main dashboard with all tasks |
| /login | Login | Login and Signup page |
| /task | Task | Create new task |
| /task/:id | TaskDetail | Single task detail |

## 🔄 Auth Flow on Page Refresh

1. Page loads → `Body.tsx` mounts
2. Redux store is empty (user = null)
3. `useEffect` calls `GET /profile` with cookie
4. If cookie valid → user fetched → stored in Redux
5. If cookie invalid → redirect to `/login`
6. Loading spinner shown during this check

## 🚀 Deployment

- Platform: **Vercel** (Free tier)
- Auto deploys on push to `main` branch
- `vercel.json` handles SPA routing (fixes 404 on refresh)

```json
{
    "rewrites": [
        {
            "source": "/(.*)",
            "destination": "/"
        }
    ]
}
```

### Task Dashboard
- Task count cards at top
- Filter by status
- Search and sort controls
- Task cards with deadline indicators

### Create Task
- Title, description, status and target date fields
- Form validation
- Success toast notification

### Edit Task
- Pre-filled modal form
- Update any field
- Instant Redux state update

## 👨‍💻 Developer

Shasidara C — Full Stack Developer
