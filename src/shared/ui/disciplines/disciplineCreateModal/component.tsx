'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { redirect } from 'next/navigation';
import { Button, Modal, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { submitCreateDiscipline } from '@/shared/utils/server/actions';
import styles from './component.module.css';

export default function Component({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const [buttonIsDisabled, setButtonIsDisabled] = useState(true);
    const [formState, formAction] = useFormState(submitCreateDiscipline, null);

    useEffect(() => {
        if (formState?.status === 200) {
            setIsOpen(false);
            redirect('/');
        }

        if (formState?.status === 400) {
            console.error(formState.statusText);
        }
    }, [formState, setIsOpen]);

    const handleClose = () => setIsOpen(false);

    return (
        <>
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
                            onChange={(event) =>
                                event.target.value ? setButtonIsDisabled(false) : setButtonIsDisabled(true)
                            }
                        />
                        <textarea className={styles.modal__formTextarea} name='description' placeholder='Описание' />
                        <Button type='submit' variant='contained' disabled={buttonIsDisabled}>
                            <span>Создать</span>
                        </Button>
                    </form>
                </div>
            </Modal>
        </>
    );
}
