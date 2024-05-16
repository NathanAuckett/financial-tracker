import { FC, useState, useContext, useEffect } from "react"
import { Flex, Form, Input, Button, Checkbox, Table } from "antd"
import type { FormProps } from "antd";
import axios from "axios";

import { UserContext, MessageContext } from '../context';

import { Pattern } from "../components/Pattern"
import FieldControls from '../components/FieldControls';
import EditableTableField from "./EditableTableInput";

import type { PatternGroupType, PatternType } from "../types"

type PatternRow = PatternType & {
    editing: boolean;
    newName: string;
}

function patternSetNewValueDefaults(pattern:PatternRow, editing = false){
    pattern.editing = editing;
    pattern.newName = pattern.name;
}

function findPatternFromID(patterns:PatternRow[], pattern_id:number){
    const index = patterns.findIndex((e) => { //spread found element into object
        return e.pattern_id === pattern_id;
    })
    return patterns[index];
}

interface props {
    patternGroup: PatternGroupType;
    getPatternGroups: Function;
}
export const PatternGroup:FC<props> = (props) => {
    const { userID } = useContext(UserContext);
    const { patternGroup, getPatternGroups } = props;
    const [ patterns, setPatterns ] = useState<PatternRow[]>(patternGroup.patterns as PatternRow[]);
    const { showMessage } = useContext(MessageContext);
    
    const [showForm, setShowForm] = useState(false);

    const handleSubmit:FormProps['onFinish'] = async (values) => {
        console.log("Submit", {
            user_id: userID,
            pattern_group_id: patternGroup.pattern_group_id,
            name: values.name,
            regex_array: values.regex_array,
            match_array: values.match_array
        });
        
        await axios.post(`${process.env.REACT_APP_API_ROOT}patterns/pattern`, {
            pattern_group_id: patternGroup.pattern_group_id,
            name: values.name,
            regex_array: [values.regex_array],
            match_array: [values.match_array]
        })
        .then((response) => {
            console.log(response.data);
            setShowForm(false);
            getPatternGroups();
        })
        .catch((error) => {
            console.log(error);
        });
    }

    async function handlePatternDelete(pattern_id:number){
        await axios.delete(`${process.env.REACT_APP_API_ROOT}patterns/delete-pattern`, {
            params: {
                pattern_id: pattern_id
            }
        })
        .then(() => {
            showMessage("success", "Pattern Deleted!");
            getPatternGroups();
        })
        .catch((error:Error) => {
            showMessage("error", "CSV Format deletion failed!");
            console.log(error.message);
        });
    }

    async function handlePatternEdit(pattern_id:number){
        const row = findPatternFromID(patterns, pattern_id);
        if (row.name !== row.newName){
            await axios.patch(`${process.env.REACT_APP_API_ROOT}patterns/update-pattern`, {
                pattern_id: pattern_id,
                name: row.newName
            })
            .then(() => {
                showMessage("success", "Pattern Updated!");
                getPatternGroups();
            })
            .catch((error:Error) => {
                showMessage("error", "Pattern edit failed!");
                console.log(error.message);
            });
        }
        else{
            console.log("nothing changed");
            row.editing = false;
            setPatterns([...patterns]);
        }
    }
    
    useEffect(() => {
        const updatedPatterns = patternGroup.patterns as PatternRow[];
        updatedPatterns.forEach((e) => {
            patternSetNewValueDefaults(e);
        });
        setPatterns(updatedPatterns);
        console.log("Patterns", patterns);
    }, [patternGroup]);

    function renderPatternRegex(pattern:PatternType) {
        return (
            <Pattern pattern={pattern}/>
        )
    }

    const patternColumns = [
        {
            title: "Pattern Name",
            dataIndex: "name",
            render: (text:string, {pattern_id, name}:PatternRow, index:number) => {
                const thisRow = findPatternFromID(patterns, pattern_id);
                return (
                    <EditableTableField
                        currentValue={name}
                        row={thisRow}
                        onChange={( element:{ target:{value:string} } ) => {
                            thisRow.newName = element.target.value;
                            setPatterns([...patterns]);
                        }}
                    />
                )
            }
        },
        {
            title: "Actions",
            align: 'right' as const,
            render: (text:string, {pattern_id}:PatternType, index:number) => {
                const thisRow = findPatternFromID(patterns, pattern_id);
                const editing = thisRow?.editing || false; //ensures it defaults to false if editing cannot be found
                return (
                    <FieldControls
                        editing = {editing}
                        setEditing = {() => {
                            thisRow.editing = !editing;
                            if (thisRow.editing){//set to default on edit start
                                patternSetNewValueDefaults(thisRow, true);
                            }
                            setPatterns([...patterns]);
                        }}
                        handleEdit = {() => {handlePatternEdit(pattern_id)}}
                        handleDelete = {() => {handlePatternDelete(pattern_id)}}
                    />
                )
            }
        }
    ];

    return (
        <>
            <Table
                rowKey="pattern_id"
                dataSource={patterns}
                columns={patternColumns}
                expandable={{expandedRowRender: renderPatternRegex}}
                pagination={false}
            />
            
            {showForm ? 
                <>
                    <Button onClick={() => {setShowForm(false)}}>Cancel</Button>
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
                            rules={[{ required: true, message: 'Please input the regex to check for!' }]}
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
                </>
            : 
                <Button onClick={() => {setShowForm(true)}}>Add Pattern</Button>
            }
        </>
    )
}

export default PatternGroup;