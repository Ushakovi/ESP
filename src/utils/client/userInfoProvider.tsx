'use client';

import React, { createContext } from 'react';

export const UserInfoContext = createContext(null);

export function UserInfoProvider({
    userInfo,
    children,
}: Readonly<{
    userInfo: any;
    children: React.ReactNode;
}>) {
    return <UserInfoContext.Provider value={userInfo}>{children}</UserInfoContext.Provider>;
}
