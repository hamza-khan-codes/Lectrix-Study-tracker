
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {

  Plus,
  ChevronDown,

  Play,

  Link as LinkIcon,
  ListVideo,
  GraduationCap,
  CheckCircle2,
  Circle,

  Filter,
  Atom,
  Folder,
  ExternalLink,
  Library,
  Trash2,
} from "lucide-react";

import ModalBox from "./ModalBox";

import { fetchPlaylistVideos } from "../../service/youtube/youtube";

// --------------------------------------------------
// Initial study library data
// --------------------------------------------------

const initialItems = [
  {
    id: 1,
    title: "Organic Chemistry - Lecture 1",
    type: "Video",
    exam: "MDCAT",
    subject: "Chemistry",
    videoId: "dQw4w9WgXcQ",
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    completed: true,
    duration: "42:15",
  },
  {
    id: 2,
    title: "Biology Full Playlist",
    type: "Playlist",
    exam: "MDCAT",
    subject: "Biology",
    playlistId: "YOUR_PLAYLIST_ID",
    url: "https://www.youtube.com/playlist?list=YOUR_PLAYLIST_ID",
    completed: false,
    totalVideos: 12,
    completedVideos: 3,
  },
  {
    id: 3,
    title: "Physics - Lecture 2",
    type: "Video",
    exam: "ECAT",
    subject: "Physics",
    videoId: "",
    url: "",
    completed: false,
    duration: "38:22",
  },
  {
    id: 4,
    title: "Mathematics Complete Course",
    type: "Playlist",
    exam: "ECAT",
    subject: "Mathematics",
    url: "",
    completed: false,
    totalVideos: 15,
    completedVideos: 5,
  },
  {
    id: 5,
    title: "Cell Structure & Function",
    type: "Video",
    exam: "MDCAT",
    subject: "Biology",
    videoId: "",
    url: "",
    completed: true,
    duration: "25:48",
  },
  {
    id: 6,
    title: "MDCAT Chemistry Revision",
    type: "Playlist",
    exam: "MDCAT",
    subject: "Chemistry",
    url: "",
    completed: false,
    totalVideos: 8,
    completedVideos: 2,
  },
];



const exams = [
  "MDCAT",
  "ECAT",
  "NUMS",
  "PMDC",
  "Other",
];

const subjects = [
  "Biology",
  "Chemistry",
  "Physics",
  "Mathematics",
  "English",
];

// --------------------------------------------------
// YouTube helpers
// --------------------------------------------------

function getYouTubeVideoId(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");

    if (host === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] || null;
    }

    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com"
    ) {
      if (url.pathname === "/watch") {
        return url.searchParams.get("v");
      }

      const match = url.pathname.match(
        /^\/(?:embed|shorts|live)\/([^/]+)/
      );

      return match?.[1] || null;
    }

    return null;
  } catch {
    return null;
  }
}

function getYouTubePlaylistId(value) {
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");

    if (
      ![
        "youtube.com",
        "m.youtube.com",
        "music.youtube.com",
      ].includes(host)
    ) {
      return null;
    }

    if (
      !["/playlist", "/watch"].includes(url.pathname)
    ) {
      return null;
    }

    return url.searchParams.get("list") || null;
  } catch {
    return null;
  }
}

// --------------------------------------------------
// Thumbnail and progress helpers
// --------------------------------------------------

function getThumbnail(item) {
  if (item.videoId) {
    return `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`;
  }

  const images = {
    Biology:
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=500",
    Chemistry:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500",
    Physics:
      "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=500",
    Mathematics:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500",
    English:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500",
  };

  return images[item.subject] || "";
}

function getProgress(item) {
  if (item.type === "Video") {
    return item.completed ? 100 : 0;
  }

  if (!item.totalVideos) return 0;

  return Math.min(
    100,
    Math.round(
      (item.completedVideos / item.totalVideos) * 100
    )
  );
}

function getYouTubeUrl(item) {
  if (item.url) return item.url;

  if (item.type === "Video" && item.videoId) {
    return `https://www.youtube.com/watch?v=${item.videoId}`;
  }

  if (item.type === "Playlist" && item.playlistId) {
    return `https://www.youtube.com/playlist?list=${item.playlistId}`;
  }

  return null;
}

// --------------------------------------------------
// Main component
// --------------------------------------------------

