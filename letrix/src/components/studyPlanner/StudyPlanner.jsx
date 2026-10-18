
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Sun,
  Clock3,
  Circle,
  CheckCircle2,
  Play,
  FileText,
  BarChart3,
  Target,
  Plus,
  List,
  Grid2X2,
  Video,
  BookOpen,
  FlaskConical,
} from "lucide-react";

const initialTasks = [
  {
    id: 1,
    date: "2026-10-18",
    start: "08:00",
    end: "09:00",
    title: "Organic Chemistry - Lecture 3",
    type: "Video",
    subject: "Chemistry",
    color: "orange",
    completed: true,
  },
  {
    id: 2,
    date: "2026-10-18",
    start: "09:15",
    end: "10:15",
    title: "Physics - Lecture 2",
    type: "Video",
    subject: "Physics",
    color: "blue",
    completed: false,
  },
  {
    id: 3,
    date: "2026-10-18",
    start: "11:00",
    end: "12:30",
    title: "Mathematics Practice Questions",
    type: "Task",
    subject: "Mathematics",
    color: "green",
    completed: false,
  },
  {
    id: 4,
    date: "2026-10-18",
    start: "14:00",
    end: "15:00",
    title: "Biology - Lecture 4",
    type: "Video",
    subject: "Biology",
    color: "purple",
    completed: false,
  },
  {
    id: 5,
    date: "2026-10-18",
    start: "16:00",
    end: "17:00",
    title: "Chemistry Revision",
    type: "Task",
    subject: "Chemistry",
    color: "yellow",
    completed: false,
  },
  {
    id: 6,
    date: "2026-10-19",
    start: "10:00",
    end: "11:00",
    title: "Physics - Lecture 3",
    type: "Video",
    subject: "Physics",
    color: "blue",
    completed: false,
  },
  {
    id: 7,
    date: "2026-10-20",
    start: "11:30",
    end: "12:30",
    title: "Biology - Lecture 5",
    type: "Video",
    subject: "Biology",
    color: "purple",
    completed: false,
  },
  {
    id: 8,
    date: "2026-10-21",
    start: "09:00",
    end: "10:00",
    title: "Chemistry Practice Test",
    type: "Task",
    subject: "Chemistry",
    color: "green",
    completed: false,
  },
  {
    id: 9,
    date: "2026-10-23",
    start: "15:00",
    end: "16:00",
    title: "English - Grammar Revision",
    type: "Task",
    subject: "English",
    color: "yellow",
    completed: false,
  },
];

