'use client';

import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button, Divider, Drawer, Link as MaterialLink } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import { UserInfoContext } from '@/shared/utils/client/userInfoProvider';
import { downloadFileHandler } from '@/shared/utils/client/downloadFileHandler';
import DeleteConfirmModal from '@/shared/ui/deleteConfirmModal';
import { Lesson } from '@/shared/types';
import styles from './components.module.css';

export default function Component({
    isOpen,
    setOpen,
    lesson,
}: {
    isOpen: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    lesson: Lesson;
}) {
    const userInfo: any = useContext(UserInfoContext);
    const [needRefresh, setNeedRefresh] = useState(false);
    const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState(false);

    useEffect(() => {
        if (needRefresh) redirect(`/discipline/${lesson.discipline_id}`);
    }, [lesson.discipline_id, needRefresh]);

    if (!lesson) return null;

    const userIsCreator = userInfo.id === lesson.creator_id;

    const toggleDrawer = () => {
        setOpen(!isOpen);
    };

    const toggleModal = () => {
        setConfirmDeleteModalIsOpen(!confirmDeleteModalIsOpen);
    };

    const handleDelete = async () => {
        const res = await fetch(`/api/lessons/${lesson.id}`, { method: 'DELETE' });
        if (res.status === 200) {
            setOpen(false);
            setNeedRefresh(true);
        } else {
            console.error(res.statusText);
        }
    };

    return (
        <>
            <Drawer anchor='right' open={isOpen} onClose={toggleDrawer}>
                <div className={styles.drawer__body}>
                    <h2 className={styles.drawer__title}>{lesson.name}</h2>
                    <div className={styles.drawer__creatorWrapper}>
                        <p className={styles.drawer__creatorName}>
                            Создатель: {lesson.creator_name.split(' ').splice(0, 2).join(' ')}
                        </p>
                        {lesson.creator_email && (
                            <MaterialLink href={`mailto:${lesson.creator_email}`}>
                                <EmailIcon sx={{ width: ' 18px', height: '18px' }} />
                            </MaterialLink>
                        )}
                    </div>
                    <p className={styles.drawer__description}>{lesson.description}</p>
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
                </div>
                <div className={styles.drawer__footer}>
                    <Divider />
                    <div className={styles.drawer__actions}>
                        {userIsCreator && (
                            <Button type='button' variant='contained' onClick={toggleModal}>
                                Удалить
                            </Button>
                        )}
                        <Link href={`/lesson/${lesson.id}`}>
                            <MaterialLink component='button' underline='hover'>
                                Подробнее
                            </MaterialLink>
                        </Link>
                    </div>
                </div>
            </Drawer>
            <DeleteConfirmModal
                isOpen={confirmDeleteModalIsOpen}
                setIsOpen={setConfirmDeleteModalIsOpen}
                handleDelete={handleDelete}
            />
        </>
    );
}
