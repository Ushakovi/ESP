'use client';

import { useContext } from 'react';
import { UserInfoContext } from '@/shared/utils/client/userInfoProvider';
import HomeworkList from '@/shared/ui/homeworks/homeworkTeacherView';
import HomeworkForm from '@/shared/ui/homeworks/homeworkStudentView';
import styles from './component.module.css';
import { Lesson } from '@/shared/types';

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
