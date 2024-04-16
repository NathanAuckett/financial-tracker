import { FC, useEffect, useState, useContext } from 'react';
import { Card, Col, Row, Button, Form, Input, Table, Checkbox } from "antd";
import type { FormProps } from "antd";
import axios from "axios";

import { UserContext } from "../App";


async function getPatterns(patternSetter:Function, user_id = 1) {
    await axios.get('http://localhost:3000/patterns/get_patterns', {
        params:{
            user_id: user_id,
            columns: JSON.stringify(["pattern_id", "name", "category_id", "regex_array", "match_array"])
        }
    })
    .then((response) => {
        const patterns = response.data.patterns;

        console.log(patterns);
        patternSetter(patterns);
    })
    .catch((error) => {
        console.log(error);
    });
}


const columns = [
    {
        title: 'Pattern ID',
        dataIndex: 'pattern_id',
        key: 'pattern_id',
        align: 'center' as const
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        align: 'center' as const
    },
    {
        title: 'Category ID',
        dataIndex: 'category_id',
        key: 'category_id',
        align: 'center' as const
    },
    {
        title: 'Regex',
        dataIndex: 'regex_array',
        key: 'regex_array',
        align: 'center' as const
    },
    {
        title: 'Match',
        dataIndex: 'match_array',
        key: 'match_array',
        align: 'center' as const
    }
];

interface props {
    
}

const Patterns:FC<props> = (props) => {
    const { userID } = useContext(UserContext);
    const [patterns, setPatterns] = useState([]);

    const handleSubmit:FormProps['onFinish'] = async (values) => {
        console.log(values);
        console.log({
            user_id: userID,
            category_id: values.category_id,
            name: values.name,
            regex_array: values.regex_array.split(","),
            match_array: [values.match_array]
        });
        
        await axios.post('http://localhost:3000/patterns/pattern', {
            user_id: userID,
            category_id: values.category_id,
            name: values.name,
            regex_array: values.regex_array.split(","),
            match_array: [values.match_array]
        })
        .then((response) => {
            console.log(response.data);
            getPatterns(setPatterns, userID);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        getPatterns(setPatterns, userID);
    }, [userID]);

    return <>
        <Row gutter={200} justify={"center"}>
            <Card key={0} title="New Pattern" style={{width:800}}>
                <Form
                    name="pattern"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ match_array: true }}
                    onFinish={handleSubmit}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input the pattern name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Regex"
                        name="regex_array"
                        rules={[{ required: true, message: 'Please input the Postgres regex for matching!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Category ID"
                        name="category_id"
                        rules={[{ required: true, message: 'Please input the Postgres regex for matching!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        name="match_array"
                        valuePropName="checked"
                    >
                        <Checkbox>Match regex</Checkbox>
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
            <h2>Patterns</h2>
        </Row>
        <Row gutter={16} justify={"center"}>
            <Table
                style={{width:800, textAlign:"center"}}
                dataSource={patterns}
                columns={columns}
                pagination={false}
            />
        </Row>
    </>
}

export default Patterns;