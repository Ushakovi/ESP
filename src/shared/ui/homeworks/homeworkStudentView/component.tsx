'use client';

import { useContext, useEffect, useState } from 'react';
import { Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { UserInfoContext } from '@/shared/utils/client/userInfoProvider';
import HomeworkCard from '@/shared/ui/homeworks/homeworkCard';
import CreateHomeworkModal from '@/shared/ui/homeworks/homeworkCreateModal';
import { Lesson, Homework } from '@/shared/types';
import styles from './component.module.css';

export default function Component({ lesson }: { lesson: Lesson }) {
    const userInfo: any = useContext(UserInfoContext);
    const [homework, setHomework] = useState<Homework | null>(null);
    const [homeworkLoading, setHomeworkLoading] = useState(true);
    const [createHomeworkModalIsOpen, setCreateHomeworkModalIsOpen] = useState(false);

    useEffect(() => {
        const fetchHomework = async () => {
            const res = await fetch(`/api/homeworks?lesson_id=${lesson.id}&user_id=${userInfo.id}`);
            const homework = await res.json();
            setHomework(homework.data);
            setHomeworkLoading(false);
        };
        fetchHomework();
    }, [lesson, userInfo.id]);

    const toggleCreateHomeworkModal = () => {
        setCreateHomeworkModalIsOpen(!createHomeworkModalIsOpen);
    };

    if (homeworkLoading) {
        return <CircularProgress />;
    }

    if (homework) {
        return <HomeworkCard homework={homework} />;
    }

    return (
        <>
            <div className={styles.wrapper}>
                <p>Вы еще не оставляли свою домашнюю работу</p>
                <Button type='button' variant='contained' onClick={toggleCreateHomeworkModal}>
                    <AddIcon fontSize='small' />
                    Загрузить
                </Button>
            </div>
            <CreateHomeworkModal
                isOpen={createHomeworkModalIsOpen}
                setIsOpen={setCreateHomeworkModalIsOpen}
                lesson={lesson}
            />
        </>
    );
}
