'use client';

import { useState } from 'react';
import { Card, CardContent, TextField, Pagination as MaterialPagination } from '@mui/material';
import { Discipline } from '@/types';
import Pagination from '@/utils/client/pagination';
import styles from './components.module.css';

export default function Component({ disciplines }: { disciplines: Discipline[] }) {
    const [filteredList, setFilteredList] = useState<Discipline[]>(disciplines);
    const [page, setPage] = useState(1);

    const pagination = new Pagination(filteredList, 6);
    const pages = pagination.getPages()[page];

    const handleClick = (discipline: Discipline) => () => {
        console.log(discipline);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = event.target.value;
        searchValue
            ? setFilteredList(disciplines.filter(({ name }) => name.toLowerCase().includes(searchValue.toLowerCase())))
            : setFilteredList(disciplines);
    };

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <>
            <TextField
                type='search'
                label='Поиск по дисциплинам'
                variant='standard'
                className={styles.search}
                onChange={handleChange}
            />
            <div className={styles.cards}>
                {pages.map((discipline) => (
                    <Card key={discipline.id} className={styles.card} onClick={handleClick(discipline)}>
                        <CardContent>
                            <div className={styles.card__box}>
                                <p className={styles.card__name}>{discipline.name}</p>
                                <p>Создатель: {discipline.creator_name.split(' ').splice(0, 2).join(' ')}</p>
                            </div>
                            <p>
                                {discipline.description} Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde
                                repellat, quas a in libero, illo autem magni nihil ipsa distinctio repellendus iure
                                inventore vitae totam sint officia dolorum suscipit nisi. Consequatur mollitia
                                doloremque cupiditate aperiam. In quis libero, eaque aperiam suscipit ad praesentium,
                                omnis illo, dolor saepe asperiores esse! Quis impedit molestias eveniet praesentium
                                soluta asperiores labore fugiat quam in?
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
            <MaterialPagination
                count={pagination.getPagesCount()}
                page={page}
                color='primary'
                onChange={handleChangePage}
            />
        </>
    );
}
