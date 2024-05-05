'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, Box, Menu, MenuItem, Link as MaterialLink } from '@mui/material';
import { UserInfoContext } from '@/utils/client/userInfoProvider';
import styles from './component.module.css';

export default function Navbar() {
    const userInfo: any = useContext(UserInfoContext);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isOpen = Boolean(anchorEl);
    const router = useRouter();

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        const res = await fetch('/api/auth/logout');
        if (res.status === 200) router.push('/');
    };

    const handleClickSettingsButton = () => {
        router.push('/settings');
    };

    return (
        <div className={styles.navbar}>
            <nav className={styles.navbar__menu}>
                <Link href='/'>
                    <MaterialLink component='button' fontWeight='700' sx={{ color: 'var(--main-dark-color)' }}>
                        Дисциплины
                    </MaterialLink>
                </Link>
                <Link href='/homeworks'>
                    <MaterialLink component='button' fontWeight='700' sx={{ color: 'var(--main-dark-color)' }}>
                        Домашняя работа
                    </MaterialLink>
                </Link>
            </nav>
            <Box
                display='flex'
                alignItems='center'
                gap='8px'
                marginLeft='auto'
                sx={{ cursor: 'pointer' }}
                onClick={handleOpen}>
                <Avatar sx={{ bgcolor: 'var(--main-dark-color)' }}>{userInfo.fullname[0]}</Avatar>
            </Box>
            <Menu id='basic-menu' anchorEl={anchorEl} open={isOpen} onClose={handleClose}>
                <MenuItem onClick={handleClickSettingsButton}>Настройки</MenuItem>
                <MenuItem onClick={handleLogout}>Выйти</MenuItem>
            </Menu>
        </div>
    );
}
