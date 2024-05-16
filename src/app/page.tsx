'use client';

import { useEffect, useState } from 'react';
import { CircularProgress, Container } from '@mui/material';
import Navbar from '@/components/navbar';
import DisciplinesList from '@/components/disciplines/disciplinesList';
import { Discipline } from '@/types';
import styles from './page.module.css';

export default function Home() {
    const [disciplines, setDisciplines] = useState<Discipline[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDisciplines = async () => {
            const res = await fetch('/api/disciplines');
            const disciplines = await res.json();
            setDisciplines(disciplines.data);
            setLoading(false);
        };
        fetchDisciplines();
    }, []);

    return (
        <main>
            <Navbar />
            <Container maxWidth='lg' sx={{ padding: '40px 0' }}>
                {loading ? (
                    <div className={styles.loader}>
                        <CircularProgress />
                    </div>
                ) : (
                    <>
                        <h1 className={styles.title}>Дисциплины</h1>
                        <DisciplinesList disciplines={disciplines} />
                    </>
                )}
            </Container>
        </main>
    );
}
