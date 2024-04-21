import { FC, useEffect, useState, useContext } from 'react';
import { Upload, Form, Button} from 'antd';
import type { FormProps } from "antd";




interface props {
    
}

const AddTransactions:FC<props> = (props) => {

    const handleSubmit:FormProps['onFinish'] = async (values) => {
        console.log({
            ...values
        });
    }

    return (
        <>
            <p>Add your tranactions here yaaaay!</p>
            <Form
                onFinish={handleSubmit}
            >
                <Form.Item>
                    <Upload
                        showUploadList={true}
                    >
                        <p>Drop CSV file here</p>
                    </Upload>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 2, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default AddTransactions;