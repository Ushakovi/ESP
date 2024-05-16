'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { redirect } from 'next/navigation';
import { Button, Modal, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import { submitCreateLesson } from '@/utils/server/actions';
import { Discipline } from '@/types';
import styles from './component.module.css';

export default function Component({
    isOpen,
    setIsOpen,
    discipline,
}: {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    discipline: Discipline;
}) {
    const [formState, formAction] = useFormState(submitCreateLesson, null);
    const [materials, setMaterials] = useState<File[]>([]);
    const [lecture, setLecture] = useState<File | null>(null);
    const [buttonIsDisabled, setButtonIsDisabled] = useState(true);

    useEffect(() => {
        if (formState?.status === 200) {
            setIsOpen(false);
            redirect(`/discipline/${discipline.id}`);
        }

        if (formState?.status === 400) {
            console.error(formState.statusText);
        }
    }, [discipline, formState, setIsOpen]);

    const handleClose = () => setIsOpen(false);

    const handleFileChange = (type: 'materials' | 'lecture') => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return;
        }
        switch (type) {
            case 'materials': {
                const files = Array.from(event.target.files);
                setMaterials(files);
                break;
            }
            case 'lecture': {
                const file = event.target.files[0];
                setLecture(file);
                break;
            }
        }
    };

    return (
        <>
            <Modal open={isOpen} onClose={handleClose}>
                <div className={styles.modal}>
                    <form action={formAction} className={styles.modal__form}>
                        <div className={styles.modal__titleWrapper}>
                            <h3>Создание урока</h3>
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
                        <Button
                            sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            component='label'
                            variant='contained'
                            color='secondary'>
                            <CloudUploadIcon fontSize='small' />
                            Загрузите запись лекции
                            <input
                                hidden
                                name='lecture'
                                type='file'
                                accept='video/*'
                                multiple
                                onChange={handleFileChange('lecture')}
                            />
                        </Button>
                        {lecture && (
                            <div key={`${lecture.name} ${Math.random()}`} className={styles.modal__fileWrapper}>
                                <VideoFileIcon fontSize='small' />
                                <p>{lecture.name}</p>
                            </div>
                        )}
                        <Button
                            sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            component='label'
                            variant='contained'
                            color='secondary'>
                            <CloudUploadIcon fontSize='small' />
                            Загрузите дополнительные материалы
                            <input
                                hidden
                                name='materials'
                                type='file'
                                accept='.pdf, .doc, .docx'
                                multiple
                                onChange={handleFileChange('materials')}
                            />
                        </Button>
                        {materials.map((file: File) => (
                            <div key={`${file.name} ${Math.random()}`} className={styles.modal__fileWrapper}>
                                <AttachFileIcon fontSize='small' />
                                <p>{file.name}</p>
                            </div>
                        ))}
                        <Button type='submit' variant='contained' disabled={buttonIsDisabled}>
                            <span>Создать</span>
                        </Button>
                        <input hidden name='discipline_id' type='string' defaultValue={discipline.id} />
                    </form>
                </div>
            </Modal>
        </>
    );
}
