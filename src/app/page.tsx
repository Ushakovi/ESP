import { sql } from '@vercel/postgres';

export default async function Home() {
    const { rows } = await sql`SELECT * FROM users`;

    return (
        <div>
            <p>Main page</p>
            {rows.length > 0 &&
                rows.map((user) => (
                    <p key={user.id}>{`${user.name} by id: ${user.id}`}</p>
                ))}
        </div>
    );
}
