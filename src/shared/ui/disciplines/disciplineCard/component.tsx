'use client';

import { useState } from 'react';
import { Card } from '@mui/material';
import DisciplineDrawer from '@/shared/ui/disciplines/disciplineDrawer';
import { Discipline } from '@/shared/types';
import styles from './components.module.css';

export default function Component({ discipline }: { discipline: Discipline }) {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(!open);
    };

    return (
        <>
            <Card
                sx={{
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
                    <p className={styles.card__name}>{discipline.name}</p>
                </div>
            </Card>
            <DisciplineDrawer isOpen={open} setOpen={setOpen} discipline={discipline} />
        </>
    );
}
