import { FC, useContext, useEffect } from "react";
import { Card, Row, Button, Form, Input, Table } from "antd";
import type { FormProps } from "antd";
import axios from "axios";

import { UserContext, AccountsContext, AccountsContextType, MessageContext } from '../context';
import type { Account } from "../types";

import FieldControls from '../components/FieldControls';
import EditableTableInput from "../components/EditableTableInput";

type AccountRow = Account & {
    editing: boolean;
    newName: string;
    newAccountNumber: string;
}
const AccountRowDefaults = {
    editing: false,
    newName: "",
    newAccountNumber: ""
}
type FieldType = {
    account_number: string;
    name: string;
};

function findAccountIndexFromID(accounts:AccountRow[], bank_account_id:number){
    const index = accounts.findIndex((e) => { //spread found element into object
        return e.bank_account_id === bank_account_id;
    })
    return accounts[index];
}

const Accounts:FC = () => {
    const { userID } = useContext(UserContext);
    const { accounts, setAccounts, getAccounts} = useContext<AccountsContextType>(AccountsContext) as {accounts: AccountRow[], setAccounts:Function, getAccounts:Function};
    const { showMessage } = useContext(MessageContext);

    useEffect(() => {
        accounts.forEach((e) => {
            e.newName = AccountRowDefaults.newName;
            e.newAccountNumber = AccountRowDefaults.newAccountNumber;
            e.editing = AccountRowDefaults.editing;
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit:FormProps<FieldType>['onFinish'] = async (values) => {
        await axios.post(`${process.env.REACT_APP_API_ROOT}bank-accounts/bank-account`, {
            user_id: userID,
            ...values
        })
        .then((response) => {
            console.log(response.data);
            showMessage("success", "Account Created!");
            getAccounts(userID);
        })
        .catch((error:Error) => {
            showMessage("error", "Account creation failed!");
            console.log(error.message);
        });
    }


    async function handleAccountEdit(bank_account_id:number, oldName:string, newName:string, oldAccountNumber:string, newAccountNumber:string){
        if (oldName !== newName || oldAccountNumber !== newAccountNumber){
            await axios.patch(`${process.env.REACT_APP_API_ROOT}bank-accounts/update-bank-account`, {
                user_id: userID,
                bank_account_id: bank_account_id,
                name: newName,
                account_number: newAccountNumber
            })
            .then(() => {
                showMessage("success", "Account Updated!");
                getAccounts();
            })
            .catch((error:Error) => {
                showMessage("error", "Account edit failed!");
                console.log(error.message);
            });
        }
        else{
            findAccountIndexFromID(accounts, bank_account_id).editing = false;
            setAccounts([...accounts]);
        }
    }

    async function handleAccountDelete(bank_account_id:number){
        await axios.delete(`${process.env.REACT_APP_API_ROOT}bank-accounts/delete-bank-account`, {
            params: {
                user_id: userID,
                bank_account_id: bank_account_id
            }
        })
        .then(() => {
            showMessage("success", "Account Deleted!");
            getAccounts();
        })
        .catch((error:Error) => {
            showMessage("error", "Account deletion failed!");
            console.log(error.message);
        });
    }

    const columns = [
       {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            align: 'left' as const,
            render: (text:string, {bank_account_id, name}:Account, index:number) => {
                const thisRow = findAccountIndexFromID(accounts, bank_account_id);
                return (
                    <EditableTableInput
                        currentValue={name}
                        row={thisRow}
                        onChange={( element:{ target:{value:string} } ) => {
                            thisRow.newName = element.target.value;
                            setAccounts([...accounts]);
                        }}
                    />
                )
            }
        },
        {
            title: 'Account Number',
            dataIndex: 'account_number',
            key: 'account_number',
            align: 'left' as const,
            render: (text:string, {bank_account_id, account_number}:Account, index:number) => {
                const thisRow = findAccountIndexFromID(accounts, bank_account_id);
                return (
                    <EditableTableInput
                        currentValue={account_number}
                        row={thisRow}
                        onChange={( element:{ target:{value:string} } ) => {
                            thisRow.newAccountNumber = element.target.value;
                            setAccounts([...accounts]);
                        }}
                    />
                )
            }
        },
        {
            title: 'Actions',
            key: "actions",
            align: 'right' as const,
            render: (text:string, {bank_account_id}:Account, index:number) => {
                const thisRow = findAccountIndexFromID(accounts, bank_account_id);
                const editing = thisRow?.editing || false; //ensures it defaults to false if editing cannot be found
                return (
                    <FieldControls
                        editing = {editing}
                        setEditing = {() => {
                            thisRow.editing = !editing;
                            if (thisRow.editing){//set to default on edit start
                                thisRow.newName = thisRow.name;
                                thisRow.newAccountNumber = thisRow.account_number;
                            }
                            setAccounts([...accounts]);
                        }}
                        handleEdit = {() => {handleAccountEdit(thisRow.bank_account_id, thisRow.name, thisRow.newName, thisRow.account_number, thisRow.newAccountNumber);}}
                        handleDelete = {() => {handleAccountDelete(thisRow.bank_account_id);}}
                    />
                )
            }
        }
    ];

    return <>
        <Row gutter={200} justify={"center"}>
            <Card key={0} title="New Account" style={{width:800}}>
                <Form
                    name="account"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={handleSubmit}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                
                    <Form.Item<FieldType>
                        label="Account Number"
                        name="account_number"
                        rules={[{ required: true, message: 'Please input the account number!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Account Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input the account name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 2, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                    
                </Form>
            </Card>
        </Row>
        <Row gutter={16} justify={"center"}>
            <Table
                style={{width:800}}
                dataSource={accounts}
                columns={columns}
                pagination={false}
            />
        </Row>
    </>
}

export default Accounts;