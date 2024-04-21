import { FC, useEffect, useState, useContext } from 'react';
import { Card, Col, Row, Button, Form, Input, Table, Flex, Layout} from "antd";
import type { FormProps } from "antd";
import axios from "axios";

import { UserContext } from "../App";


async function getCategories(categorySetter:Function, user_id = 1) {
    await axios.get('http://localhost:3000/categories/get_categories', {
        params:{
            user_id: user_id,
            columns: JSON.stringify(["category_id", "name"])
        }
    })
    .then((response) => {
        const categories = response.data.categories;

        console.log(categories);
        categorySetter(categories);
    })
    .catch((error) => {
        console.log(error);
    });
}


const columns = [
    {
        title: 'ID',
        dataIndex: 'category_id',
        key: 'category_id',
        align: 'center' as const
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        align: 'center' as const
    }
];

interface props {
    
}

const Categories:FC<props> = (props) => {
    const { userID } = useContext(UserContext);
    const [categories, setCategories] = useState([]);

    const handleSubmit:FormProps['onFinish'] = async (values) => {
        console.log({
            user_id: userID,
            ...values
        });
        
        await axios.post('http://localhost:3000/categories/category', {
            user_id: userID,
            ...values
        })
        .then((response) => {
            console.log(response.data);
            getCategories(setCategories, userID);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        getCategories(setCategories, userID);
    }, [userID]);


    return <>
        <Row gutter={200} justify={"center"}>
            <Card key={0} title="New Category" style={{width:800}}>
                <Form
                    name="category"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={handleSubmit}
                    // onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input the category name!' }]}
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
            <h2>Categories</h2>
        </Row>
        <Row gutter={16} justify={"center"}>
            <Table
                style={{width:800, textAlign:"center"}}
                dataSource={categories}
                columns={columns}
                pagination={false}
            />
        </Row>
    </>
}

export default Categories;