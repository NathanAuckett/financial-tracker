import { FC, useState } from "react";
import type { MenuProps } from "antd";
import { Select } from "antd";

const items: MenuProps["items"] = [
  {
    key: "1",
    label: "Item 1",
  },
  {
    key: "2",
    label: "Item 2",
  },
  {
    key: "3",
    label: "Item 3",
  },
];

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
  const [account, setAccount] = useState(1);

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
              setSelectedAccount(value);
              getTransactions(setTransactions, 1, value)
            }}
        />
    )
};

export default AccountDropDown;
