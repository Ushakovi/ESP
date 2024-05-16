import fs from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';

const saveFile = async (file: any, folder: 'materials' | 'lectures' | 'homeworks') => {
    const pump = promisify(pipeline);
    if (file && file.size) {
        const filename = Buffer.from(file.name.replaceAll(' ', '_'), 'latin1').toString('utf8');
        const filePath = `./files/${folder}/${filename}`;
        await pump(file.stream(), fs.createWriteStream(filePath));
        return filePath;
    }
    return;
};

export default saveFile;
