import { FC, useContext } from "react";
import { Card, Col, Row, Button, Form, Input, Table } from "antd";
import type { FormProps } from "antd";
import axios from "axios";

import { UserContext } from "../App";

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

type Account = {
    bank_account_id:number,
    name:string,
    account_number:string
}

type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};

interface props {
    accounts:Account[]
}
const Accounts:FC<props> = (props) => {
    const { userID } = useContext(UserContext);
    const { accounts } = props;
    
    const handleSubmit:FormProps<FieldType>['onFinish'] = async (values) => {
        console.log({
            user_id: userID,
            ...values
        });
        
        await axios.post('http://localhost:3000/bank_accounts/bank_account', {
            user_id: userID,
            ...values
        })
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    return <>
        <Row gutter={200} justify={"center"}>
            <Card key={0} title="New Account" style={{width:800}}>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={handleSubmit}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                
                    <Form.Item
                        label="Account Number"
                        name="account_number"
                        rules={[{ required: true, message: 'Please input the account number!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
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