export default function Page({ params }: { params: { id: string } }) {
    return (
        <main>
            <p>Lesson page by id: {params.id}</p>
        </main>
    );
}
