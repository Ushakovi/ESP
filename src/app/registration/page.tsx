'use client';

import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MaterialLink from '@mui/material/Link';
import { Alert, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { submitRegistration } from '@/utils/server/actions';
import styles from './page.module.css';

export default function Page() {
    const [roles, setRoles] = useState([]);
    const [selectRole, setSelectRole] = useState('');
    const [alertShow, setAlertShow] = useState<{
        alertStatus: string;
        alertText: string;
    } | null>(null);
    const [formState, formAction] = useFormState(submitRegistration, null);

    useEffect(() => {
        fetch('/api/roles')
            .then((res) => res.json())
            .then(({ data }) => setRoles(data))
            .catch((err) => console.error(err));
    }, []);

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

    const handleChange = (event: SelectChangeEvent) => {
        setSelectRole(event.target.value);
    };

    return (
        <>
            {alertShow && (
                <Alert
                    sx={{
                        marginTop: '20px',
                    }}
                    severity={alertShow.alertStatus === 'success' ? 'success' : 'error'}
                    onClose={() => setAlertShow(null)}>
                    {alertShow.alertText}
                </Alert>
            )}
            <div className={styles.formWrapper}>
                <form action={formAction} className={styles.form}>
                    <h2>Регистрация</h2>
                    <TextField
                        name='email'
                        label='Электронная почта'
                        placeholder='Электронная почта'
                        variant='outlined'
                        type='email'
                        required
                    />
                    <TextField name='fullname' label='ФИО' placeholder='ФИО' variant='outlined' type='text' required />
                    <TextField name='phone' label='Телефон' placeholder='Телефон' variant='outlined' type='tel' />
                    <TextField
                        name='password'
                        label='Пароль'
                        placeholder='Пароль'
                        variant='outlined'
                        type='password'
                        required
                    />
                    <FormControl fullWidth>
                        <InputLabel id='role-select'>Роль</InputLabel>
                        <Select
                            labelId='role-select'
                            name='role'
                            value={selectRole}
                            label='Роль'
                            required
                            onChange={handleChange}>
                            {roles.map(({ id, role }) => (
                                <MenuItem key={id} value={role}>
                                    {role}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button type='submit' variant='contained'>
                        Зарегистрироваться
                    </Button>
                </form>
                <Link href='/login'>
                    <MaterialLink component='button' fontSize='14px'>
                        У меня уже есть учетная запись
                    </MaterialLink>
                </Link>
            </div>
        </>
    );
}
