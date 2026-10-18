import { X } from "lucide-react";

export default function ModalBox({
    modalType = "Video",
    playlistMsg = null,
    isOpen = false,
    onClose,
    addContent,
    register,
    errors = {},
    handleSubmit,

    subjects = [
        { value: "biology", label: "Biology" },
        { value: "chemistry", label: "Chemistry" },
        { value: "physics", label: "Physics" },
        { value: "mathematics", label: "Mathematics" },
        { value: "english", label: "English" },
    ],

    exams = [
        { value: "mdcat", label: "MDCAT" },
        { value: "ecat", label: "ECAT" },
        { value: "nums", label: "NUMS" },
        { value: "pmdc", label: "PMDC" },
        { value: "other", label: "Other" },
    ],
}) {
    if (!isOpen) return null;

    const inputClass =
        "mt-2 w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary";

    const selectClass =
        "mt-2 w-full rounded-lg border border-border bg-background px-3 py-3 text-sm outline-none transition focus:border-primary";

    const labelClass = "block text-sm font-medium";

    const errorClass = "mt-1 text-xs text-red-500";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className="my-auto w-full max-w-lg rounded-panel border border-border bg-card p-6 shadow-2xl"
                onMouseDown={(event) => event.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2
                            id="modal-title"
                            className="text-xl font-bold"
                        >
                            Add {modalType}
                        </h2>

                        <p className="mt-2 text-sm text-muted">
                            Save free YouTube content to your study library.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close dialog"
                        className="rounded-lg p-2 text-muted transition hover:bg-card-hover hover:text-foreground"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form
                    onSubmit={handleSubmit(addContent)}
                    className="mt-6 space-y-4"
                >
                    {/* Title */}
                    <div>
                        <label
                            htmlFor="content-title"
                            className={labelClass}
                        >
                            Content title
                        </label>

                        <input
                            id="content-title"
                            type="text"
                            {...register("title")}
                            placeholder="e.g. MDCAT Biology Lectures"
                            aria-invalid={Boolean(errors.title)}
                            className={inputClass}
                        />

                        {errors.title?.message && (
                            <p className={errorClass}>
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    {/* YouTube URL */}
                    <div>
                        <label
                            htmlFor="content-url"
                            className={labelClass}
                        >
                            YouTube {modalType} URL
                        </label>

                        <input
                            id="content-url"
                            type="url"
                            {...register("url")}
                            placeholder={
                                modalType === "Video"
                                    ? "https://youtube.com/watch?v=..."
                                    : "https://youtube.com/playlist?list=..."
                            }
                            aria-invalid={Boolean(errors.url)}
                            className={inputClass}
                        />

                        {errors.url?.message && (
                            <p className={errorClass}>
                                {errors.url.message}
                            </p>
                        )}
                    </div>

                    {/* Exam and Subject */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="content-exam"
                                className={labelClass}
                            >
                                Exam
                            </label>

                            <select
                                id="content-exam"
                                {...register("exam")}
                                className={selectClass}
                                aria-invalid={Boolean(errors.exam)}
                            >
                                {exams.map((exam) => (
                                    <option
                                        key={exam.value}
                                        value={exam.value}
                                    >
                                        {exam.label}
                                    </option>
                                ))}
                            </select>

                            {errors.exam?.message && (
                                <p className={errorClass}>
                                    {errors.exam.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="content-subject"
                                className={labelClass}
                            >
                                Subject
                            </label>

                            <select
                                id="content-subject"
                                {...register("subject")}
                                className={selectClass}
                                aria-invalid={Boolean(errors.subject)}
                            >
                                {subjects.map((subject) => (
                                    <option
                                        key={subject.value}
                                        value={subject.value}
                                    >
                                        {subject.label}
                                    </option>
                                ))}
                            </select>

                            {errors.subject?.message && (
                                <p className={errorClass}>
                                    {errors.subject.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Playlist Information */}
                    {modalType === "Playlist" && (
                        <p className="rounded-lg border border-border bg-background p-3 text-xs leading-5 text-muted">
                            {playlistMsg ||
                                "This prototype saves the playlist link. Importing and tracking each lecture requires YouTube API integration."}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 rounded-lg border border-border px-4 py-3 text-sm text-muted transition hover:bg-card-hover"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-black transition hover:bg-primary-hover"
                        >
                            Add to Library
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}