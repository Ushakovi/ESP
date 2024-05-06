'use client';

import { useState } from 'react';
import { TextField, Pagination as MaterialPagination, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { Discipline } from '@/types';
import Pagination from '@/utils/client/pagination';
import DisciplineCard from '@/components/disciplineCard';
import DisciplineModal from '@/components/disciplineCreateModal';
import styles from './components.module.css';

export default function Component({ disciplines }: { disciplines: Discipline[] }) {
    const [filteredList, setFilteredList] = useState<Discipline[]>(disciplines);
    const [page, setPage] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const pagination = new Pagination(filteredList, 5);
    const pages = pagination.getPages()[page];
    const cardsNotEmpry = pages && pages.length > 0;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = event.target.value;
        searchValue
            ? setFilteredList(disciplines.filter(({ name }) => name.toLowerCase().includes(searchValue.toLowerCase())))
            : setFilteredList(disciplines);
    };

    const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleModalOpen = () => {
        setModalIsOpen(true);
    };

    return (
        <>
            <div className={styles.search__wrapper}>
                <TextField
                    type='search'
                    label='Поиск по дисциплинам'
                    variant='standard'
                    className={styles.search__field}
                    onChange={handleChange}
                />
                <Button type='submit' variant='contained' onClick={handleModalOpen}>
                    <AddIcon fontSize='small' />
                    Создать
                </Button>
            </div>
            <div className={styles.cards}>
                {cardsNotEmpry ? (
                    pages.map((discipline) => <DisciplineCard key={discipline.id} discipline={discipline} />)
                ) : (
                    <p>Ничего нет</p>
                )}
            </div>
            {cardsNotEmpry && (
                <MaterialPagination
                    count={pagination.getPagesCount()}
                    page={page}
                    color='primary'
                    onChange={handleChangePage}
                />
            )}

            <DisciplineModal isOpen={modalIsOpen} setIsOpen={setModalIsOpen} />
        </>
    );
}
