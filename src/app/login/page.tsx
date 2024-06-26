'use client';

import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Alert, TextField, Button, Link as MaterialLink } from '@mui/material';
import { submitLogin } from '@/shared/utils/server/actions';
import styles from './page.module.css';

export default function Page() {
    const [alertShow, setAlertShow] = useState<{
        alertStatus: string;
        alertText: string;
    } | null>(null);
    const [formState, formAction] = useFormState(submitLogin, null);

    useEffect(() => {
        if (formState?.status === 200) {
            setTimeout(() => setAlertShow(null), 2000);
            redirect('/');
        }

        if (formState?.status === 400) {
            console.error(formState.statusText);
            setTimeout(() => setAlertShow(null), 2000);
            setAlertShow({
                alertStatus: 'error',
                alertText: formState.statusText,
            });
        }
    }, [formState]);

    return (
        <main>
            {alertShow && (
                <Alert
                    sx={{
                        width: '95%',
                        position: ' absolute',
                        top: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                    }}
                    severity={alertShow.alertStatus === 'success' ? 'success' : 'error'}
                    onClose={() => setAlertShow(null)}>
                    {alertShow.alertText}
                </Alert>
            )}
            <div className={styles.formWrapper}>
                <form action={formAction} className={styles.form}>
                    <h2>Авторизация</h2>
                    <TextField
                        name='email'
                        label='Электронная почта'
                        placeholder='Электронная почта'
                        variant='outlined'
                        type='email'
                        required
                    />
                    <TextField
                        name='password'
                        label='Пароль'
                        placeholder='Пароль'
                        variant='outlined'
                        type='password'
                        required
                    />
                    <Button type='submit' variant='contained'>
                        <span>Войти</span>
                    </Button>
                </form>
                <Link href='/registration'>
                    <MaterialLink component='button' fontSize='14px'>
                        Зарегистрироваться
                    </MaterialLink>
                </Link>
            </div>
        </main>
    );
}
