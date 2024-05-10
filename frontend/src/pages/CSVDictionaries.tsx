import { FC, useContext, useEffect, useState } from "react";
import { Row, Card, Form, Input, Button, Table } from "antd";
import type { FormProps } from "antd";
import axios from "axios";

import { UserContext } from '../context';

const columns = [
    {
        title: 'Bank',
        dataIndex: 'bank_name',
        key: 'bank_name',
        align: 'center' as const
    },
    {
        title: 'account_number',
        dataIndex: 'account_number',
        key: 'account_number',
        align: 'center' as const
    },
    {
        title: 'transaction_date',
        dataIndex: 'transaction_date',
        key: 'transaction_date',
        align: 'center' as const
    },
    {
        title: 'credit',
        dataIndex: 'credit',
        key: 'credit',
        align: 'center' as const
    },
    {
        title: 'debit',
        dataIndex: 'debit',
        key: 'debit',
        align: 'center' as const
    },
    {
        title: 'description',
        dataIndex: 'description',
        key: 'description',
        align: 'center' as const
    },
    {
        title: 'type',
        dataIndex: 'type',
        key: 'type',
        align: 'center' as const
    },
    {
        title: 'balance',
        dataIndex: 'balance',
        key: 'balance',
        align: 'center' as const
    }
];

interface props {}
export const CSVDictionaries:FC<props> = (props) => {
    const { userID } = useContext(UserContext);
    const [ dictionaries, setDictionaries ] = useState<object[]>([]);

    async function getDictionaries() {
        await axios.get(`${process.env.REACT_APP_API_ROOT}csv_dictionaries/get-dictionaries`, {
            params:{
                user_id: userID,
                columns: undefined
            }
        })
        .then((response) => {
            const dictionaries = response.data.dictionaries;
    
            console.log(dictionaries);
            setDictionaries(dictionaries);
        })
        .catch((error:Error) => {
            console.log(error.message);
        });
    }

    useEffect(() => {
        getDictionaries();
    }, []);

    const handleSubmit:FormProps['onFinish'] = async (values) => {
        console.log({
            user_id: userID,
            ...values
        });
        
        await axios.post('http://localhost:3000/csv_dictionaries/dictionary', {
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
    
    return (
        <>
        <Row gutter={200} justify={"center"}>
            <Card key={0} title="New Bank CSV Dictionary" style={{width:800}}>
                <Form
                    style={{ maxWidth: 600}}
                    onFinish={handleSubmit}
                    labelCol={{span: 10}}
                    spellCheck={true}
                >
                    <Form.Item
                        label="Bank Name"
                        name="bank_name"
                        rules={[{ required: true, message: 'Please input a bank name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Account Number"
                        name="account_number"
                        rules={[{ required: true, message: 'Please input the account number CSV title!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Transaction Date"
                        name="transaction_date"
                        rules={[{ required: true, message: 'Please input the transaction date CSV title!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Credit"
                        name="credit"
                        rules={[{ required: true, message: 'Please input the credit CSV title!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Debit"
                        name="debit"
                        rules={[{ required: true, message: 'Please input the debit CSV title!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[{ required: true, message: 'Please input the description CSV title!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[{ required: true, message: 'Please input the type CSV title!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Balance"
                        name="balance"
                        rules={[{ required: true, message: 'Please input the balance CSV title!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </Row>
        <Row gutter={16} justify={"center"}>
            <Table
                columns={columns}
                dataSource={dictionaries}
                pagination={false}
                style={{minWidth: 600}}
            />
        </Row>
        </>
    );
}

export default CSVDictionaries;