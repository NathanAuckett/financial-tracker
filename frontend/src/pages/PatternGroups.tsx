import { FC, useEffect, useState, useContext } from 'react';
import { Card, Col, Row, Button, Form, Input, Table, Checkbox, Select } from "antd";
import type { FormProps } from "antd";
import axios from "axios";

import { UserContext } from '../context';

import { PatternGroup, PatternGroupType } from '../components/PatternGroup'

type CategorySelectOptionType = {
    category_id?:number,
    name?:string,
    value?:number,
    label?:string
}

// type PatternGroupType = {
//     pattern_group_id?: number,
//     category_id?: number,
//     name: string,
//     patterns: PatternType[]
// }

type PatternType = {
    pattern_id?: number,
    name: string,
    regex_array: string[],
    match_array: boolean[]
}

type PatternDataType = {
    regex: string,
    match: string
}

const PatternGroups:FC<{}> = () => {
    const { userID } = useContext(UserContext);
    const [patternGroups, setPatternGroups] = useState([]);
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
            const patternGroups = response.data.patternGroups;
    
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
                    label: name
                }
                options.push(option);
            });

            console.log(options);
            setCategorySelectOptions(options);
        })
        .catch((error) => {
            console.log(error);
        });
    }

    useEffect(() => {
        getPatternGroups();
        getCategories();
    }, []);

    const groupColumns = [
        {
            title: "Group Name",
            dataIndex: "name"
        },
        {
            title: "Category ID",
            dataIndex: "category_id"
        }
    ]

    // const renderPatternRegex = (pattern:PatternType) => {
    //     const data: PatternDataType[] = [];

    //     pattern.regex_array.forEach((e, i) => {
    //         data.push({
    //             regex: e,
    //             match: pattern.match_array[i] ? "True" : "False"
    //         });
    //     });

    //     const patternColumns = [
    //         {
    //             title: "regex",
    //             dataIndex: "regex",
    //         },
    //         {
    //             title: "match",
    //             dataIndex: "match"
    //         }
    //     ];

    //     return (
    //         <Table
    //             dataSource={data}
    //             columns={patternColumns}
    //             pagination={false}
    //         />
    //     )
    // }

    const renderPatternGroup = (patternGroup: PatternGroupType) => {
        // const patterns = patternGroup.patterns;

        // const patternColumns = [
        //     {
        //         title: "Pattern Name",
        //         dataIndex: "name"
        //     }
        // ];

        return (
            <PatternGroup patternGroup={patternGroup} getPatternGroups={getPatternGroups}/>
            // <Table
            //     rowKey="pattern_id"
            //     dataSource={patterns}
            //     columns={patternColumns}
            //     expandable={{expandedRowRender: renderPatternRegex}}
            //     pagination={false}
            // />
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