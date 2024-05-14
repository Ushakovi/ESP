'use client';

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Breadcrumbs, Button, CircularProgress, Container, Link as MaterialLink } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { UserInfoContext } from '@/utils/client/userInfoProvider';
import Navbar from '@/components/navbar';
import DeleteConfirmModal from '@/components/deleteConfirmModal';
import { Lesson } from '@/types';
import styles from './page.module.css';

export default function Page({ params }: { params: { id: string } }) {
    const userInfo: any = useContext(UserInfoContext);
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [lessonLoading, setLessonLoading] = useState(true);
    const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState(false);
    const [needRefresh, setNeedRefresh] = useState(false);

    useEffect(() => {
        const fetchLesson = async () => {
            const res = await fetch(`/api/lessons/${params.id}`);
            const lesson = await res.json();
            setLesson(lesson.data);
            setLessonLoading(false);
        };
        fetchLesson();
    }, [params.id]);

    useEffect(() => {
        if (needRefresh) redirect(`/discipline/${lesson?.discipline_id}`);
    }, [lesson?.discipline_id, needRefresh]);

    if (lessonLoading)
        return (
            <main>
                <Navbar />
                <Container maxWidth='lg' sx={{ padding: '40px 0' }}>
                    <div className={styles.loader}>
                        <CircularProgress />
                    </div>
                </Container>
            </main>
        );

    if (!lesson) return null;

    const userIsCreator = userInfo.id === lesson.creator_id;

    const toggleDeleteConfirmModal = () => {
        setConfirmDeleteModalIsOpen(!confirmDeleteModalIsOpen);
    };

    const handleDelete = async () => {
        const res = await fetch(`/api/lessons/${lesson.id}`, { method: 'DELETE' });
        if (res.status === 200) {
            setNeedRefresh(true);
        } else {
            console.error(res.statusText);
        }
    };

    return (
        <main>
            <Navbar />
            <Container maxWidth='lg' sx={{ padding: '40px 0' }}>
                <Breadcrumbs sx={{ marginBottom: '20px' }}>
                    <Link href={`/`}>
                        <MaterialLink component='button' underline='hover'>
                            Дисциплины
                        </MaterialLink>
                    </Link>
                    <Link href={`/discipline/${lesson.discipline_id}`}>
                        <MaterialLink component='button' underline='hover'>
                            {lesson.discipline_name}
                        </MaterialLink>
                    </Link>
                    <p>{lesson.name}</p>
                </Breadcrumbs>
                <h1 className={styles.title}>{lesson.name}</h1>
                <div className={styles.creator}>
                    <p className={styles.creator__name}>
                        Создатель: {lesson.creator_name.split(' ').splice(0, 2).join(' ')}
                    </p>
                    {lesson.creator_email && (
                        <MaterialLink href={`mailto:${lesson.creator_email}`}>
                            <EmailIcon sx={{ width: '18px', height: '18px' }} />
                        </MaterialLink>
                    )}
                </div>
                <p className={styles.description}>{lesson.description}</p>
                {userIsCreator && (
                    <Button type='button' variant='contained' onClick={toggleDeleteConfirmModal}>
                        Удалить текущий урок
                    </Button>
                )}
            </Container>
            <DeleteConfirmModal
                isOpen={confirmDeleteModalIsOpen}
                setIsOpen={setConfirmDeleteModalIsOpen}
                handleDelete={handleDelete}
            />
        </main>
    );
}
