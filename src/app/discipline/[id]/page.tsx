export default function Page({ params }: { params: { id: string } }) {
    return (
        <main>
            <p>Discipline page by id: {params.id}</p>
        </main>
    );
}
