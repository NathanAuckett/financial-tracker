import { FC, useEffect, useState, useContext } from 'react';
import { Card, Row, Button, Form, Input, Table, Select } from "antd";
import type { FormProps } from "antd";
import axios from "axios";

import { UserContext } from '../context';

import FieldControls from '../components/FieldControls'
import EditableTableInput from '../components/EditableTableInput';
import { PatternGroup } from '../components/PatternGroup'
import type { PatternGroupType } from '../types';

type PatternGroupRow = PatternGroupType & {
    editing: boolean;
    newName: string;
    newCategoryID: number;
}

type CategorySelectOptionType = {
    category_id:number,
    name:string,
    value?:number,
    label?:string
}

function patternGroupSetNewValueDefaults(patternGroup:PatternGroupRow, editing = false){
    patternGroup.editing = editing;
    patternGroup.newName = patternGroup.name;
    patternGroup.newCategoryID = patternGroup.category_id;
}

function findPatternGroupFromID(patternGroup:PatternGroupRow[], pattern_group_id:number){
    const index = patternGroup.findIndex((e) => { //spread found element into object
        return e.pattern_group_id === pattern_group_id;
    })
    return patternGroup[index];
}

const PatternGroups:FC<{}> = () => {
    const { userID } = useContext(UserContext);
    const [patternGroups, setPatternGroups] = useState<PatternGroupRow[]>([]);
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
            const patternGroups:PatternGroupRow[] = response.data.patternGroups;
            
            patternGroups.forEach((e) => {
                e.category_name = getCategoryNameFromID(e.category_id);
                patternGroupSetNewValueDefaults(e);
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

    async function handlePatternGroupEdit(){
        
    }

    async function handlePatternGroupDelete(){

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
            dataIndex: "name",
            align: "left" as const,
            render: (text:string, {pattern_group_id, name}:PatternGroupRow, index:number) => {
                const thisRow = findPatternGroupFromID(patternGroups, pattern_group_id);
                return (
                    <EditableTableInput
                        currentValue={name}
                        row={thisRow}
                        style={{width: "8rem"}}
                        onChange={( element:{ target:{value:string} } ) => {
                            thisRow.newName = element.target.value;
                            setPatternGroups([...patternGroups]);
                        }}
                    />
                )
            }
        },
        {
            title: "Category",
            dataIndex: "category_name",
            render: (text:string, {pattern_group_id, name}:PatternGroupRow, index:number) => {
                const thisRow = findPatternGroupFromID(patternGroups, pattern_group_id);
                return (
                    <>
                        {thisRow.editing ?
                            <Select
                                defaultValue={name}
                                options = {categorySelectOptions}
                                onChange = {(value) => {
                                    thisRow.newCategoryID = parseInt(value);
                                    setPatternGroups([...patternGroups]);
                                }}
                            />
                        :
                            <p style = {{display:"inline", marginRight: 5}}>{name}</p>
                        }
                    </>
                )
            }
        },
        {
            title: "Actions",
            align: 'right' as const,
            render: (text:string, {pattern_group_id}:PatternGroupRow, index:number) => {
                const thisRow = findPatternGroupFromID(patternGroups, pattern_group_id);
                const editing = thisRow?.editing || false; //ensures it defaults to false if editing cannot be found
                return (
                    <FieldControls
                        editing = {editing}
                        setEditing = {() => {
                            thisRow.editing = !editing;
                            if (thisRow.editing){//set to default on edit start
                                patternGroupSetNewValueDefaults(thisRow, true);
                            }
                            setPatternGroups([...patternGroups]);
                        }}
                        handleEdit = {() => {}}
                        handleDelete = {() => {}}
                    />
                )
            }
        }
    ];

    const renderPatternGroup = (patternGroup: PatternGroupType) => {
        return (
            <PatternGroup patternGroup={patternGroup} getPatternGroups={getPatternGroups}/>
        )
    }

    return (
        <>
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
                    id='pattern-group-table'
                    rowKey="pattern_group_id"
                    dataSource={patternGroups}
                    columns={groupColumns}
                    expandable={{expandedRowRender: renderPatternGroup}}
                />
            </Row>
        </>
    )
}

export default PatternGroups;