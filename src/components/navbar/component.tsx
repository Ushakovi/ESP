'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Avatar, Box, Menu, MenuItem, Link as MaterialLink, Typography } from '@mui/material';
import { UserInfoContext } from '@/utils/client/userInfoProvider';
import styles from './component.module.css';

export default function Component() {
    const userInfo: any = useContext(UserInfoContext);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const isOpen = Boolean(anchorEl);
    const router = useRouter();
    const pathname = usePathname();

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
                {pathname === '/' ? (
                    <Typography fontWeight='700'>Дисциплины</Typography>
                ) : (
                    <Link href='/'>
                        <MaterialLink component='button' underline='hover' className={styles.navbar__link}>
                            Дисциплины
                        </MaterialLink>
                    </Link>
                )}
                {pathname === '/homeworks' ? (
                    <Typography fontWeight='700'>Домашняя работа</Typography>
                ) : (
                    <Link href='/homeworks'>
                        <MaterialLink component='button' underline='hover' className={styles.navbar__link}>
                            Домашняя работа
                        </MaterialLink>
                    </Link>
                )}
            </nav>
            <Box className={styles.navbar__avatarWrapper} onClick={handleOpen}>
                <Avatar className={styles.navbar__avatar}>{userInfo.fullname[0]}</Avatar>
            </Box>
            <Menu id='basic-menu' anchorEl={anchorEl} open={isOpen} onClose={handleClose}>
                <MenuItem onClick={handleClickSettingsButton}>Настройки</MenuItem>
                <MenuItem onClick={handleLogout}>Выйти</MenuItem>
            </Menu>
        </div>
    );
}
