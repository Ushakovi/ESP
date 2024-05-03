'use server';

import { cookies } from 'next/headers';
import { sql } from '@vercel/postgres';
import jwt from 'jsonwebtoken';

export async function submitLogin(prevState: any, formData: FormData) {
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    if (email && password) {
        const { rows: users } =
            await sql`SELECT email, (password = crypt(${password}, password)) AS password_match FROM users where email = ${email}`;

        if (users.length > 0 && users[0].password_match) {
            const token = jwt.sign(
                {
                    email,
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
                },
                process.env.JWT_SECRET as jwt.Secret
            );

            cookies().set({
                name: 'token',
                value: token,
                maxAge: 60 * 60 * 24,
                httpOnly: true,
                path: '/',
                sameSite: 'none',
                secure: true,
            });

            return {
                status: 200,
                statusText: 'Авторизация прошла успешно',
            };
        }
        return {
            status: 400,
            statusText: 'Неверный логин или пароль',
        };
    }
}

export async function submitRegistration(prevState: any, formData: FormData) {
    const email = String(formData.get('email'));
    const fullname = String(formData.get('fullname'));
    const phone = String(formData.get('phone'));
    const password = String(formData.get('password'));
    const role = String(formData.get('role'));

    const { rows: roles } = await sql`SELECT * FROM roles where role = ${role}`;
    const { rows: users } = await sql`SELECT * FROM users where email = ${email}`;

    if (users.length > 0) {
        return {
            status: 400,
            statusText: 'Такой email уже зарегистрирован',
        };
    }

    if (email && fullname && password && role) {
        try {
            if (roles.length > 0) {
                await sql`INSERT INTO users (email, fullname, phone, password, roleId) VALUES (${email}, ${fullname}, ${phone}, crypt(${password}, gen_salt('md5')), ${roles[0].id});`;
            }

            const token = jwt.sign(
                {
                    email,
                    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
                },
                process.env.JWT_SECRET as jwt.Secret
            );

            cookies().set({
                name: 'token',
                value: token,
                maxAge: 60 * 60 * 24,
                httpOnly: true,
                path: '/',
                sameSite: 'none',
                secure: true,
            });

            return {
                status: 200,
                statusText: 'Регистрация прошла успешно',
            };
        } catch (err) {
            return {
                status: 400,
                statusText: 'Произошла ошибка',
            };
        }
    } else {
        return {
            status: 400,
            statusText: 'Произошла ошибка',
        };
    }
}
