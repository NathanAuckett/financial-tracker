import { FC, useState, useContext } from "react"
import { Flex, Form, Input, Button, Checkbox } from "antd"
import type { FormProps } from "antd";
import axios from "axios";

import { Pattern, PatternType} from "../components/Pattern"

import { UserContext } from "../App";

export type PatternGroupType = {
    pattern_group_id?: number,
    category_id?: number,
    name: string,
    patterns: PatternType[]
}

interface props extends PatternGroupType {
    getPatternGroups: Function
}

export const PatternGroup:FC<props> = (props) => {
    const { userID } = useContext(UserContext);
    const { name, patterns, category_id, pattern_group_id, getPatternGroups } = props;
    
    const [showForm, setShowForm] = useState(false);


    const handleSubmit:FormProps['onFinish'] = async (values) => {
        console.log({
            user_id: userID,
            pattern_group_id: pattern_group_id,
            name: values.name,
            regex_array: values.regex_array,
            match_array: values.match_array
        });
        
        await axios.post('http://localhost:3000/patterns/pattern', {
            pattern_group_id: pattern_group_id,
            name: values.name,
            regex_array: [values.regex_array],
            match_array: [values.match_array]
        })
        .then((response) => {
            console.log(response.data);
            getPatternGroups();
        })
        .catch((error) => {
            console.log(error);
        });
    }

    return (
        <Flex vertical style={{borderStyle: 'solid'}}>
            <h3>Group: {name} ---{">"} Category: {category_id}</h3>

            {/* Show patterns */}
            {patterns.map((e) => {
                return <Pattern name={e.name} regex_array={e.regex_array} match_array={e.match_array}/>
            })}
            
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
            
        </Flex>
    )
}

export default PatternGroup;