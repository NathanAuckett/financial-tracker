import { FC, useEffect, useState, useContext } from 'react';
import { Card, Col, Row, Button, Form, Input, Table, Checkbox } from "antd";
import type { FormProps } from "antd";
import axios from "axios";

import { UserContext } from "../App";

import { PatternGroup, PatternGroupType } from "../components/PatternGroup"


interface props {
    
}

const Patterns:FC<props> = (props) => {
    const { userID } = useContext(UserContext);
    const [patternGroups, setPatternGroups] = useState([]);

    const handleSubmit:FormProps['onFinish'] = async (values) => {
        console.log(values);
        
        await axios.post('http://localhost:3000/pattern_groups/pattern_group', {
            user_id: userID,
            category_id: values.category_id,
            name: values.name
        })
        .then((response) => {
            console.log(response.data);
            getPatternGroups();
        })
        .catch((error) => {
            console.log(error);
        });
    }

    async function getPatternGroups() {
        await axios.get('http://localhost:3000/pattern_groups/get_pattern_groups', {
            params:{
                user_id: userID,
                columns: JSON.stringify(["pattern_group_id", "name", "category_id"])
            }
        })
        .then((response) => {
            const patternGroups = response.data.patternGroups;
    
            console.log(patternGroups);
            setPatternGroups(patternGroups);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        getPatternGroups();
    }, []);

    return <>
        <Row gutter={200} justify={"center"}>
            <Card key={0} title="New Pattern Group" style={{width:800}}>
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
                        rules={[{ required: true, message: 'Please input the group name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Category ID to match"
                        name="category_id"
                        rules={[{ required: true, message: 'Please input the category for this group to match into!' }]}
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
            <h2>Pattern Groups</h2>
        </Row>
        <Row justify={"center"}>
            {patternGroups.map((e:PatternGroupType) => {
                return <PatternGroup getPatternGroups={getPatternGroups} name={e.name} patterns={e.patterns} category_id={e.category_id} pattern_group_id={e.pattern_group_id}/>
            })}
        </Row>
    </>
}

export default Patterns;