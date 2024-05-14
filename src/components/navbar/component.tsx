'use client';

import { useContext, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Avatar, Menu, MenuItem, Link as MaterialLink, Typography } from '@mui/material';
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

    return (
        <div className={styles.navbar}>
            <nav className={styles.navbar__menu}>
                {pathname === '/' || pathname.includes('discipline') ? (
                    <Typography fontWeight='700'>Дисциплины</Typography>
                ) : (
                    <Link href='/'>
                        <MaterialLink component='button' underline='hover' sx={{ color: '#000000' }}>
                            Дисциплины
                        </MaterialLink>
                    </Link>
                )}
            </nav>
            <div className={styles.navbar__avatarWrapper} onClick={handleOpen}>
                <Avatar sx={{ backgroundColor: 'var(--main-dark-color)' }}>{userInfo.fullname[0]}</Avatar>
            </div>
            <Menu id='basic-menu' anchorEl={anchorEl} open={isOpen} onClose={handleClose}>
                <MenuItem onClick={handleLogout}>Выйти</MenuItem>
            </Menu>
        </div>
    );
}
