'use client';

import { useState } from 'react';
import { Card } from '@mui/material';
import LessonDrawer from '@/components/lessons/lessonDrawer';
import { Lesson } from '@/types';
import styles from './components.module.css';

export default function Component({ lesson }: { lesson: Lesson }) {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
            <Card
                sx={{
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: 'var(--second-light-color)',
                    transition: 'background-color 0.5s',
                    '&:hover': {
                        backgroundColor: 'var(--second-color)',
                    },
                }}
                onClick={handleClick}>
                <div className={styles.card__box}>
                    <p className={styles.card__name}>{lesson.name}</p>
                </div>
            </Card>
            <LessonDrawer isOpen={open} setOpen={setOpen} lesson={lesson} />
        </>
    );
}
