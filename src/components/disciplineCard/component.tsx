'use client';

import { useState } from 'react';
import { Card } from '@mui/material';
import { Discipline } from '@/types';
import DisciplineDrawer from '@/components/disciplineDrawer';
import styles from './components.module.css';

export default function Component({ discipline }: { discipline: Discipline }) {
    const [open, setOpen] = useState(false);

    const handleClick = (discipline: Discipline) => () => {
        console.log(discipline);
        setOpen(!open);
    };

    return (
        <>
            <Card className={styles.card} onClick={handleClick(discipline)}>
                <div className={styles.card__box}>
                    <p className={styles.card__name}>{discipline.name}</p>
                </div>
            </Card>
            <DisciplineDrawer isOpen={open} setOpen={setOpen} discipline={discipline} />
        </>
    );
}
