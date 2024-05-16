'use client';

import { Dispatch, SetStateAction, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useFormState } from 'react-dom';
import { format, add } from 'date-fns';
import { Button, CircularProgress, Drawer, Link as MaterialLink } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { downloadFileHandler } from '@/utils/client/downloadFileHandler';
import { UserInfoContext } from '@/utils/client/userInfoProvider';
import { submitCreateCommentForHomework, submitCreateEstimationCommentForHomework } from '@/utils/server/actions';
import { Homework, Comment } from '@/types';
import styles from './components.module.css';
import { redirect } from 'next/navigation';

export default function Component({
    isOpen,
    setOpen,
    homework,
}: {
    isOpen: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    homework: Homework;
}) {
    const userInfo: any = useContext(UserInfoContext);
    const [comments, setComments] = useState<Comment[]>([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [commentButtonIsDisabled, setCommentButtonIsDisabled] = useState(true);
    const [estimationCommentButtonIsDisabled, setEstimationCommentButtonIsDisabled] = useState(true);
    const [createCommentformState, createCommentformAction] = useFormState(submitCreateCommentForHomework, null);
    const [createEstimationCommentformState, createEstimationCommentformAction] = useFormState(
        submitCreateEstimationCommentForHomework,
        null
    );
    const commentRef = useRef<HTMLTextAreaElement>(null);
    const estimationCommentRef = useRef<HTMLTextAreaElement>(null);

    const fetchComments = useCallback(async () => {
        const res = await fetch(`/api/comments?homework_id=${homework.id}`);
        const comments = await res.json();
        setComments(comments.data);
        setCommentsLoading(false);
    }, [homework.id, setCommentsLoading]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    useEffect(() => {
        if (createCommentformState?.status === 200) {
            fetchComments();
            if (commentRef.current) commentRef.current.value = '';
        }
        if (createCommentformState?.status === 400) {
            console.error(createCommentformState.statusText);
        }
    }, [fetchComments, createCommentformState]);

    useEffect(() => {
        if (createEstimationCommentformState?.status === 200) {
            redirect(`/lesson/${homework.lesson_id}`);
        }
        if (createEstimationCommentformState?.status === 400) {
            console.error(createEstimationCommentformState.statusText);
        }
    }, [createEstimationCommentformState, homework.lesson_id]);

    const toggleDrawer = () => {
        setOpen(!isOpen);
    };

    return (
        <>
            <Drawer anchor='right' open={isOpen} onClose={toggleDrawer}>
                <div className={styles.drawer__body}>
                    <div className={styles.drawer__creatorWrapper}>
                        <h2>{homework.user_name.split(' ').splice(0, 2).join(' ')}</h2>
                        {homework.user_email && (
                            <MaterialLink href={`mailto:${homework.user_email}`}>
                                <EmailIcon fontSize='small' sx={{ marginTop: '5px' }} />
                            </MaterialLink>
                        )}
                        {homework.estimation_status ? (
                            <p className={styles.drawer__estimationStatusSuccess}>Оценено</p>
                        ) : (
                            <p className={styles.drawer___estimationStatusFailed}>Не оценено</p>
                        )}
                    </div>
                    <div className={styles.drawer__createdDateWrapper}>
                        <p className={styles.drawer__createdDateTitle}>Дата загрузки:</p>
                        <p>
                            {' '}
                            {format(
                                add(homework.created_at, {
                                    hours: 3,
                                }),
                                'dd/MM/yyyy в HH:mm'
                            )}
                        </p>
                    </div>
                    <div className={styles.drawer__userCommentWrapper}>
                        <p className={styles.drawer__userCommentTitle}>Описание к домашней работе:</p>
                        <p className={styles.drawer__userComment}>{homework.comment}</p>
                    </div>
                    {homework.materials && (
                        <div className={styles.drawer__materialsWrapper}>
                            <p className={styles.drawer__materialsTitle}>Материалы</p>
                            {homework.materials.split(';').map((filePath: string) => (
                                <div key={`${filePath} ${Math.random()}`} className={styles.drawer__fileWrapper}>
                                    <AttachFileIcon fontSize='small' />
                                    <Button variant='text' onClick={downloadFileHandler(filePath)}>
                                        {filePath.split('/')[filePath.split('/').length - 1]}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                    {homework.estimation_comment && (
                        <div className={styles.drawer__estimationCommentWrapper}>
                            <p className={styles.drawer__estimationCommentTitle}>Комментарий к оценке:</p>
                            <p className={styles.drawer__estimationComment}>{homework.estimation_comment}</p>
                        </div>
                    )}
                    {!homework.estimation_comment &&
                        userInfo.role === 'Преподователь' &&
                        homework.lesson_creator_id === userInfo.id && (
                            <div className={styles.drawer__estimationCommentCreateWrapper}>
                                <p className={styles.drawer__estimationCommentCreateTitle}>Комментарий к оценке:</p>
                                <form
                                    className={styles.drawer__estimationCommentCreateForm}
                                    action={createEstimationCommentformAction}>
                                    <textarea
                                        className={styles.drawer__formTextarea}
                                        name='estimationComment'
                                        placeholder='Комментарий к оценке'
                                        ref={estimationCommentRef}
                                        onChange={() =>
                                            estimationCommentRef.current?.value
                                                ? setEstimationCommentButtonIsDisabled(false)
                                                : setEstimationCommentButtonIsDisabled(true)
                                        }
                                    />
                                    <input hidden name='homework_id' type='string' defaultValue={homework.id} />
                                    <Button
                                        type='submit'
                                        variant='contained'
                                        disabled={estimationCommentButtonIsDisabled}>
                                        Оценить
                                    </Button>
                                </form>
                            </div>
                        )}
                    <div className={styles.drawer__commentsWrapper}>
                        <p className={styles.drawer__commentsWrapperTitle}>Комментарии</p>
                        <div className={styles.drawer__commentsList}>
                            {commentsLoading ? (
                                <CircularProgress />
                            ) : comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div key={comment.id} className={styles.drawer__commentWrapper}>
                                        <div className={styles.drawer__commentBox}>
                                            <p>{comment.user_name.split(' ').splice(0, 2).join(' ')}</p>
                                            <p>
                                                {format(
                                                    add(comment.created_at, {
                                                        hours: 3,
                                                    }),
                                                    'dd/MM/yyyy в HH:mm'
                                                )}
                                            </p>
                                        </div>
                                        <p>{comment.comment}</p>
                                    </div>
                                ))
                            ) : (
                                <p>Комментариев нет</p>
                            )}
                        </div>
                        <form className={styles.drawer__commentsForm} action={createCommentformAction}>
                            <textarea
                                className={styles.drawer__formTextarea}
                                name='comment'
                                placeholder='Комментарий'
                                ref={commentRef}
                                onChange={() =>
                                    commentRef.current?.value
                                        ? setCommentButtonIsDisabled(false)
                                        : setCommentButtonIsDisabled(true)
                                }
                            />
                            <input hidden name='homework_id' type='string' defaultValue={homework.id} />
                            <Button type='submit' variant='contained' disabled={commentButtonIsDisabled}>
                                Отправить комментарий
                            </Button>
                        </form>
                    </div>
                </div>
            </Drawer>
        </>
    );
}
