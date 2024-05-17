'use client';

import { useContext, useState } from 'react';
import { Button, Card } from '@mui/material';
import HomeworkEditModal from '@/shared/ui/homeworks/homeworkEditModal';
import HomeworkDrawer from '@/shared/ui/homeworks/homeworkDrawer';
import { UserInfoContext } from '@/shared/utils/client/userInfoProvider';
import { Homework } from '@/shared/types';
import styles from './component.module.css';

export default function Component({ homework }: { homework: Homework }) {
    const userInfo: any = useContext(UserInfoContext);
    const [open, setOpen] = useState(false);
    const [editHomeworkModalIsOpen, setEditHomeworkModalIsOpen] = useState(false);

    const toggleEditHomeworkModal = () => {
        setEditHomeworkModalIsOpen(!editHomeworkModalIsOpen);
    };

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
            <div className={styles.card__wrapper}>
                <Card
                    sx={{
                        width: '100%',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: 'var(--second-light-color)',
                        transition: 'background-color 0.5s',
                        '&:hover': {
                            backgroundColor: 'var(--second-color)',
                        },
                    }}
                    onClick={handleClick}>
                    <div className={styles.card__box}>
                        <div className={styles.card__row}>
                            <p className={styles.card__userName}>
                                {homework.user_name.split(' ').splice(0, 2).join(' ')}
                            </p>

                            {homework.estimation_status ? (
                                <p className={styles.card__estimationStatusSuccess}>Оценено</p>
                            ) : (
                                <p className={styles.card___estimationStatusFailed}>Не оценено</p>
                            )}
                        </div>
                    </div>
                </Card>
                {!homework.estimation_status && homework.user_id === userInfo.id && (
                    <Button type='button' variant='contained' onClick={toggleEditHomeworkModal}>
                        Редактировать
                    </Button>
                )}
            </div>
            <HomeworkEditModal
                isOpen={editHomeworkModalIsOpen}
                setIsOpen={setEditHomeworkModalIsOpen}
                homework={homework}
            />
            <HomeworkDrawer isOpen={open} setOpen={setOpen} homework={homework} />
        </>
    );
}
