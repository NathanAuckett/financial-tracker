import { FC, useEffect, useState, useContext } from 'react';
import { Card, Row, Button, Form, Input, Table} from "antd";
import type { FormProps } from "antd";
import axios from "axios";

import { getCategories } from '../helper-functions/getCategories';

import { UserContext } from '../context';
import { Category } from '../types';

import FieldControls from '../components/FieldControls';

type CategoryRow = Category & {
    editing: boolean;
    newName: string;
}
const CategoryRowDefaults = {
    editing: false,
    newName: ""
}

function findCategoryIndexFromID(categories:CategoryRow[], category_id:number){
    const index = categories.findIndex((e) => { //spread found element into object
        return e.category_id === category_id;
    })
    return categories[index];
}

const Categories:FC<{}> = () => {
    const { userID } = useContext(UserContext);
    const [categories, setCategories] = useState<CategoryRow[]>([]);

    async function fetchCategories() {
        const categories = await getCategories(userID as number) as CategoryRow[];
        
        if (categories){
            categories.forEach((e) => {
                e.newName = CategoryRowDefaults.newName;
                e.editing = CategoryRowDefaults.editing;
            });

            setCategories(categories);
        }
    }

    useEffect(() => {
        fetchCategories();
    },[]);

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
            fetchCategories();
        })
        .catch((error) => {
            console.log(error);
        });
    }

    async function handleCategoryEdit(category_id:number, oldName:string, newName:string){
        if (oldName != newName){
            await axios.patch("http://localhost:3000/categories/update_category", {
                user_id: userID,
                category_id: category_id,
                name: newName
            })
            .then(() => {
                fetchCategories();
            })
            .catch((error:Error) => {
                console.log(error.message);
            });
        }
        else{
            findCategoryIndexFromID(categories, category_id).editing = false;
            setCategories([...categories]);
        }
    }

    async function handleCategoryDelete(category_id:number){
        await axios.delete("http://localhost:3000/categories/delete_category", {
            params: {
                user_id: userID,
                category_id: category_id
            }
        })
        .then(() => {
            fetchCategories();
        })
        .catch((error:Error) => {
            console.log(error.message);
        });
    }

    const columns = [
       {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            align: 'left' as const,
            render: (text:string, {category_id, name}:{category_id:number, name:string}, index:number) => {
                const thisCategoryRow = findCategoryIndexFromID(categories, category_id);
                
                return (
                    <>
                        {thisCategoryRow.editing ?
                            <Input 
                                name='name'
                                defaultValue={name}
                                style={{display: "inline", width:"max-content"}}
                                onChange={(element) => {
                                    thisCategoryRow.newName = element.target.value;
                                    setCategories([...categories]);
                                }}
                            />
                        :
                            <p style={{display:"inline", marginRight: 5}}>{name}</p>
                        }
                    </>
                )
            }
        },
        {
            title: 'Actions',
            key: "actions",
            align: 'right' as const,
            render: (text:string, {category_id, name}:{category_id:number, name:string}, index:number) => {
                const thisCategoryRow = findCategoryIndexFromID(categories, category_id);
                const editing = thisCategoryRow?.editing || false; //ensures it defaults to false if editing cannot be found

                return (
                    <FieldControls
                        editing = {editing}
                        setEditing = {() => {
                            thisCategoryRow.editing = !editing;
                            if (thisCategoryRow.editing){
                                thisCategoryRow.newName = thisCategoryRow.name; //set to default on edit start
                            }

                            setCategories([...categories]);
                        }}
                        handleEdit = {() => {handleCategoryEdit(thisCategoryRow.category_id, thisCategoryRow.name, thisCategoryRow.newName);}}
                        handleDelete = {() => {handleCategoryDelete(thisCategoryRow.category_id);}}
                    />
                )
            }
        }
    ];

    return (
        <>
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
    )
}

export default Categories;