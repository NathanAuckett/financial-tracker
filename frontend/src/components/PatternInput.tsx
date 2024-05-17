import { FC, useState } from "react"
import { Form, Input, Checkbox } from "antd"

interface props {
    
}

export const PatternInput:FC<props> = (props) => {
    const [regex, setRegex] = useState<string>("");
    const [match, setMatch] = useState<boolean>(true);

    return (
        <>
            <Form.Item label="Regex" >
                <Input onChange={(e) => {setRegex(e.target.value)}}/>
            </Form.Item>
            <Form.Item
                label="Match Regex"
            >
                <Checkbox defaultChecked={match} onChange={(e) => {setMatch(e.target.value)}}></Checkbox>
            </Form.Item>
        </>
    )
}

export default PatternInput;