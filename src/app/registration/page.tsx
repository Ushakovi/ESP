'use client';

import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
    Alert,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Button,
    Link as MaterialLink,
} from '@mui/material';
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
        const fetchRole = async () => {
            try {
                const res = await fetch('/api/roles');
                const { data } = await res.json();
                setRoles(data);
            } catch (err: any) {
                console.error(err);
            }
        };
        fetchRole();
    }, []);

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

    const handleChange = (event: SelectChangeEvent) => {
        setSelectRole(event.target.value);
    };

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
        </main>
    );
}
