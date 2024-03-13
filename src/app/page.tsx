import { sql } from '@vercel/postgres';
// import styles from './page.module.css';

export default async function Home() {
    const { rows } = await sql`SELECT * FROM users`;

    return (
        <main>
            <p>Main page</p>
            {rows.length > 0 &&
                rows.map((user) => (
                    <p key={user.id}>{`${user.name} by id: ${user.id}`}</p>
                ))}
        </main>
    );
}
