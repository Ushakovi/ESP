export const downloadFileHandler = (fileName: string) => async () => {
    const response = await fetch(`/api/download?fileName=${fileName}`);

    if (response.status !== 200) {
        console.error(response.status, response.statusText);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
};
