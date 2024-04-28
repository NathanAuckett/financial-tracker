import { FC } from "react";
import { Select } from "antd";

type account = {
  bank_account_id: number
  name:string,
  account_number:string
}

interface props{
  accounts:object[];
  selectedAccount: number;
  setSelectedAccount:Function;
}
const AccountDropDown:FC<props> = (props) => {
  const accounts = props.accounts as account[];
  const { selectedAccount, setSelectedAccount } = props;

  const options:{value:number, label: string}[] = [];

  accounts.forEach(({bank_account_id, name, account_number}) => {
    const concat = `${name}: ${account_number}`;

    const option = {
      value: bank_account_id,
      label: concat
    }
    options.push(option);
  });

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
