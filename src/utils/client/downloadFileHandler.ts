export const downloadFileHandler = (filePath: string) => async () => {
    const response = await fetch(`/api/download?filePath=${filePath}`);

    if (response.status !== 200) {
        console.error(response.status, response.statusText);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filePath.split('/')[filePath.split('/').length - 1];
    link.click();
};
