import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';

const saveFile = async (file: any) => {
    const pump = promisify(pipeline);
    const filename = file.name.replaceAll(' ', '_');
    const filePath = `./files/${filename}`;
    await pump(file.stream(), fs.createWriteStream(filePath));

    return filePath;
};

export default saveFile;
