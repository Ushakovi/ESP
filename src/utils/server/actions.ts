'use server';

import { cookies } from 'next/headers';
import { sql } from '@vercel/postgres';
import jwt, { verify } from 'jsonwebtoken';
import { revalidatePath } from 'next/cache';

export async function submitLogin(prevState: any, formData: FormData) {
    const email = String(formData.get('email'));
    const password = String(formData.get('password'));

    if (email && password) {
        const { rows: users } =
            await sql`SELECT us.id, us.email, us.fullname, us.phone, rs.id as role_id, rs.role, (password = crypt(${password}, password)) AS password_match
            FROM users us
            join roles rs
            on role_id = rs.id
            where email = ${email}`;

        if (users.length > 0 && users[0].password_match) {
            const { id, email, fullname, phone, role_id, role } = users[0];

            const token = jwt.sign(
                {
                    id,
                    email,
                    fullname,
                    phone,
                    role_id,
                    role,
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

    const { rows: existedUsers } = await sql`SELECT * FROM users where email = ${email}`;

    if (existedUsers.length > 0) {
        return {
            status: 400,
            statusText: 'Такой email уже зарегистрирован',
        };
    }

    if (email && fullname && password && role) {
        try {
            const { rows: roles } = await sql`SELECT * FROM roles where role = ${role}`;
            if (roles.length > 0) {
                await sql`INSERT INTO users (email, fullname, phone, password, role_id) VALUES (${email}, ${fullname}, ${phone}, crypt(${password}, gen_salt('md5')), ${roles[0].id})`;
            }

            const { rows: newUsers } =
                await sql`SELECT us.id, us.email, us.fullname, us.phone, rs.id as role_id, rs.role, (password = crypt(${password}, password)) AS password_match
            FROM users us
            join roles rs
            on role_id = rs.id
            where email = ${email}`;

            if (newUsers.length > 0) {
                const { id, email, fullname, phone, role_id, role } = newUsers[0];

                const token = jwt.sign(
                    {
                        id,
                        email,
                        fullname,
                        phone,
                        role_id,
                        role,
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
            } else {
                return {
                    status: 400,
                    statusText: 'Произошла ошибка',
                };
            }
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

export async function submitCreateDiscipline(prevState: any, formData: FormData) {
    const name = String(formData.get('name'));
    const description = String(formData.get('description'));
    const authCookie = cookies().get('token')?.value;
    if (!authCookie) {
        return new Response(null, {
            status: 401,
            statusText: 'Unauthorized',
        });
    }
    const verification = verify(authCookie, process.env.JWT_SECRET as string);

    if (name && description) {
        try {
            await sql`INSERT INTO disciplines (name, description, creator_id) VALUES (${name}, ${description}, ${verification.id})`;
            revalidatePath('/');

            return {
                status: 200,
                statusText: 'Дисциплина успешно создана',
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
