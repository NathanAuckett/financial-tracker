import { FC, useContext, useState } from "react";
import { Card, Row, Button, Form, Input, Table } from "antd";
import type { FormProps } from "antd";
import axios from "axios";

import { UserContext, AccountsContext, AccountsContextType } from '../context';
import type { Account } from "../types";

import FieldControls from '../components/FieldControls';

const Accounts:FC = (props) => {
    const { userID } = useContext(UserContext);
    const { accounts, setAccounts, getAccounts} = useContext<AccountsContextType>(AccountsContext);
    
    type FieldType = {
        account_number: string;
        name: string;
    };

    const handleSubmit:FormProps<FieldType>['onFinish'] = async (values) => {
        await axios.post('http://localhost:3000/bank_accounts/bank_account', {
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

    const NameField:FC<{category_id:number, name:string}> = (props) => {
        const { category_id, name } = props;
        const [editing, setEditing] = useState(false);
        const [newName, setNewName] = useState(name);
    
        async function handleEdit(){
            setEditing(!editing);
            await axios.patch("http://localhost:3000/categories/update_category", {
                user_id: userID,
                category_id: category_id,
                name: newName
            })
            .then(() => {
                getAccounts();
            })
            .catch((error:Error) => {
                console.log(error.message);
            });
        }
    
        async function handleDelete(){
            await axios.delete("http://localhost:3000/categories/delete_category", {
                params: {
                    user_id: userID,
                    category_id: category_id
                }
            })
            .then(() => {
                getAccounts();
            })
            .catch((error:Error) => {
                console.log(error.message);
            });
        }
    
        return (
            <>
                {editing ?
                    <Input 
                        name='name'
                        defaultValue={name}
                        style={{display: "inline", width:"max-content"}}
                        onChange={(element) => {
                            setNewName(element.target.value);
                        }}
                    />
                :
                    <p style={{display:"inline", marginRight: 5}}>{name}</p>
                }
                <FieldControls
                    editing={editing}
                    setEditing={setEditing}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                />
            </>
        )
    }

    const columns = [
        {
            title: 'Account Number',
            dataIndex: 'account_number',
            key: 'account_number',
            align: 'center' as const
        },
        {
            title: 'Account Name',
            dataIndex: 'name',
            key: 'name',
            align: 'center' as const
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