'use client';

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Breadcrumbs, Button, CircularProgress, Container, Link as MaterialLink } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import { UserInfoContext } from '@/shared/utils/client/userInfoProvider';
import { downloadFileHandler } from '@/shared/utils/client/downloadFileHandler';
import Navbar from '@/shared/ui/navbar';
import DeleteConfirmModal from '@/shared/ui/deleteConfirmModal';
import HomeworkBlock from '@/shared/ui/homeworks/homeworkBlock';
import { Lesson } from '@/shared/types';
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
                {lesson.lecture && (
                    <div className={styles.drawer__lecture}>
                        <p className={styles.drawer__lectureTitle}>Запись лекции</p>
                        <video width='100%' preload='none' controls>
                            <source
                                src={`${process.env.NEXT_PUBLIC_VIDEOS_SERVE_URL}/${lesson.lecture.replace('./files/lectures/', '')}`}
                            />
                        </video>
                        <div className={styles.drawer__fileWrapper}>
                            <VideoFileIcon fontSize='small' />
                            <Button variant='text' onClick={downloadFileHandler(lesson.lecture)}>
                                {lesson.lecture.split('/')[lesson.lecture.split('/').length - 1]}
                            </Button>
                        </div>
                    </div>
                )}
                {lesson.materials && (
                    <div className={styles.drawer__materials}>
                        <p className={styles.drawer__materialsTitle}>Дополнительные материалы</p>
                        {lesson.materials.split(';').map((filePath: string) => (
                            <div key={`${filePath} ${Math.random()}`} className={styles.drawer__fileWrapper}>
                                <AttachFileIcon fontSize='small' />
                                <Button variant='text' onClick={downloadFileHandler(filePath)}>
                                    {filePath.split('/')[filePath.split('/').length - 1]}
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
                <HomeworkBlock lesson={lesson} />
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
