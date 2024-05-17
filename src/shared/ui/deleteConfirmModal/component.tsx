'use client';

import { Dispatch, SetStateAction } from 'react';
import { Button, Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import styles from './component.module.css';

export default function Component({
    isOpen,
    setIsOpen,
    handleDelete,
}: {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    handleDelete: () => Promise<void>;
}) {
    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const handleClose = () => setIsOpen(false);

    return (
        <Modal open={isOpen} onClose={handleClose}>
            <div className={styles.modal}>
                <div className={styles.modal__titleWrapper}>
                    <h3>Подтверждаете ли вы удаление?</h3>
                    <CloseIcon sx={{ cursor: 'pointer' }} onClick={toggleModal} />
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
    );
}
