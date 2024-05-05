import { Container } from '@mui/material';
import Navbar from '@/components/navbar';

export default function Page() {
    return (
        <main>
            <Navbar />
            <Container maxWidth='lg'>
                <p>Homeworks check page</p>
            </Container>
        </main>
    );
}
