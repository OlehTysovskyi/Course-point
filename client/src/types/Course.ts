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