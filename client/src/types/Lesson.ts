export type LessonContentBlock =
    | { id: string; type: "text"; content: string }
    | { id: string; type: "video"; url: string }
    | { id: string; type: "quiz"; question: string; options: string[]; correctIndex: number };