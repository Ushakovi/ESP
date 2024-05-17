export interface Discipline {
    id: number;
    name: string;
    description: string;
    creator_id: number;
    creator_name: string;
    creator_email: string;
}
export interface Lesson {
    id: number;
    name: string;
    description: string;
    materials: string;
    lecture: string;
    discipline_id: number;
    discipline_name: string;
    creator_id: number;
    creator_name: string;
    creator_email: string;
}

export interface Homework {
    id: number;
    comment: string;
    materials: string;
    estimation_status: boolean;
    estimation_comment: string;
    user_id: number;
    user_name: string;
    user_email: string;
    lesson_id: number;
    lesson_creator_id: number;
    created_at: string;
}

export interface Comment {
    id: number;
    comment: string;
    homework_id: number;
    user_id: number;
    user_name: string;
    created_at: string;
}
