'use client';

import { useContext } from 'react';
import { UserInfoContext } from '@/utils/client/userInfoProvider';
import HomeworkList from '@/components/homeworks/homeworkTeacherView';
import HomeworkForm from '@/components/homeworks/homeworkStudentView';
import styles from './component.module.css';
import { Lesson } from '@/types';

export default function Component({ lesson }: { lesson: Lesson }) {
    const userInfo: any = useContext(UserInfoContext);

    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>Домашняя работа</h2>
            {userInfo.role.toLowerCase() === 'преподователь' && userInfo.id === lesson.creator_id ? (
                <HomeworkList lesson={lesson} />
            ) : (
                <HomeworkForm lesson={lesson} />
            )}
        </div>
    );
}
