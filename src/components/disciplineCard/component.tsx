import { Card, CardContent } from '@mui/material';
import { Discipline } from '@/types';
import styles from './components.module.css';

export default function Component({ discipline }: { discipline: Discipline }) {
    const handleClick = (discipline: Discipline) => () => {
        console.log(discipline);
    };

    return (
        <Card className={styles.card} onClick={handleClick(discipline)}>
            <CardContent>
                <div className={styles.card__box}>
                    <p className={styles.card__name}>{discipline.name}</p>
                    <p>Создатель: {discipline.creator_name.split(' ').splice(0, 2).join(' ')}</p>
                </div>
                <p className={styles.card__description}>{discipline.description}</p>
            </CardContent>
        </Card>
    );
}
