'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { redirect } from 'next/navigation';
import { Button, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { submitCreateHomework } from '@/shared/utils/server/actions';
import { Lesson } from '@/shared/types';
import styles from './component.module.css';

export default function Component({
    isOpen,
    setIsOpen,
    lesson,
}: {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    lesson: Lesson;
}) {
    const [formState, formAction] = useFormState(submitCreateHomework, null);
    const [materials, setMaterials] = useState<File[]>([]);

    useEffect(() => {
        if (formState?.status === 200) {
            setIsOpen(false);
            redirect(`/lesson/${lesson.id}`);
        }

        if (formState?.status === 400) {
            console.error(formState.statusText);
        }
    }, [lesson, formState, setIsOpen]);

    const handleClose = () => setIsOpen(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return;
        }

        const files = Array.from(event.target.files);
        setMaterials(files);
    };

    return (
        <>
            <Modal open={isOpen} onClose={handleClose}>
                <div className={styles.modal}>
                    <form action={formAction} className={styles.modal__form}>
                        <div className={styles.modal__titleWrapper}>
                            <h3>Оставить домашнюю работу</h3>
                            <CloseIcon sx={{ cursor: 'pointer' }} onClick={handleClose} />
                        </div>
                        <textarea className={styles.modal__formTextarea} name='comment' placeholder='Комментарий' />
                        <Button
                            sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            component='label'
                            variant='contained'
                            color='secondary'>
                            <CloudUploadIcon fontSize='small' />
                            Загрузите материалы
                            <input
                                hidden
                                name='materials'
                                type='file'
                                accept='.pdf, .doc, .docx'
                                multiple
                                required
                                onChange={handleFileChange}
                            />
                        </Button>
                        {materials.map((file: File) => (
                            <div key={`${file.name} ${Math.random()}`} className={styles.modal__fileWrapper}>
                                <AttachFileIcon fontSize='small' />
                                <p>{file.name}</p>
                            </div>
                        ))}
                        <Button type='submit' variant='contained'>
                            <span>Создать</span>
                        </Button>
                        <input hidden name='lesson_id' type='string' defaultValue={lesson.id} />
                    </form>
                </div>
            </Modal>
        </>
    );
}
