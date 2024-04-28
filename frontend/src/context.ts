import { createContext } from "react";

import type { Category, Account } from "./types"

type UserContextType = {
    userID?: number,
    setUserID?: Function
}
export const UserContext = createContext<UserContextType>({});


type CategoriesContextType = {
    categories?: Category[],
    setCategories?: Function
}
export const CategoriesContext = createContext<CategoriesContextType>({});

type AccountsContextType = {
    accounts?: Account[],
    setAccounts?: Function
}
export const AccountsContext = createContext<AccountsContextType>({});