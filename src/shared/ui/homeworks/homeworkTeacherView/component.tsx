'use client';

import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import HomeworkCard from '@/shared/ui/homeworks/homeworkCard';
import { Lesson, Homework } from '@/shared/types';
import styles from './component.module.css';

export default function Component({ lesson }: { lesson: Lesson }) {
    const [homeworks, setHomeworks] = useState<Homework[]>([]);
    const [homeworksLoading, setHomeworksLoading] = useState(true);

    useEffect(() => {
        const fetchHomework = async () => {
            const res = await fetch(`/api/homeworks?lesson_id=${lesson.id}`);
            const homeworks = await res.json();
            setHomeworks(homeworks.data);
            setHomeworksLoading(false);
        };
        fetchHomework();
    }, [lesson]);

    if (homeworksLoading) {
        return <CircularProgress />;
    }

    return (
        <div className={styles.wrapper}>
            {homeworks.length > 0 ? (
                homeworks.map((homework) => <HomeworkCard key={homework.id} homework={homework} />)
            ) : (
                <p>Домашнюю работу никто не оставлял</p>
            )}
        </div>
    );
}
