import { FC, useState, useContext } from "react"
import { Flex, Form, Input, Button, Checkbox, Table } from "antd"
import type { FormProps } from "antd";
import axios from "axios";

import { Pattern, PatternType} from "../components/Pattern"

import { UserContext } from '../context';

export type PatternGroupType = {
    pattern_group_id: number,
    category_id: number,
    category_name?: string,
    name: string,
    patterns: PatternType[]
}

interface props {
    patternGroup: PatternGroupType;
    getPatternGroups: Function;
}

export const PatternGroup:FC<props> = (props) => {
    const { userID } = useContext(UserContext);
    const { patternGroup, getPatternGroups } = props;
    const patterns = patternGroup.patterns;
    console.log("Patterns", patterns);
    
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
    
    function renderPatternRegex(pattern:PatternType) {
        return (
            <Pattern pattern={pattern}/>
        )
    }

    const patternColumns = [
        {
            title: "Pattern Name",
            dataIndex: "name"
        },
        {
            title: "Actions"
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