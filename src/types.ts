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
    meterials: string;
    lecture: string;
    discipline_id: number;
    creator_id: number;
    creator_name: string;
    creator_email: string;
}
