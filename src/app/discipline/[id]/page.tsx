'use client';

import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Breadcrumbs, Button, CircularProgress, Container, Link as MaterialLink } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { UserInfoContext } from '@/shared/utils/client/userInfoProvider';
import Navbar from '@/shared/ui/navbar';
import LessonsList from '@/shared/ui/lessons/lessonsList';
import DeleteConfirmModal from '@/shared/ui/deleteConfirmModal';
import { Discipline } from '@/shared/types';
import styles from './page.module.css';

export default function Page({ params }: { params: { id: string } }) {
    const userInfo: any = useContext(UserInfoContext);
    const [discipline, setDiscipline] = useState<Discipline | null>(null);
    const [disciplineLoading, setDisciplineLoading] = useState(true);
    const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState(false);
    const [needRefresh, setNeedRefresh] = useState(false);

    useEffect(() => {
        const fetchDiscipline = async () => {
            const res = await fetch(`/api/disciplines/${params.id}`);
            const discipline = await res.json();
            setDiscipline(discipline.data);
            setDisciplineLoading(false);
        };
        fetchDiscipline();
    }, [params.id]);

    useEffect(() => {
        if (needRefresh) redirect('/');
    }, [needRefresh]);

    if (disciplineLoading)
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

    if (!discipline) return null;

    const userIsCreator = userInfo.id === discipline.creator_id;

    const toggleDeleteConfirmModal = () => {
        setConfirmDeleteModalIsOpen(!confirmDeleteModalIsOpen);
    };

    const handleDelete = async () => {
        const res = await fetch(`/api/disciplines/${discipline.id}`, { method: 'DELETE' });
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
                    <p>{discipline.name}</p>
                </Breadcrumbs>
                <h1 className={styles.title}>{discipline.name}</h1>
                <div className={styles.creator}>
                    <p className={styles.creator__name}>
                        Создатель: {discipline.creator_name.split(' ').splice(0, 2).join(' ')}
                    </p>
                    {discipline.creator_email && (
                        <MaterialLink href={`mailto:${discipline.creator_email}`}>
                            <EmailIcon sx={{ width: '18px', height: '18px' }} />
                        </MaterialLink>
                    )}
                </div>
                <p className={styles.description}>{discipline.description}</p>
                <LessonsList discipline={discipline} />
                {userIsCreator && (
                    <Button type='button' variant='contained' onClick={toggleDeleteConfirmModal}>
                        Удалить текущую дисциплину
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
