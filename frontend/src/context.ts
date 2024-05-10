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

export type AccountsContextType = {
    accounts: Account[],
    setAccounts: Function
    getAccounts: Function
}
export const AccountsContext = createContext<AccountsContextType>({
    accounts:[],
    setAccounts: () => {console.log("getAccounts function not set")},
    getAccounts: () => {console.log("setAccounts function not set")}
});

export const MessageContext = createContext<{showMessage: Function}>({
    showMessage: () => {console.log("showMessage function not set")}
});