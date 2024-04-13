import { FC } from "react";
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

const AccountDropDown:FC = () => {
  return (
        <Select
            defaultValue="Account 0"
            options = {
                [
                    {
                        value: "Account 0",
                        label: <span>Account 0</span>
                    },
                    {
                        value: "Account 1",
                        label: <span>Account 1</span>
                    },
                    {
                        value: "Account 2",
                        label: <span>Account 2</span>
                    }
                ]
            }
        />
    )
};

export default AccountDropDown;
