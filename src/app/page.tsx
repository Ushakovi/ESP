import { Container } from '@mui/material';
import Navbar from '@/components/navbar';

export default function Home() {
    return (
        <main>
            <Navbar />
            <Container maxWidth='lg'>
                <p>Main page</p>
            </Container>
        </main>
    );
}
