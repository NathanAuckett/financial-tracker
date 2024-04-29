import { FC } from "react";
import { Select } from "antd";
import { Account } from "../types";



interface props{
  accounts:Account[] | undefined;
  selectedAccount: number | null;
  setSelectedAccount:Function;
}
const AccountDropDown:FC<props> = (props) => {
  const accounts = props.accounts;
  const { selectedAccount, setSelectedAccount } = props;

  const options:{value:number, label: string}[] = [];

  if (accounts){
    accounts.forEach(({bank_account_id, name, account_number}) => {
      const concat = `${name}: ${account_number}`;

      const option = {
        value: bank_account_id,
        label: concat
      }
      options.push(option);
    });
  }

  console.log("Account select options:", options);

  return (
    <Select
      value = {options[0] ? selectedAccount : "No Accounts"} //Pass in as defaultValue only works on initial render. Current selection gets passed back in from parent to keep this working right.
      options = {options}
      onChange = {(value) => {
        console.log("Selected account change", value);
        setSelectedAccount(value);
      }}
    />
  )
};

export default AccountDropDown;
