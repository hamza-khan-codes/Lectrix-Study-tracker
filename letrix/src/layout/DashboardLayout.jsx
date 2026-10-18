import { Bell, BookOpen, CalendarDays, ChartNoAxesColumnIncreasing, GraduationCap, LayoutDashboard, Play, Search, Settings } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import ROUTES from '../constant/routes';

const navigation = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: ROUTES.DASHBOARD,
  },
  {
    label: "My Study Library",
    icon: BookOpen,
    path: ROUTES.STUDY_LIBRARY,
  },
  {
    label: "Study Room",
    icon: Play,
    path: ROUTES.STUDY_ROOM,
  },
  {
    label: "Progress & Analytics",
    icon: ChartNoAxesColumnIncreasing,
    path: ROUTES.PROGRESS,
  },
  {
    label: "Study Planner",
    icon: CalendarDays,
    path: ROUTES.STUDY_PLANNER,
  },
  {
    label: "Profile & Settings",
    icon: Settings,
    path: ROUTES.PROFILE,
  },
];

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <div className="flex min-h-screen">

        {/* Sidebar */}

        <aside className="fixed top-0 bottom-0 z-20 hidden w-[250px] shrink-0 flex-col border-r border-border bg-sidebar lg:flex">
          <div className="flex h-[84px] items-center gap-3 border-b border-border px-7">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-black">
              <Play size={22} fill="currentColor" />
            </div>

            <span className="text-2xl font-bold tracking-tight">
              Letrix
            </span>
          </div>

          <nav className="flex-1 space-y-2 px-3 py-7">
            {navigation.map(({ label, icon: Icon, path }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex w-full items-center gap-3 rounded-xl border-l-2 px-4 py-3 text-left text-sm transition ${isActive
                    ? "border-primary bg-primary-muted text-primary"
                    : "border-transparent text-muted hover:bg-card-hover hover:text-foreground"
                  }`
                }
              >
                <Icon size={20} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="m-4 rounded-panel border border-border bg-card p-5">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary-muted text-primary">
              <GraduationCap size={23} />
            </div>

            <p className="font-medium">Small steps,</p>
            <p className="font-medium">big results.</p>

            <p className="mt-3 text-sm text-muted">
              Keep going. 🚀
            </p>
          </div>
        </aside>

        {/* Main application */}
        <div className="min-w-0 flex-1">
          <div className="">
            {/* Topbar */}

            <header className="sticky top-0 lg:ml-[250px] z-20 flex h-[76px] items-center justify-between gap-4 border-b border-border bg-background/95 px-5 backdrop-blur-xl sm:px-8">
              <div className="relative w-full max-w-xl">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"
                />

                <input
                  type="search"
                  // value={search}
                  // onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search lectures, subjects, or exams..."
                  className="w-full rounded-xl border border-border bg-card py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-subtle focus:border-primary"
                />
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <button
                  type="button"
                  aria-label="Notifications"
                  className="relative rounded-full border border-border p-2.5 text-muted hover:bg-card-hover"
                >
                  <Bell size={19} />
                  <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
                </button>

                <button
                  type="button"
                  aria-label="Profile"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary-muted font-semibold text-primary"
                >
                  AS
                </button>
              </div>
            </header>


            {/* Page content */}

            <main className="mx-auto lg:ml-[250px] max-w-[1700px] p-5 sm:p-8 bg-background ">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  )
}
