import { FC, useEffect, useState, useContext } from 'react';
import { Card, Row, Button, Form, Input, Table} from "antd";
import type { FormProps } from "antd";
import axios from "axios";

import { getCategories } from '../helper-functions/getCategories';

import { UserContext, MessageContext } from '../context';
import type { Category } from '../types';

import FieldControls from '../components/FieldControls';
import EditableTableField from '../components/EditableTableField';

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
    const { showMessage } = useContext(MessageContext);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const handleSubmit:FormProps['onFinish'] = async (values) => {
        await axios.post(`${process.env.REACT_APP_API_ROOT}categories/category`, {
            user_id: userID,
            ...values
        })
        .then((response) => {
            showMessage("success", "Category Created!");
            fetchCategories();
        })
        .catch((error) => {
            showMessage("error", "Category creation failed!");
            console.log(error);
        });
    }

    async function handleCategoryEdit(category_id:number, oldName:string, newName:string){
        if (oldName !== newName){
            await axios.patch(`${process.env.REACT_APP_API_ROOT}categories/update-category`, {
                user_id: userID,
                category_id: category_id,
                name: newName
            })
            .then(() => {
                showMessage("success", "Category Updated!");
                fetchCategories();
            })
            .catch((error:Error) => {
                showMessage("error", "Category update failed!");
                console.log(error.message);
            });
        }
        else{
            findCategoryIndexFromID(categories, category_id).editing = false;
            setCategories([...categories]);
        }
    }

    async function handleCategoryDelete(category_id:number){
        await axios.delete(`${process.env.REACT_APP_API_ROOT}categories/delete-category`, {
            params: {
                user_id: userID,
                category_id: category_id
            }
        })
        .then(() => {
            showMessage("success", "Category deleted!");
            fetchCategories();
        })
        .catch((error:Error) => {
            showMessage("error", "Category deletion failed!");
            console.log(error.message);
        });
    }

    const columns = [
       {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            align: 'left' as const,
            render: (text:string, {category_id, name}:Category, index:number) => {
                const thisRow = findCategoryIndexFromID(categories, category_id);
                return (
                    <EditableTableField
                        currentValue={name}
                        row={thisRow}
                        onChange={( element:{ target:{value:string} } ) => {
                            thisRow.newName = element.target.value;
                            setCategories([...categories]);
                        }}
                    />
                )
                // return (
                //     <>
                //         {thisCategoryRow.editing ?
                //             <Input 
                //                 name='name'
                //                 defaultValue={name}
                //                 style={{display: "inline", width:"max-content"}}
                //                 onChange={(element) => {
                //                     thisCategoryRow.newName = element.target.value;
                //                     setCategories([...categories]);
                //                 }}
                //             />
                //         :
                //             <p style={{display:"inline", marginRight: 5}}>{name}</p>
                //         }
                //     </>
                // )
            }
        },
        {
            title: 'Actions',
            key: "actions",
            align: 'right' as const,
            render: (text:string, {category_id}:Category, index:number) => {
                const thisRow = findCategoryIndexFromID(categories, category_id);
                const editing = thisRow?.editing || false; //ensures it defaults to false if editing cannot be found
                return (
                    <FieldControls
                        editing = {editing}
                        setEditing = {() => {
                            thisRow.editing = !editing;
                            if (thisRow.editing){
                                thisRow.newName = thisRow.name; //set to default on edit start
                            }
                            setCategories([...categories]);
                        }}
                        handleEdit = {() => {handleCategoryEdit(thisRow.category_id, thisRow.name, thisRow.newName);}}
                        handleDelete = {() => {handleCategoryDelete(thisRow.category_id);}}
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