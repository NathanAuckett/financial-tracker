import { FC, useContext } from "react";
import { Card, Col, Row, Button, Form, Input } from "antd";
import type { FormProps } from "antd";
import axios from "axios";

import { UserContext } from "../App";

interface account {
    bank_account_id:number,
    name:string,
    account_number:string
}

interface props {
    accounts:account[]
}

type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
};



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
        <Row gutter={16} justify={"center"}>
                <Col span={8}>
                    <Card key={0} title="New Account">
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
                </Col>
            
            {accounts.map((element, index) => {
                return (
                    <Col span={8}>
                        <Card key={index + 1} title={element.name}>
                            {element.account_number}
                        </Card>
                    </Col>
                )
            })}
        </Row>
        
    </>
}


export default Accounts;