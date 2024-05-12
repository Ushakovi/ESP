'use client';

import { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Button, Drawer, Link as MaterialLink, Modal } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CloseIcon from '@mui/icons-material/Close';
import { UserInfoContext } from '@/utils/client/userInfoProvider';
import { Discipline } from '@/types';
import styles from './components.module.css';

export default function Component({
    isOpen,
    setOpen,
    discipline,
}: {
    isOpen: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    discipline?: Discipline;
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
                                <EmailIcon className={styles.drawer__creatorIcon} />
                            </MaterialLink>
                        )}
                    </div>
                    <p className={styles.drawer__description}>{discipline.description}</p>
                </div>
                <div className={styles.drawer__actions}>
                    {userIsCreator && (
                        <Button type='button' variant='contained' onClick={toggleModal}>
                            Удалить
                        </Button>
                    )}
                    <Link href={`/discipline/${discipline.id}`}>
                        <MaterialLink component='button' underline='hover' className={styles.navbar__link}>
                            Подробнее
                        </MaterialLink>
                    </Link>
                </div>
            </Drawer>
            <Modal open={confirmDeleteModalIsOpen} onClose={toggleModal}>
                <div className={styles.modal}>
                    <div className={styles.modal__titleWrapper}>
                        <h3>Подтверждаете ли вы удаление?</h3>
                        <CloseIcon className={styles.modal__closeIcon} onClick={toggleModal} />
                    </div>
                    <div className={styles.modal__actions}>
                        <Button type='button' variant='contained' onClick={handleDelete}>
                            Подтвердить
                        </Button>
                        <Button type='button' variant='outlined' onClick={toggleModal}>
                            Закрыть
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
