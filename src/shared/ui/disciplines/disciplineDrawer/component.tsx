'use client';

import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button, Divider, Drawer, Link as MaterialLink } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { UserInfoContext } from '@/shared/utils/client/userInfoProvider';
import DeleteConfirmModal from '@/shared/ui/deleteConfirmModal';
import { Discipline } from '@/shared/types';
import styles from './components.module.css';

export default function Component({
    isOpen,
    setOpen,
    discipline,
}: {
    isOpen: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    discipline: Discipline;
}) {
    const userInfo: any = useContext(UserInfoContext);
    const [needRefresh, setNeedRefresh] = useState(false);
    const [confirmDeleteModalIsOpen, setConfirmDeleteModalIsOpen] = useState(false);

    useEffect(() => {
        if (needRefresh) redirect('/');
    }, [needRefresh]);

    if (!discipline) return null;

    const userIsCreator = userInfo.id === discipline.creator_id;

    const toggleDrawer = () => {
        setOpen(!isOpen);
    };

    const toggleModal = () => {
        setConfirmDeleteModalIsOpen(!confirmDeleteModalIsOpen);
    };

    const handleDelete = async () => {
        const res = await fetch(`/api/disciplines/${discipline.id}`, { method: 'DELETE' });
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
                    <h2 className={styles.drawer__title}>{discipline.name}</h2>
                    <div className={styles.drawer__creatorWrapper}>
                        <p className={styles.drawer__creatorName}>
                            Создатель: {discipline.creator_name.split(' ').splice(0, 2).join(' ')}
                        </p>
                        {discipline.creator_email && (
                            <MaterialLink href={`mailto:${discipline.creator_email}`}>
                                <EmailIcon sx={{ width: ' 18px', height: '18px' }} />
                            </MaterialLink>
                        )}
                    </div>
                    <p className={styles.drawer__description}>{discipline.description}</p>
                </div>
                <div className={styles.drawer__footer}>
                    <Divider />
                    <div className={styles.drawer__actions}>
                        {userIsCreator && (
                            <Button type='button' variant='contained' onClick={toggleModal}>
                                Удалить
                            </Button>
                        )}
                        <Link href={`/discipline/${discipline.id}`}>
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
