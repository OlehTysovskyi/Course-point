export type LessonContentBlock =
    | { id: string; type: "text"; content: string }
    | { id: string; type: "video"; url: string }
    | { id: string; type: "quiz"; question: string; options: string[]; correctIndex: number };

export type CourseItem =
    | {
        id: string;
        type: "lesson";
        title: string;
        content: string;
    }
    | {
        id: string;
        type: "module";
        title: string;
        config: object;
    };


