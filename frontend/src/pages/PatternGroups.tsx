import { FC, useEffect, useState, useContext } from 'react';
import { Card, Row, Button, Form, Input, Table, Select } from "antd";
import type { FormProps } from "antd";
import axios from "axios";

import { UserContext } from '../context';

import { PatternGroup } from '../components/PatternGroup'
import type { PatternGroupType } from '../types';

type CategorySelectOptionType = {
    category_id:number,
    name:string,
    value?:number,
    label?:string
}

const PatternGroups:FC<{}> = () => {
    const { userID } = useContext(UserContext);
    const [patternGroups, setPatternGroups] = useState<PatternGroupType[]>([]);
    const [categorySelectOptions, setCategorySelectOptions] = useState<CategorySelectOptionType[]>([]);

    const handleSubmit:FormProps['onFinish'] = async (values) => {
        console.log(values);
        
        await axios.post(`${process.env.REACT_APP_API_ROOT}pattern-groups/pattern-group`, {
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
        await axios.get(`${process.env.REACT_APP_API_ROOT}pattern-groups/get-pattern-groups`, {
            params:{
                user_id: userID,
                columns: JSON.stringify(["pattern_group_id", "name", "category_id"])
            }
        })
        .then((response) => {
            const patternGroups:PatternGroupType[] = response.data.patternGroups;
            
            patternGroups.forEach((e) => {
                e.category_name = getCategoryNameFromID(e.category_id);
            });

            console.log("Pattern groups", patternGroups);
            setPatternGroups(patternGroups);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    async function getCategories() {
        await axios.get(`${process.env.REACT_APP_API_ROOT}categories/get-categories`, {
            params:{
                user_id: userID,
                columns: JSON.stringify(["category_id", "name"])
            }
        })
        .then((response) => {
            const categories = response.data.categories as CategorySelectOptionType[];

            const options:CategorySelectOptionType[] = [];
            categories.forEach(({category_id, name}) => {
                const option = {
                    value: category_id,
                    category_id: category_id,
                    name: name,
                    label: name
                }
                options.push(option);
            });

            console.log("Category options", options);
            setCategorySelectOptions(options);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    function getCategoryNameFromID(categoryID:number):string {
        const count = categorySelectOptions.length;
        console.log(count);

        for (let i = 0; i < count; i ++){
            if (categorySelectOptions[i].category_id === categoryID){
                return categorySelectOptions[i].name
            }
        }

        return "";
    }
    useEffect(() => {
        getCategories();
    }, []);

    useEffect(() => {
        getPatternGroups();
    }, [categorySelectOptions]);

    const groupColumns = [
        {
            title: "Group Name",
            dataIndex: "name"
        },
        {
            title: "Category",
            dataIndex: "category_name"
        },
        {
            title: "Actions"
        }
    ];

    const renderPatternGroup = (patternGroup: PatternGroupType) => {
        return (
            <PatternGroup patternGroup={patternGroup} getPatternGroups={getPatternGroups}/>
        )
    }

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
                        label="Category to match"
                        name="category_id"
                        rules={[{ required: true, message: 'Please input the category for this group to match into!' }]}
                    >
                        <Select
                            options = {categorySelectOptions}
                        />
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
            <Table
                rowKey="pattern_group_id"
                dataSource={patternGroups}
                columns={groupColumns}
                expandable={{expandedRowRender: renderPatternGroup}}
            />
        </Row>
    </>
}

export default PatternGroups;