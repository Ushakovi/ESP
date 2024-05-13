'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { redirect } from 'next/navigation';
import { Alert, Button, Modal, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { submitCreateDiscipline } from '@/utils/server/actions';
import styles from './component.module.css';

export default function Component({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const [alertShow, setAlertShow] = useState<{
        alertStatus: string;
        alertText: string;
    } | null>(null);
    const [formState, formAction] = useFormState(submitCreateDiscipline, null);

    useEffect(() => {
        if (formState?.status === 200) {
            setIsOpen(false);
            setTimeout(() => setAlertShow(null), 2000);
            redirect('/');
        }

        if (formState?.status === 400) {
            setTimeout(() => setAlertShow(null), 2000);
            setAlertShow({
                alertStatus: 'error',
                alertText: formState.statusText,
            });
        }
    }, [formState, setIsOpen]);

    const handleClose = () => setIsOpen(false);

    return (
        <>
            {alertShow && (
                <Alert
                    sx={{ width: '95%', position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)' }}
                    severity={alertShow.alertStatus === 'success' ? 'success' : 'error'}
                    onClose={() => setAlertShow(null)}>
                    {alertShow.alertText}
                </Alert>
            )}
            <Modal open={isOpen} onClose={handleClose}>
                <div className={styles.modal}>
                    <form action={formAction} className={styles.modal__form}>
                        <div className={styles.modal__titleWrapper}>
                            <h3>Создание дисциплины</h3>
                            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
                        </div>
                        <TextField
                            name='name'
                            label='Название'
                            placeholder='Название'
                            variant='outlined'
                            type='text'
                            required
                        />
                        <textarea className={styles.modal__formTextarea} name='description' placeholder='Описание' />
                        <Button type='submit' variant='contained'>
                            <span>Создать</span>
                        </Button>
                    </form>
                </div>
            </Modal>
        </>
    );
}