const colorClasses = {
  orange: "border-l-primary text-primary bg-primary/5",
  blue: "border-l-blue-500 text-blue-400 bg-blue-500/5",
  green: "border-l-emerald-500 text-emerald-400 bg-emerald-500/5",
  purple: "border-l-purple-500 text-purple-400 bg-purple-500/5",
  yellow: "border-l-amber-400 text-amber-400 bg-amber-400/5",
};

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDate = (date) =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function StudyPlanner() {
  const [tasks, setTasks] = useState(initialTasks);
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 9, 18));
  const [displayMonth, setDisplayMonth] = useState(new Date(2026, 9, 1));
  const [view, setView] = useState("Calendar");

  const selectedKey = toDateKey(selectedDate);
  const selectedTasks = tasks.filter((task) => task.date === selectedKey);

  const completedCount = tasks.filter((task) => task.completed).length;
  const overallProgress = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  const monthLabel = displayMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const calendarDays = useMemo(() => {
    const firstDay = new Date(
      displayMonth.getFullYear(),
      displayMonth.getMonth(),
      1
    );
    const startOffset = firstDay.getDay();

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(
        displayMonth.getFullYear(),
        displayMonth.getMonth(),
        index - startOffset + 1
      );

      return {
        date,
        key: toDateKey(date),
        inMonth: date.getMonth() === displayMonth.getMonth(),
      };
    });
  }, [displayMonth]);

  const toggleTask = (taskId) => {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const changeMonth = (amount) => {
    setDisplayMonth(
      (previous) =>
        new Date(previous.getFullYear(), previous.getMonth() + amount, 1)
    );
  };

  const addTask = () => {
    const title = window.prompt("What do you want to study?");
    if (!title?.trim()) return;

    const newTask = {
      id: Date.now(),
      date: selectedKey,
      start: "18:00",
      end: "19:00",
      title: title.trim(),
      type: "Task",
      subject: "Study",
      color: "orange",
      completed: false,
    };

    setTasks((previous) => [...previous, newTask]);
  };

  const upcomingTasks = [...tasks]
    .filter((task) => task.date >= selectedKey && !task.completed)
    .sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`))
    .slice(0, 4);

  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(selectedDate);
    date.setDate(selectedDate.getDate() - selectedDate.getDay() + index);
    return date;
  });

  return (
    <main className="min-w-0 bg-background p-4 text-foreground md:p-7">
      {/* Page heading and view controls */}
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="mb-4 flex items-center gap-2 text-sm text-muted hover:text-primary"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-4">
            <CalendarDays className="text-primary" size={42} />
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">
                Study <span className="text-primary">Planner</span>
              </h1>
              <p className="mt-1 text-sm text-muted">
                Plan your study, stay consistent, achieve your goals.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5">
            <CalendarDays size={17} className="text-muted" />
            <span className="text-sm">{monthLabel}</span>
            <button
              onClick={() => changeMonth(1)}
              aria-label="Next month"
              className="ml-2 text-muted hover:text-primary"
            >
              <ChevronRight size={17} />
            </button>
          </div>

          <div className="flex rounded-xl border border-border bg-card p-1">
            {[
              { label: "Calendar", icon: CalendarDays },
              { label: "List", icon: List },
              { label: "Week", icon: Grid2X2 },
            ].map(({ label, icon: Icon }) => (
              <button
                key={label}
                onClick={() => setView(label)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${
                  view === label
                    ? "bg-primary text-black"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Planner dashboard grid */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,1fr)_minmax(300px,1fr)]">
        {/* Calendar */}
        <section className="rounded-2xl border border-border bg-card p-4 md:p-5">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="font-semibold">{monthLabel}</h2>
            <div className="flex gap-1">
              <button
                onClick={() => changeMonth(-1)}
                aria-label="Previous month"
                className="rounded-lg p-2 text-muted hover:bg-background hover:text-primary"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => changeMonth(1)}
                aria-label="Next month"
                className="rounded-lg p-2 text-muted hover:bg-background hover:text-primary"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {view === "Calendar" && (
            <>
              <div className="grid grid-cols-7 gap-y-2 text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="pb-3 text-xs font-medium text-muted"
                    >
                      {day}
                    </div>
                  )
                )}

                {calendarDays.map(({ date, key, inMonth }) => {
                  const dayTasks = tasks.filter((task) => task.date === key);
                  const selected = key === selectedKey;

                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedDate(date)}
                      className={`flex min-h-[48px] flex-col items-center justify-center rounded-xl text-sm transition ${
                        selected
                          ? "bg-primary font-bold text-black"
                          : inMonth
                          ? "text-foreground hover:bg-background"
                          : "text-subtle"
                      }`}
                    >
                      <span>{date.getDate()}</span>
                      <span className="mt-1 flex h-1.5 gap-0.5">
                        {dayTasks.slice(0, 3).map((task) => (
                          <span
                            key={task.id}
                            className={`h-1.5 w-1.5 rounded-full ${
                              selected ? "bg-black" : colorClasses[task.color]
                                .split(" ")[1]
                                .replace("text-", "bg-")
                            }`}
                          />
                        ))}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <p className="text-xs text-muted">
                  Select a date to view its scheduled study tasks.
                </p>
              </div>
            </>
          )}

          {view === "List" && (
            <div className="space-y-2">
              {tasks
                .filter((task) => task.date.startsWith(
                  `${displayMonth.getFullYear()}-${String(
                    displayMonth.getMonth() + 1
                  ).padStart(2, "0")}`
                ))
                .sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`))
                .map((task) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      setSelectedDate(new Date(`${task.date}T12:00:00`));
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-border p-3 text-left hover:border-primary"
                  >
                    <span>
                      <span className="block text-xs text-muted">
                        {task.date} · {task.start}
                      </span>
                      <span className="mt-1 block text-sm">{task.title}</span>
                    </span>
                    {task.completed ? (
                      <CheckCircle2 className="text-emerald-400" size={18} />
                    ) : (
                      <Circle className="text-muted" size={18} />
                    )}
                  </button>
                ))}
            </div>
          )}

          {view === "Week" && (
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((date) => {
                const key = toDateKey(date);
                const count = tasks.filter((task) => task.date === key).length;

                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDate(date)}
                    className={`min-h-28 rounded-xl border p-2 text-center ${
                      key === selectedKey
                        ? "border-primary bg-primary/10"
                        : "border-border bg-background"
                    }`}
                  >
                    <span className="text-xs text-muted">
                      {date.toLocaleDateString("en-US", { weekday: "short" })}
                    </span>
                    <span className="my-2 block text-sm font-semibold">
                      {date.getDate()}
                    </span>
                    <span className="text-xs text-primary">
                      {count} {count === 1 ? "task" : "tasks"}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Selected date plan */}
        <section className="rounded-2xl border border-border bg-card p-4 md:p-5">
          <div className="mb-4 flex items-center gap-3">
            <Sun className="text-primary" size={25} />
            <div>
              <h2 className="font-semibold">Today's Plan</h2>
              <p className="text-xs text-muted">{formatDate(selectedDate)}</p>
            </div>
          </div>

          <div className="space-y-2">
            {selectedTasks.length ? (
              selectedTasks
                .sort((a, b) => a.start.localeCompare(b.start))
                .map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 rounded-xl border border-border border-l-4 p-3 ${
                      colorClasses[task.color]
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="mb-1 text-[11px] text-muted">
                        {task.start} – {task.end}
                      </p>
                      <p className="text-sm font-medium text-foreground">
                        {task.title}
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-current/20 px-2 py-0.5 text-[10px]">
                        {task.type === "Video" ? (
                          <Video size={11} />
                        ) : (
                          <FileText size={11} />
                        )}
                        {task.type}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleTask(task.id)}
                      aria-label={
                        task.completed ? "Mark incomplete" : "Mark complete"
                      }
                      className="shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <Circle size={20} className="text-muted" />
                      )}
                    </button>
                  </div>
                ))
            ) : (
              <div className="rounded-xl border border-dashed border-border p-6 text-center">
                <CalendarDays className="mx-auto mb-2 text-muted" size={25} />
                <p className="text-sm text-muted">
                  Nothing planned for this date.
                </p>
              </div>
            )}
          </div>

          <button
            onClick={addTask}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm text-muted transition hover:border-primary hover:text-primary"
          >
            <Plus size={17} />
            Add Study Task
          </button>
        </section>

        {/* Right side stats */}
        <div className="space-y-5">
          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-5 flex items-center gap-3">
              <Target className="text-primary" size={22} />
              <h2 className="font-semibold">Overall Progress</h2>
            </div>

            <div className="flex items-center gap-5">
              <div
                className="grid h-28 w-28 shrink-0 place-items-center rounded-full"
                style={{
                  background: `conic-gradient(#ff7900 ${overallProgress * 3.6}deg, #252b33 0deg)`,
                }}
              >
                <div className="grid h-20 w-20 place-items-center rounded-full bg-card text-lg font-bold">
                  {overallProgress}%
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  {completedCount} of {tasks.length} tasks completed
                </p>
                <div className="mt-3 space-y-2 text-xs text-muted">
                  <p className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                    Completed <span className="ml-auto">{completedCount}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
                    Remaining{" "}
                    <span className="ml-auto">{tasks.length - completedCount}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex h-12 items-end gap-1">
              {Array.from({ length: 14 }, (_, index) => (
                <div
                  key={index}
                  className="flex-1 rounded-t bg-primary/70"
                  style={{ height: `${20 + ((index * 17 + completedCount * 9) % 75)}%` }}
                />
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold">
                <Clock3 size={20} className="text-primary" />
                Upcoming Tasks
              </h2>
              <span className="text-xs text-muted">Next 4</span>
            </div>

            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() =>
                    setSelectedDate(new Date(`${task.date}T12:00:00`))
                  }
                  className="flex w-full items-start gap-3 border-b border-border pb-3 text-left last:border-0 last:pb-0"
                >
                  <span className="w-12 shrink-0 text-xs text-muted">
                    {new Date(`${task.date}T12:00:00`).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" }
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm">{task.title}</span>
                    <span className="mt-1 block text-xs text-muted">
                      {task.start}
                    </span>
                  </span>
                  <Circle size={17} className="mt-1 shrink-0 text-muted" />
                </button>
              ))}
              {!upcomingTasks.length && (
                <p className="text-sm text-muted">You're all caught up!</p>
              )}
            </div>
          </section>

          <section className="relative overflow-hidden rounded-2xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <Target size={30} className="shrink-0 text-primary" />
              <div>
                <h2 className="font-semibold">Stay Focused</h2>
                <h3 className="font-semibold">Keep Going!</h3>
                <p className="mt-3 text-sm leading-5 text-muted">
                  Your future self will thank you for what you do today.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute -bottom-10 -right-4 h-24 w-40 rotate-[-15deg] rounded-full border border-primary/20" />
          </section>
        </div>

        {/* Weekly overview and quick actions */}
        <section className="rounded-2xl border border-border bg-card p-4 md:p-5 xl:col-span-2">
          <div className="mb-5 flex items-center gap-3">
            <BarChart3 className="text-primary" size={22} />
            <h2 className="font-semibold">Weekly Overview</h2>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((date) => {
              const key = toDateKey(date);
              const dayTasks = tasks.filter((task) => task.date === key);
              const done = dayTasks.filter((task) => task.completed).length;

              return (
                <button
                  key={key}
                  onClick={() => setSelectedDate(date)}
                  className={`rounded-xl border p-3 text-center transition ${
                    key === selectedKey
                      ? "border-primary bg-primary/5"
                      : "border-transparent hover:bg-background"
                  }`}
                >
                  <span className="block text-xs text-muted">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  <span className="mt-1 block text-xs text-muted">
                    {date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="mx-auto my-3 block h-3 w-3 rounded-full bg-primary" />
                  <span className="block text-xs">
                    {dayTasks.length} tasks
                  </span>
                  <span className="mt-1 block text-[10px] text-muted">
                    {done} done
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-4 md:p-5 xl:col-span-2">
          <div className="mb-4 flex items-center gap-3">
            <FlaskConical className="text-primary" size={22} />
            <h2 className="font-semibold">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            {[
              { title: "Add Video", desc: "Save a YouTube video", icon: Play },
              { title: "Add Playlist", desc: "Save a YouTube playlist", icon: List },
              { title: "Create Task", desc: "Add a study task", icon: BookOpen },
              { title: "Plan Study", desc: "Set your study schedule", icon: CalendarDays },
            ].map(({ title, desc, icon: Icon }) => (
              <button
                key={title}
                onClick={title === "Create Task" ? addTask : () => alert(`${title} flow is not connected yet.`)}
                className="flex items-center gap-3 rounded-xl border border-border bg-background p-4 text-left transition hover:border-primary"
              >
                <span className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Icon size={21} />
                </span>
                <span>
                  <span className="block text-sm font-medium">{title}</span>
                  <span className="mt-1 block text-xs text-muted">{desc}</span>
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
