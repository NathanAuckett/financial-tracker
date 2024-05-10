import { FC, useContext, useEffect, useState } from "react";
import { Card, Row, Button, Form, Input, Table } from "antd";
import type { FormProps } from "antd";
import axios from "axios";

import { UserContext, AccountsContext, AccountsContextType } from '../context';
import type { Account } from "../types";

import FieldControls from '../components/FieldControls';

type AccountRow = Account & {
    editing: boolean;
    newName: string;
}
const AccountRowDefaults = {
    editing: false,
    newName: ""
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
    
    useEffect(() => {
        accounts.forEach((e) => {
            e.newName = AccountRowDefaults.newName;
            e.editing = AccountRowDefaults.editing;
        });
        console.log("Effect:", accounts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit:FormProps<FieldType>['onFinish'] = async (values) => {
        await axios.post(`${process.env.REACT_APP_API_ROOT}bank_accounts/bank_account`, {
            user_id: userID,
            ...values
        })
        .then((response) => {
            console.log(response.data);
            getAccounts(userID);
        })
        .catch((error:Error) => {
            console.log(error.message);
        });
    }


    async function handleAccountEdit(bank_account_id:number, oldName:string, newName:string){
        if (oldName !== newName){
            // await axios.patch("http://localhost:3000/categories/update_category", {
            //     user_id: userID,
            //     category_id: category_id,
            //     name: newName
            // })
            // .then(() => {
            //     fetchCategories();
            // })
            // .catch((error:Error) => {
            //     console.log(error.message);
            // });
        }
        else{
            findAccountIndexFromID(accounts, bank_account_id).editing = false;
            setAccounts([...accounts]);
        }
    }

    async function handleAccountDelete(bank_account_id:number){
        // await axios.delete("http://localhost:3000/categories/delete_category", {
        //     params: {
        //         user_id: userID,
        //         category_id: category_id
        //     }
        // })
        // .then(() => {
        //     fetchCategories();
        // })
        // .catch((error:Error) => {
        //     console.log(error.message);
        // });
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
                    <>
                        {thisRow.editing ?
                            <Input 
                                name='name'
                                defaultValue={name}
                                style={{display: "inline", width:"max-content"}}
                                onChange={(element) => {
                                    thisRow.newName = element.target.value;
                                    setAccounts([...accounts]);
                                }}
                            />
                        :
                            <p style={{display:"inline", marginRight: 5}}>{name}</p>
                        }
                    </>
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
                    <>
                        {thisRow.editing ?
                            <Input 
                                name='account_number'
                                defaultValue={account_number}
                                style={{display: "inline", width:"max-content"}}
                                onChange={(element) => {
                                    thisRow.account_number = element.target.value;
                                    setAccounts([...accounts]);
                                }}
                            />
                        :
                            <p style={{display:"inline", marginRight: 5}}>{account_number}</p>
                        }
                    </>
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
                            if (thisRow.editing){
                                thisRow.newName = thisRow.name; //set to default on edit start
                            }
                            console.log(accounts);
                            setAccounts([...accounts]);
                        }}
                        handleEdit = {() => {handleAccountEdit(thisRow.bank_account_id, thisRow.name, thisRow.newName);}}
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