import { sql } from '@vercel/postgres';
import { Container } from '@mui/material';
import Navbar from '@/components/navbar';
import DisciplinesList from '@/components/disciplinesList';
import { Discipline } from '@/types';

export default async function Home() {
    const { rows: disciplines } =
        await sql`SELECT ds.id, ds.name, ds.description, us.fullname as creator_name FROM disciplines ds join users us on ds.creator_id = us.id`;

    return (
        <main>
            <Navbar />
            <Container maxWidth='lg' sx={{ padding: '40px 0' }}>
                <DisciplinesList disciplines={disciplines as Discipline[]} />
            </Container>
        </main>
    );
}
