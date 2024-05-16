'use client';

import { useContext, useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { UserInfoContext } from '@/utils/client/userInfoProvider';
import LessonCard from '@/components/lessons/lessonCard';
import CreateLessonModal from '@/components/lessons/lessonCreateModal';
import { Discipline, Lesson } from '@/types';
import styles from './components.module.css';

export default function Component({ discipline }: { discipline: Discipline }) {
    const userInfo: any = useContext(UserInfoContext);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [lessonsLoading, setLessonsLoading] = useState(true);
    const [createLessonModalIsOpen, setCreateLessonModalIsOpen] = useState(false);

    useEffect(() => {
        const fetchDisciplines = async () => {
            const res = await fetch(`/api/lessons?discipline_id=${discipline.id}`);
            const disciplines = await res.json();
            setLessons(disciplines.data);
            setLessonsLoading(false);
        };
        fetchDisciplines();
    }, [discipline.id]);

    if (lessonsLoading) {
        return (
            <div className={styles.loader}>
                <CircularProgress />
            </div>
        );
    }

    const toggleCreateLessonModal = () => {
        setCreateLessonModalIsOpen(!createLessonModalIsOpen);
    };

    return (
        <>
            <div className={styles.lessons}>
                <h2>Уроки</h2>
                {userInfo.role.toLowerCase() === 'преподователь' && discipline.creator_id === userInfo.id && (
                    <Button type='button' variant='contained' onClick={toggleCreateLessonModal}>
                        <AddIcon fontSize='small' />
                        Создать
                    </Button>
                )}
            </div>
            <div className={styles.lessons__list}>
                {lessons.length > 0 ? (
                    lessons.map((lesson) => <LessonCard key={lesson.id} lesson={lesson} />)
                ) : (
                    <p className={styles.lessons__emptyText}>Нет уроков</p>
                )}
            </div>
            <CreateLessonModal
                isOpen={createLessonModalIsOpen}
                setIsOpen={setCreateLessonModalIsOpen}
                discipline={discipline}
            />
        </>
    );
}