export default function MyStudyLibrary() {
  // Library data
  const [items, setItems] = useState(initialItems);

  // Search and filters
  const [search, setSearch] = useState("");
  const [contentType, setContentType] = useState("All");
  const [exam, setExam] = useState("All Exams");
  const [subject, setSubject] = useState("All Subjects");

  // Modal state
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [formError, setFormError] = useState("");

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      url: "",
      exam: "mdcat",
      subject: "biology",
    },
  });

  // ------------------------------------------------
  // Filter study materials
  // ------------------------------------------------

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const searchText =
        `${item.title} ${item.exam} ${item.subject}`.toLowerCase();

      const matchesSearch = searchText.includes(
        search.trim().toLowerCase()
      );

      const matchesType =
        contentType === "All" ||
        item.type === contentType;

      const matchesExam =
        exam === "All Exams" ||
        item.exam === exam;

      const matchesSubject =
        subject === "All Subjects" ||
        item.subject === subject;

      return (
        matchesSearch &&
        matchesType &&
        matchesExam &&
        matchesSubject
      );
    });
  }, [items, search, contentType, exam, subject]);

  // ------------------------------------------------
  // Library statistics
  // ------------------------------------------------

  const videoCount = items.filter(
    (item) => item.type === "Video"
  ).length;

  const playlistCount = items.filter(
    (item) => item.type === "Playlist"
  ).length;

  const completedCount = items.filter(
    (item) =>
      item.type === "Video"
        ? item.completed
        : item.totalVideos > 0 &&
          item.completedVideos >= item.totalVideos
  ).length;

  // ------------------------------------------------
  // Modal handlers
  // ------------------------------------------------

  function openModal(type) {
    reset({
      title: "",
      url: "",
      exam: "mdcat",
      subject: "biology",
    });

    setFormError("");
    setModalType(type);
    setShowAddMenu(false);
  }

  function closeModal() {
    setModalType(null);
    setFormError("");
    reset();
  }

  // ------------------------------------------------
  // Add video or playlist
  // ------------------------------------------------

  async function addContent(data) {
    clearErrors();
    setFormError("");
    console.log("DAta",data)

    const title = data.title?.trim();
    const url = data.url?.trim();
    const videos = await fetchPlaylistVideos(url)
    console.log(videos)

  
    if (!title) {
      setError("title", {
        type: "required",
        message: "Please enter a content title.",
      });
      return;
    }

    if (!url) {
      setError("url", {
        type: "required",
        message: "Please enter a YouTube URL.",
      });
      return;
    }

    let videoId = null;
    let playlistId = null;

    if (modalType === "Video") {
      videoId = getYouTubeVideoId(url);

      if (!videoId) {
        setError("url", {
          type: "validate",
          message: "Please enter a valid YouTube video URL.",
        });
        return;
      }
    }

    if (modalType === "Playlist") {
      playlistId = getYouTubePlaylistId(url);

      if (!playlistId) {
        setError("url", {
          type: "validate",
          message:
            "Please enter a valid YouTube playlist URL with a playlist ID.",
        });
        return;
      }
    }

    const newItem = {
      id: crypto.randomUUID(),
      title,
      type: modalType,
      exam: exams.find(
        (value) => value.toLowerCase() === data.exam
      ) || "MDCAT",
      subject: subjects.find(
        (value) => value.toLowerCase() === data.subject
      ) || "Biology",
      url,
      completed: false,
      ...(modalType === "Video"
        ? {
            videoId,
            duration: "",
          }
        : {
            playlistId,
            totalVideos: 0,
            completedVideos: 0,
          }),
    };

    setItems((current) => [newItem, ...current]);

    closeModal();
  }

  // ------------------------------------------------
  // Toggle video completion
  // ------------------------------------------------

  function toggleComplete(id) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  }

  // ------------------------------------------------
  // Delete a study item
  // ------------------------------------------------

  function deleteItem(id) {
    setItems((current) =>
      current.filter((item) => item.id !== id)
    );
  }

  // ------------------------------------------------
  // Component JSX
  // ------------------------------------------------

  return (
    <>


            {/* Page heading */}

            <div className="mb-8 flex flex-col justify-between gap-5 xl:flex-row xl:items-start">
              <div>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  My Study{" "}
                  <span className="text-primary">Library</span>
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-muted sm:text-base">
                  Organize your YouTube videos and playlists.
                  Keep everything in one place and track your
                  progress.
                </p>
              </div>

              {/* Add Content menu */}

              <div className="relative">
                <button
                  type="button"
                  onClick={() =>
                    setShowAddMenu((value) => !value)
                  }
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-black transition hover:bg-primary-hover"
                >
                  <Plus size={20} />
                  Add Content
                  <ChevronDown size={17} />
                </button>

                {showAddMenu && (
                  <div className="absolute right-0 top-14 z-30 w-56 rounded-xl border border-border bg-card p-2 shadow-2xl">
                    <button
                      type="button"
                      onClick={() => openModal("Video")}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-muted hover:bg-card-hover hover:text-foreground"
                    >
                      <LinkIcon size={17} />
                      Add Video URL
                    </button>

                    <button
                      type="button"
                      onClick={() => openModal("Playlist")}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-muted hover:bg-card-hover hover:text-foreground"
                    >
                      <ListVideo size={17} />
                      Add Playlist URL
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content and right sidebar */}

            <div className="grid grid-cols-1 gap-7 2xl:grid-cols-[minmax(0,1fr)_270px]">

              {/* Library section */}

              <div className="min-w-0">

                {/* Type filters */}

                <div className="mb-6 flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { label: "All", icon: Library },
                      { label: "Video", icon: Play },
                      { label: "Playlist", icon: ListVideo },
                    ].map(({ label, icon: Icon }) => {
                      const selected = contentType === label;

                      return (
                        <button
                          key={label}
                          type="button"
                          onClick={() => setContentType(label)}
                          className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm transition ${
                            selected
                              ? "border-primary bg-primary text-black"
                              : "border-border bg-card text-muted hover:text-foreground"
                          }`}
                        >
                          <Icon size={17} />
                          {label === "Video"
                            ? "Videos"
                            : label === "Playlist"
                              ? "Playlists"
                              : "All"}
                        </button>
                      );
                    })}
                  </div>

                  {/* Exam and subject filters */}

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <select
                      value={exam}
                      onChange={(event) =>
                        setExam(event.target.value)
                      }
                      className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted outline-none focus:border-primary"
                    >
                      <option value="All Exams">All Exams</option>
                      {exams.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>

                    <select
                      value={subject}
                      onChange={(event) =>
                        setSubject(event.target.value)
                      }
                      className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted outline-none focus:border-primary"
                    >
                      <option value="All Subjects">
                        All Subjects
                      </option>
                      {subjects.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Study cards */}

                {filteredItems.length === 0 ? (
                  <div className="rounded-panel border border-dashed border-border bg-card p-10 text-center">
                    <Folder
                      size={38}
                      className="mx-auto text-primary"
                    />

                    <h2 className="mt-4 text-lg font-semibold">
                      No study materials found
                    </h2>

                    <p className="mt-2 text-sm text-muted">
                      Try changing your filters or add a new
                      YouTube video.
                    </p>

                    <button
                      type="button"
                      onClick={() => openModal("Video")}
                      className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-black hover:bg-primary-hover"
                    >
                      <Plus size={17} />
                      Add your first video
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    {filteredItems.map((item) => {
                      const progress = getProgress(item);
                      const youtubeUrl = getYouTubeUrl(item);
                      const thumbnail = getThumbnail(item);

                      return (
                        <article
                          key={item.id}
                          className="group min-w-0 overflow-hidden rounded-panel border border-border bg-card p-4 transition hover:border-primary/40 hover:bg-card-hover sm:p-5"
                        >
                          <div className="flex gap-4">

                            {/* Thumbnail */}

                            <div className="relative h-[118px] w-[40%] shrink-0 overflow-hidden rounded-xl border border-border bg-background sm:h-[130px] sm:w-[42%]">
                              {thumbnail ? (
                                <img
                                  src={thumbnail}
                                  alt={`${item.title} thumbnail`}
                                  loading="lazy"
                                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-primary-muted text-primary">
                                  {item.type === "Video" ? (
                                    <Play size={32} />
                                  ) : (
                                    <ListVideo size={32} />
                                  )}
                                </div>
                              )}

                              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                              {item.duration && (
                                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-1 text-xs text-white">
                                  {item.duration}
                                </span>
                              )}

                              <span className="absolute left-2 top-2 rounded-md bg-black/75 p-1.5 text-primary">
                                {item.type === "Video" ? (
                                  <Play size={14} />
                                ) : (
                                  <ListVideo size={14} />
                                )}
                              </span>
                            </div>

                            {/* Card information */}

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <h2 className="line-clamp-2 text-sm font-semibold leading-5 text-foreground sm:text-base">
                                  {item.title}
                                </h2>

                                <button
                                  type="button"
                                  onClick={() => deleteItem(item.id)}
                                  aria-label={`Delete ${item.title}`}
                                  title="Delete item"
                                  className="shrink-0 rounded-md p-1 text-subtle hover:bg-background hover:text-red-500"
                                >
                                  <Trash2 size={17} />
                                </button>
                              </div>

                              <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary-muted px-2 py-1 text-xs text-primary">
                                {item.type === "Video" ? (
                                  <Play size={11} />
                                ) : (
                                  <ListVideo size={11} />
                                )}
                                {item.type}
                              </span>

                              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                                <GraduationCap size={15} />
                                <span>{item.exam}</span>
                                <span className="text-subtle">·</span>
                                <span>{item.subject}</span>
                              </div>

                              {/* Video completion */}

                              <div className="mt-3">
                                {item.type === "Video" ? (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleComplete(item.id)
                                    }
                                    className={`flex items-center gap-2 text-xs transition ${
                                      item.completed
                                        ? "text-green-500"
                                        : "text-muted hover:text-foreground"
                                    }`}
                                  >
                                    {item.completed ? (
                                      <CheckCircle2 size={17} />
                                    ) : (
                                      <Circle size={17} />
                                    )}

                                    {item.completed
                                      ? "Completed"
                                      : "Mark completed"}
                                  </button>
                                ) : (
                                  <>
                                    <div className="flex items-center justify-between gap-2 text-xs text-muted">
                                      <span className="flex items-center gap-1">
                                        <ListVideo size={14} />
                                        {item.totalVideos
                                          ? `${item.totalVideos} videos`
                                          : "Playlist not imported"}
                                      </span>

                                      <span>{progress}%</span>
                                    </div>

                                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                                      <div
                                        className="h-full rounded-full bg-primary transition-all"
                                        style={{
                                          width: `${progress}%`,
                                        }}
                                      />
                                    </div>

                                    <p className="mt-2 text-xs text-muted">
                                      {item.completedVideos || 0} of{" "}
                                      {item.totalVideos || 0} completed
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Card footer */}

                          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
                            <span
                              className={`text-xs ${
                                progress === 100
                                  ? "text-green-500"
                                  : "text-muted"
                              }`}
                            >
                              {progress === 100
                                ? "Study completed"
                                : `${progress}% complete`}
                            </span>

                            {youtubeUrl ? (
                              <a
                                href={youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary"
                              >
                                Open on YouTube
                                <ExternalLink size={13} />
                              </a>
                            ) : (
                              <span className="rounded-lg border border-border px-3 py-2 text-xs text-muted">
                                No URL available
                              </span>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right sidebar */}

              <aside className="space-y-5">

                {/* Quick filters */}

                <section className="rounded-panel border border-border bg-card p-5">
                  <h2 className="flex items-center gap-2 font-semibold">
                    <Filter size={18} className="text-primary" />
                    Quick Filters
                  </h2>

                  <div className="mt-6">
                    <p className="mb-3 text-sm text-muted">
                      Exams
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {exams.map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            setExam(
                              exam === value
                                ? "All Exams"
                                : value
                            )
                          }
                          className={`rounded-full border px-3 py-2 text-xs transition ${
                            exam === value
                              ? "border-primary bg-primary text-black"
                              : "border-border text-muted hover:border-primary/60 hover:text-foreground"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 border-t border-border pt-5">
                    <p className="mb-3 text-sm text-muted">
                      Subjects
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {subjects.map((value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            setSubject(
                              subject === value
                                ? "All Subjects"
                                : value
                            )
                          }
                          className={`rounded-full border px-3 py-2 text-xs transition ${
                            subject === value
                              ? "border-primary bg-primary text-black"
                              : "border-border text-muted hover:border-primary/60 hover:text-foreground"
                          }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                {/* Library statistics */}

                <section className="rounded-panel border border-border bg-card p-5">
                  <h2 className="font-semibold">Your Library</h2>

                  <div className="mt-5 space-y-5">
                    <StatRow
                      icon={Play}
                      label="Videos"
                      value={videoCount}
                    />

                    <StatRow
                      icon={ListVideo}
                      label="Playlists"
                      value={playlistCount}
                    />

                    <StatRow
                      icon={Folder}
                      label="Total Items"
                      value={items.length}
                    />

                    <StatRow
                      icon={CheckCircle2}
                      label="Completed Items"
                      value={completedCount}
                    />
                  </div>
                </section>

                {/* Motivation card */}

                <section className="relative overflow-hidden rounded-panel border border-primary/20 bg-primary-muted p-5">
                  <div className="absolute -bottom-8 -right-8 h-28 w-28 rounded-full border border-primary/10" />

                  <div className="relative">
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Atom size={25} />
                    </div>

                    <h2 className="font-semibold">
                      Better resources.
                    </h2>

                    <h2 className="font-semibold text-primary">
                      Better results.
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-muted">
                      Learn for free. Keep track of every step.
                    </p>
                  </div>
                </section>
              </aside>
            </div>
        {/* Add Video / Playlist modal */}
  
        <ModalBox
          isOpen={Boolean(modalType)}
          modalType={modalType}
          onClose={closeModal}
          register={register}
          errors={errors}
          handleSubmit={handleSubmit}
          addContent={addContent}
          playlistMsg={formError}
        />
    </>
  );
}

// --------------------------------------------------
// Reusable statistics row
// --------------------------------------------------

function StatRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-primary-muted text-primary">
        <Icon size={21} />
      </div>

      <div>
        <p className="text-sm text-muted">{label}</p>
        <p className="mt-0.5 text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}
