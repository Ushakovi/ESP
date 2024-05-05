export default class Pagination<T> {
    pagesCount: number;
    pages: { [key: string]: T[] } = {};
    constructor(items: T[], itemsPerPage: number) {
        const tempItemsList = [...items];
        this.pagesCount = Math.ceil(tempItemsList.length / itemsPerPage);
        for (let i = 0; i < this.pagesCount; i++) {
            this.pages[i + 1] = tempItemsList.splice(0, itemsPerPage);
        }
    }

    getPagesCount() {
        return this.pagesCount;
    }

    getPages() {
        return this.pages;
    }
}
