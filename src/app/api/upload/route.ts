import path from 'path';
import { writeFile } from 'fs/promises';

export const POST = async (req: any) => {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
        return new Response(JSON.stringify({ message: 'No files received' }), {
            status: 400,
        });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const filename = file.name.replaceAll(' ', '_');
    console.log(filename);

    try {
        await writeFile(path.join(process.cwd(), 'files/' + filename), buffer);

        return new Response(JSON.stringify({ message: 'Success' }), {
            status: 201,
        });
    } catch (error) {
        console.log('Failed ', error);
        return new Response(JSON.stringify({ message: 'Failed' }), {
            status: 500,
        });
    }
};
