'use client';

import { useContext, useState } from 'react';
import { TextField, Pagination as MaterialPagination, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { UserInfoContext } from '@/shared/utils/client/userInfoProvider';
import Pagination from '@/shared/utils/client/pagination';
import DisciplineCard from '@/shared/ui/disciplines/disciplineCard';
import DisciplineCreateModal from '@/shared/ui/disciplines/disciplineCreateModal';
import { Discipline } from '@/shared/types';
import styles from './components.module.css';

export default function Component({ disciplines }: { disciplines: Discipline[] }) {
    const [filteredList, setFilteredList] = useState<Discipline[]>(disciplines);
    const [page, setPage] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const userInfo: any = useContext(UserInfoContext);

    const pagination = new Pagination(filteredList, 10);
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
                    sx={{ width: '100%', marginBottom: '20px' }}
                    onChange={handleChange}
                />
                {userInfo.role.toLowerCase() === 'преподователь' && (
                    <Button type='button' variant='contained' onClick={handleModalOpen}>
                        <AddIcon fontSize='small' />
                        Создать
                    </Button>
                )}
            </div>
            <div className={styles.cards}>
                {cardsNotEmpry ? (
                    pages.map((discipline) => <DisciplineCard key={discipline.id} discipline={discipline} />)
                ) : (
                    <p className={styles.cards__emptyText}>Ничего не найдено</p>
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
            <DisciplineCreateModal isOpen={modalIsOpen} setIsOpen={setModalIsOpen} />
        </>
    );
}
