import { FC } from "react";
import { Card, Col, Row, Button, Form, Input } from "antd";

interface account {
    bank_account_id:number,
    name:string,
    account_number:string
}

interface props {
    accounts:account[]
}

const Accounts:FC<props> = (props) => {
    const {accounts} = props;
    
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
                            // onFinish={onFinish}
                            // onFinishFailed={onFinishFailed}
                            autoComplete="off"
                        >
                        
                            <Form.Item
                                label="Account Number"
                                name="accountNumber"
                                rules={[{ required: true, message: 'Please input the account number!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Account Name"
                                name="accountName"
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