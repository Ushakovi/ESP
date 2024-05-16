'use server';

import { sql } from '@vercel/postgres';
import jwt, { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import saveFile from './saveFile';

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
                statusText: String(err),
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
    const authCookie = cookies().get('token')?.value;
    if (!authCookie) {
        return new Response(null, {
            status: 401,
            statusText: 'Unauthorized',
        });
    }

    const name = String(formData.get('name'));
    const description = String(formData.get('description'));
    const verification: any = verify(authCookie, process.env.JWT_SECRET as string);

    if (name) {
        try {
            await sql`INSERT INTO disciplines (name, description, creator_id) VALUES (${name}, ${description}, ${verification.id})`;

            return {
                status: 200,
                statusText: 'Дисциплина успешно создана',
            };
        } catch (err) {
            return {
                status: 400,
                statusText: String(err),
            };
        }
    } else {
        return {
            status: 400,
            statusText: 'Произошла ошибка',
        };
    }
}

export async function submitCreateLesson(prevState: any, formData: FormData) {
    const authCookie = cookies().get('token')?.value;
    if (!authCookie) {
        return new Response(null, {
            status: 401,
            statusText: 'Unauthorized',
        });
    }

    const name = String(formData.get('name'));
    const description = String(formData.get('description'));
    const materials = formData.getAll('materials');
    const lecture = formData.get('lecture');
    const disciplineId = String(formData.get('discipline_id'));

    const materialsResults = await materials.map(async (material) => await saveFile(material, 'materials'));
    const materialsPaths = await Promise.all(materialsResults);
    const lectureResult = await saveFile(lecture, 'lectures');
    const lecturePath = await lectureResult;

    const verification: any = verify(authCookie, process.env.JWT_SECRET as string);

    if (name) {
        try {
            await sql`INSERT INTO lessons (name, description, materials, lecture, discipline_id, creator_id) VALUES (${name}, ${description}, ${materialsPaths.join(';')}, ${lecturePath}, ${disciplineId}, ${verification.id})`;

            return {
                status: 200,
                statusText: 'Урок успешно создан',
            };
        } catch (err) {
            return {
                status: 400,
                statusText: String(err),
            };
        }
    } else {
        return {
            status: 400,
            statusText: 'Произошла ошибка',
        };
    }
}

export async function submitCreateHomework(prevState: any, formData: FormData) {
    const authCookie = cookies().get('token')?.value;
    if (!authCookie) {
        return new Response(null, {
            status: 401,
            statusText: 'Unauthorized',
        });
    }

    const comment = String(formData.get('comment'));
    const materials = formData.getAll('materials');
    const lessonId = String(formData.get('lesson_id'));

    const materialsResults = await materials.map(async (material) => await saveFile(material, 'homeworks'));
    const materialsPaths = await Promise.all(materialsResults);

    const verification: any = verify(authCookie, process.env.JWT_SECRET as string);

    if (materials) {
        try {
            await sql`INSERT INTO homeworks (comment, materials, estimation_status, estimation_comment, user_id, lesson_id) VALUES (${comment}, ${materialsPaths.join(';')}, false, null, ${verification.id}, ${lessonId})`;

            return {
                status: 200,
                statusText: 'Домашнее задание успешно сохранено',
            };
        } catch (err) {
            return {
                status: 400,
                statusText: String(err),
            };
        }
    } else {
        return {
            status: 400,
            statusText: 'Произошла ошибка',
        };
    }
}

export async function submitUpdateHomework(prevState: any, formData: FormData) {
    const authCookie = cookies().get('token')?.value;
    if (!authCookie) {
        return new Response(null, {
            status: 401,
            statusText: 'Unauthorized',
        });
    }

    const comment = String(formData.get('comment'));
    const materials = formData.getAll('materials');
    const homeworkId = String(formData.get('homework_id'));

    const materialsResults = await materials.map(async (material) => await saveFile(material, 'homeworks'));
    const materialsPaths = await Promise.all(materialsResults);

    try {
        const { rows: homeworks } = await sql`SELECT * FROM homeworks where id = ${homeworkId}`;
        if (homeworks.length > 0) {
            if (comment && comment !== homeworks[0].comment) {
                await sql`UPDATE homeworks SET comment = ${comment} WHERE id = ${homeworkId}`;
            }

            if (materialsPaths.join(';') && materialsPaths.join(';') !== homeworks[0].materials) {
                await sql`UPDATE homeworks SET materials = ${materialsPaths.join(';')} WHERE id = ${homeworkId}`;
            }

            return {
                status: 200,
                statusText: 'Домашнее задание успешно обновлено',
            };
        } else {
            return {
                status: 400,
                statusText: 'Homework is not exist',
            };
        }
    } catch (err) {
        return {
            status: 400,
            statusText: String(err),
        };
    }
}

export async function submitCreateCommentForHomework(prevState: any, formData: FormData) {
    const authCookie = cookies().get('token')?.value;
    if (!authCookie) {
        return new Response(null, {
            status: 401,
            statusText: 'Unauthorized',
        });
    }

    const comment = String(formData.get('comment'));
    const homeworkId = String(formData.get('homework_id'));

    const verification: any = verify(authCookie, process.env.JWT_SECRET as string);

    if (comment && homeworkId && verification.id) {
        try {
            await sql`INSERT INTO comments_for_homeworks (comment, homework_id, user_id) VALUES (${comment}, ${homeworkId}, ${verification.id})`;

            return {
                status: 200,
                statusText: 'Комментарий сохранен',
            };
        } catch (err) {
            return {
                status: 400,
                statusText: String(err),
            };
        }
    } else {
        return {
            status: 400,
            statusText: 'Произошла ошибка',
        };
    }
}

export async function submitCreateEstimationCommentForHomework(prevState: any, formData: FormData) {
    const authCookie = cookies().get('token')?.value;
    if (!authCookie) {
        return new Response(null, {
            status: 401,
            statusText: 'Unauthorized',
        });
    }

    const estimationComment = String(formData.get('estimationComment'));
    const homeworkId = String(formData.get('homework_id'));

    if (estimationComment && homeworkId) {
        try {
            await sql`UPDATE homeworks SET estimation_status = true, estimation_comment = ${estimationComment} WHERE id = ${homeworkId}`;
            return {
                status: 200,
                statusText: 'Комментарий сохранен',
            };
        } catch (err) {
            return {
                status: 400,
                statusText: String(err),
            };
        }
    } else {
        return {
            status: 400,
            statusText: 'Произошла ошибка',
        };
    }
}
