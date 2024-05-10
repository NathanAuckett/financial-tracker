import { FC, useEffect, useState, useContext } from 'react';
import { Upload, Form, Button, Input} from 'antd';
import type { FormProps } from "antd";
import axios from 'axios';

import { UserContext } from '../context';


interface props {
    
}

const AddTransactions:FC<props> = (props) => {
    const { userID } = useContext(UserContext);
    const [file, setFile] = useState<File | undefined>();

    const handleSubmit:FormProps['onFinish'] = async (values) => {
        console.log(file);

        if (file === undefined) return;

        const formData = new FormData();
        formData.append("file", file);

        console.log(formData);

        await axios({
            url: `${process.env.REACT_APP_API_ROOT}transactions/uploadCSV?user_id=${userID}`,
            method: "POST",
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error);
        });

    }

    const handleFileChange = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement & {files: FileList};

        console.log("target", target.files);
        setFile(target.files[0]);
    }

    return (
        <>
            <p>Add your tranactions here yaaaay!</p>
            <Form
                onFinish={handleSubmit}
            >
                <Form.Item wrapperCol={{ offset: 2, span: 16 }}
                    label="CSV File"
                    name="csv_file"
                    rules={[{ required: true, message: 'Please select a CSV file containing your transactions!' }]}
                >
                    <Input
                        type="file"
                        onChange={handleFileChange}
                        accept='text/csv'
                    />
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