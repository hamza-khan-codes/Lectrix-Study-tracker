
import { useEffect, useState } from "react";
import {
  Play,
  Pause,


  ChevronLeft,
  ChevronRight,
  Check,
  Circle,
  GraduationCap,
  FlaskConical,
  Clock,
  ListVideo,

  NotebookPen,
  FileText,
  ExternalLink,
  ArrowLeft,
  PlayCircle,
} from "lucide-react";
import { fetchPlaylistVideos } from "../../service/youtube/youtube";
import getFormateDuration from "../../utils/getFormateDuration";
import ROUTES from "../../constant/routes";
import { useNavigate, useParams } from "react-router-dom";

const initialLectures = [
  {
    id: 1,
    title: "Lecture 1",
    duration: "--:--",
    videoId: "",
    thumbnail: ``
  }
];



export default function StudyRoom() {
  const navigate  = useNavigate()
  const {playlistID} = useParams()
  const [lectures, setLectures] = useState(initialLectures);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Overview");
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState("");
  const [playing, setPlaying] = useState(false);

  const playlistInfo = {
    title: "Organic Chemistry",
    subject:"Physics",
    exam:"ECAT"
  }

  const currentLecture = lectures[currentIndex];
  const completedCount = lectures.filter((lecture) => lecture?.completed).length;
  const progress = Math.round((completedCount / lectures.length) * 100);
  
  useEffect(() => {

    const fetchData = async () => {
      if(!playlistID) return 
      const videos = await fetchPlaylistVideos(`https://youtube.com/playlist?list=${playlistID}&si=w32Oz9N4vkWBvCEr`)
      console.log(videos)
      const withIds = videos?.map((v,i)=>({
        ...v,
        id: i + 1
      }))
      if(Array.isArray(videos) && videos.length !== 0){
        setLectures(withIds)
      }
    }
    fetchData()
  }, [])
  

  const toggleCompleted = () => {
    setLectures((previous) =>
      previous.map((lecture, index) =>
        index === currentIndex
          ? { ...lecture, completed: !lecture?.completed }
          : lecture
      )
    );
  };

  const goToLecture = (index) => {
    if (index >= 0 && index < lectures.length) {
      setCurrentIndex(index);
      setPlaying(false);
    }
  };

  const filteredLectures = lectures.filter((lecture) =>
    lecture?.title.toLowerCase().includes(search.toLowerCase())
  );

  const formatCount = (number) => String(number).padStart(2, "0");


  const getVideoIdHandle = (url) => {
    const parsed = new URL(url);
    let videoId = parsed.searchParams.get("v");

    if (parsed.hostname === "youtu.be") {
      videoId = parsed.pathname.slice(1);
    }
    if (
      !(videoId &&
      /^[\w-]{11}$/.test(videoId))
    ) return null
      return videoId
  }

  console.log(lectures)
  

  return (
    <div className="p-4 md:p-7">
      <button
        onClick={() => (navigate(ROUTES.STUDY_LIBRARY))}
        className="mb-5 flex items-center gap-2 text-sm text-muted transition hover:text-primary"
      >
        <ArrowLeft size={18} />
        Back to Library
      </button>

      <div className="grid grid-cols-1 gap-7 2xl:grid-cols-[minmax(0,1fr)_398px]">
        {/* Video and lecture details */}
        <section className="min-w-0">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-5">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-black">
                  <Play fill="currentColor" size={22} />
                </div>
                <h1 className="text-xl font-bold md:text-2xl truncate">
                  {currentLecture?.title}
                </h1>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted">
                  <GraduationCap size={17} />
                  {playlistInfo?.exam}
                </span>
                <span className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted">
                  <FlaskConical size={17} />
                  {playlistInfo?.subject}
                </span>
                <span className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted">
                  <Play size={16} />
                  Video
                </span>
              </div>
            </div>

            <div className="w-full max-w-[260px]">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Playlist progress</span>
                <span className="font-semibold">{progress || 0}%</span>
              </div>
              <p className="mt-1 text-xs text-muted">
                {completedCount} / {lectures.length} completed
              </p>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress || 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Video player */}
          <div className="relative aspect-video overflow-hidden rounded-xl border border-border bg-black">

            {currentLecture?.videoId === ""? (

              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,#20242a_0%,#090b0e_70%)] p-6 text-center">
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-black shadow-lg shadow-primary/20">
                  <Play size={38} />
                </div>
                <p className="text-2xl font-bold md:text-4xl">
                  {currentLecture?.title}
                </p>
                <p className="mt-2 text-xl font-semibold text-primary">
                  Lecture {currentLecture.id}
                </p>
                <p className="mt-4 max-w-sm text-sm text-muted">
                  Add your YouTube video ID to play your actual lecture
                  here.
                </p>
                <button
                  onClick={() => {
                    const url = window.prompt(
                      "Paste your YouTube video URL:"
                    )

                    if (!url) return;

                    try {
                      const videoId = getVideoIdHandle(url)

                      if (
                        videoId 
                      ) {
                        setLectures((previous) =>
                          previous.map((lecture, index) =>
                            index === currentIndex
                              ? { ...lecture, videoId }
                              : lecture
                          )
                        );
                      } else {
                        alert("Please enter a valid YouTube video URL.");
                      }
                    } catch {
                      alert("Please enter a valid YouTube URL.");
                    }
                  }}
                  className="mt-5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-black transition hover:bg-primary-hover"
                >
                  Add YouTube Video
                </button>
              </div>
            ) : (
              <iframe
                key={currentLecture?.videoId}
                src={`https://www.youtube.com/embed/${currentLecture?.videoId}?controls=1&playsinline=1&rel=0`}
                title={currentLecture?.title}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            )}
          </div>

          {/* Player actions */}
          <div className="mt-4 flex flex-wrap gap-3 rounded-xl border border-border bg-card p-3">
            <button
              onClick={toggleCompleted}
              className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${currentLecture?.completed
                ? "border border-success/40 bg-success/10 text-success"
                : "bg-primary text-black hover:bg-primary-hover"
                }`}
            >
              <Check size={19} />
              {currentLecture?.completed
                ? "Completed — Undo"
                : "Mark as Completed"}
            </button>

            <button
              onClick={() => goToLecture(currentIndex - 1)}
              disabled={currentIndex === 0}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={19} />
              Previous
            </button>

            <button
              onClick={() => goToLecture(currentIndex + 1)}
              disabled={currentIndex === lectures.length - 1}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm transition hover:border-primary disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={19} />
            </button>

            <button
              onClick={() => setPlaying(!playing)}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm text-muted transition hover:border-primary hover:text-primary"
            >
              {playing ? <Pause size={18} /> : <Play size={18} />}
              {playing ? "Pause Status" : "Study Mode"}
            </button>
          </div>

          {/* Details tabs */}
          <div className="mt-4 rounded-2xl border border-border bg-card p-4 md:p-5">
            <div className="flex gap-7 border-b border-border">
              {[
                { label: "Overview", icon: FileText },
                { label: "Notes", icon: NotebookPen },
                { label: "Resources", icon: ExternalLink },
              ].map(({ label, icon: Icon }) => (
                <button
                  key={label}
                  onClick={() => setActiveTab(label)}
                  className={`flex items-center gap-2 border-b-2 px-1 pb-3 text-sm transition ${activeTab === label
                    ? "border-primary text-primary"
                    : "border-transparent text-muted hover:text-foreground"
                    }`}
                >
                  <Icon size={16} />
                  {label}
                </button>
              ))}
            </div>

            {activeTab === "Overview" && (
              <div className="grid gap-6 pt-5 md:grid-cols-2">
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <Clock className="mt-1 text-muted" size={21} />
                    <div>
                      <p className="text-xs text-muted">Duration</p>
                      <p className="mt-1 text-sm font-medium">
                        {getFormateDuration(currentLecture?.duration)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <GraduationCap
                      className="mt-1 text-muted"
                      size={23}
                    />
                    <div>
                      <p className="text-xs text-muted">Exam</p>
                      <p className="mt-1 text-sm font-medium">{playlistInfo?.exam}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FlaskConical
                      className="mt-1 text-muted"
                      size={22}
                    />
                    <div>
                      <p className="text-xs text-muted">Subject</p>
                      <p className="mt-1 text-sm font-medium">
                        {playlistInfo?.subject}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-border md:border-l md:pl-6 overflow-hidden">
                  <h3 className="mb-3 font-semibold">
                    About this lecture
                  </h3>
                  <p className="text-sm leading-6 text-muted line-clamp-6">
                    {currentLecture?.description}
                  </p>
                </div>
              </div>
            )}

            {activeTab === "Notes" && (
              <div className="pt-5">
                <label
                  htmlFor="lecture-notes"
                  className="mb-3 block text-sm font-medium"
                >
                  Your lecture notes
                </label>
                <textarea
                  id="lecture-notes"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Write important points, formulas, or questions..."
                  rows={6}
                  className="w-full resize-y rounded-xl border border-border bg-background p-4 text-sm outline-none placeholder:text-subtle focus:border-primary"
                />
                <p className="mt-2 text-xs text-muted">
                  Notes are currently stored in page state and will reset
                  when you refresh.
                </p>
              </div>
            )}

            {activeTab === "Resources" && (
              <div className="pt-5">
                <p className="text-sm leading-6 text-muted">
                  Add your lecture's PDF notes, practice questions, or
                  related study links here.
                </p>
                <p className="mt-3 text-xs text-muted">
                  Resource uploads and links are not connected yet.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Playlist panel */}
        <aside className="min-w-0">
          <div className="rounded-2xl border border-border bg-card p-3 md:p-4">
            <div className="flex items-center justify-between gap-3 px-1 py-2">
              <h2 className="flex items-center gap-3 font-semibold">
                <ListVideo size={23} />
                Lecture Playlist
              </h2>
              <span className="text-xs text-muted">
                {lectures.length} lectures
              </span>
            </div>

            <div className="mt-3 max-h-[610px] space-y-1 overflow-y-auto custom-scrollbar">
              {filteredLectures.map((lecture) => {
                const index = lectures.findIndex(
                  (item) => item.id === lecture.id
                );
                const active = index === currentIndex;

                return (
                  <button
                    key={lecture?.id}
                    onClick={() => goToLecture(index)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-2 text-left transition ${active
                      ? "border-primary bg-primary/5"
                      : "border-transparent hover:border-border hover:bg-background"
                      }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative flex aspect-video w-[94px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-[#171b21]">

                      {(lecture?.thumbnail !== "") && (lecture?.thumbnail !== null) ? <img src={lecture?.thumbnail} /> : <PlayCircle
                        size={25}
                        className="text-muted"
                      />}
                      <span className="absolute bottom-1 left-1 rounded bg-black/80 px-1.5 py-0.5 text-[9px] text-primary">
                        {formatCount(lecture?.id)}
                      </span>
                      <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-black">
                        <Play size={13} fill="currentColor" />
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs font-semibold leading-5 md:text-sm">
                        {lecture?.id}. {lecture?.title}
                      </p>
                      <p className="mt-2 text-xs text-muted">
                        {lecture?.duration}
                      </p>
                    </div>

                    <span className="shrink-0">
                      {lecture?.completed ? (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-black">
                          <Check size={13} strokeWidth={3} />
                        </span>
                      ) : (
                        <Circle
                          size={19}
                          className={
                            active ? "text-primary" : "text-subtle"
                          }
                        />
                      )}
                    </span>
                  </button>
                );
              })}

              {filteredLectures.length === 0 && (
                <p className="p-6 text-center text-sm text-muted">
                  No lectures found.
                </p>
              )}
            </div>

            <div className="mt-3 border-t border-border pt-3">
              <p className="mb-3 flex items-center justify-between text-sm">
                <span className="text-muted">Playlist completion</span>
                <span className="font-semibold text-primary">
                  {progress || 0}%
                </span>
              </p>
              <div className="h-2 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${progress || 0}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted">
                {completedCount} of {lectures.length} lectures completed
              </p>
            </div>
          </div>

          {/* Study tip */}
          <div className="mt-5 rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <GraduationCap size={26} />
              </div>
              <div>
                <h3 className="font-semibold">Keep learning</h3>
                <p className="mt-1 text-xs text-muted">
                  One lecture at a time.
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted">
              Consistency matters more than speed. Finish a lecture,
              review your notes, and keep moving toward your exam goal.
            </p>
          </div>
        </aside>
      </div>
    </div>

  );
}
