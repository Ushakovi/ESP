'use client';

import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MaterialLink from '@mui/material/Link';
import { Alert } from '@mui/material';
import { submitLogin } from '@/utils/server/actions';
import styles from './page.module.css';

export default function Page() {
    const [alertShow, setAlertShow] = useState<{
        alertStatus: string;
        alertText: string;
    } | null>(null);
    const [formState, formAction] = useFormState(submitLogin, null);

    useEffect(() => {
        if (formState?.status === 200) {
            redirect('/');
        }

        if (formState?.status === 400) {
            setAlertShow({
                alertStatus: 'error',
                alertText: formState.statusText,
            });
        }
    }, [formState]);

    return (
        <>
            {alertShow && (
                <Alert
                    sx={{
                        marginTop: '20px',
                    }}
                    severity={
                        alertShow.alertStatus === 'success'
                            ? 'success'
                            : 'error'
                    }
                    onClose={() => setAlertShow(null)}
                >
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
                        Войти
                    </Button>
                </form>
                <Link href='/registration'>
                    <MaterialLink component='button' fontSize='14px'>
                        Зарегистрироваться
                    </MaterialLink>
                </Link>
            </div>
        </>
    );
}
