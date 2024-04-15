import { FC, useState, useContext } from "react";
import type { MenuProps } from "antd";
import { Select } from "antd";

import { UserContext } from "../App";

interface props{
  accounts:object[],
  getTransactions:Function,
  setTransactions:Function,
  setSelectedAccount:Function
}

type account = {
  bank_account_id: number
  name:string,
  account_number:string
}

const AccountDropDown:FC<props> = (props) => {
  const accounts = props.accounts as account[];
  const {getTransactions, setTransactions, setSelectedAccount} = props;
  const { userID } = useContext(UserContext);

  const options:object[] = [];

  accounts.forEach(({bank_account_id, name, account_number}) => {
    const concat = `${name}: ${account_number}`;

    const option = {
      value: bank_account_id,
      label: concat
    }
    options.push(option);
  });

  return (
        <Select
            defaultValue = {options[0]}
            options = {options}
            onChange = {(value) => {
              console.log(value);
              setSelectedAccount(value);
              getTransactions(setTransactions, userID, value)
            }}
        />
    )
};

export default AccountDropDown;
