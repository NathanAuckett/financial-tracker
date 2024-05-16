import { FC, useContext, useEffect, useState } from "react";
import { Row, Card, Form, Input, Button, Table } from "antd";
import type { FormProps } from "antd";
import axios from "axios";

import { UserContext, MessageContext} from '../context';
import type { CSVFormat } from "../types";

import FieldControls from '../components/FieldControls';
import EditableTableInput from "../components/EditableTableInput";

type CSVFormatRow = CSVFormat & {
    [index: string]: string | boolean;
    editing: boolean;
    newBankName: string;
    newAccountNumber: string;
    newTransactionDate: string;
    newCredit: string;
    newDebit: string;
    newDescription: string;
    newType: string;
    newBalance: string;
}

function formatSetNewValueDefaults(format:CSVFormatRow, editing = false){
    format.editing = editing;
    format.newBankName = format.bank_name;
    format.newAccountNumber = format.account_number;
    format.newTransactionDate = format.transaction_date;
    format.newCredit = format.credit;
    format.newDebit = format.debit;
    format.newDescription = format.description;
    format.newType = format.type;
    format.newBalance = format.balance;
}

function findCSVFormatFromID(formats:CSVFormatRow[], csv_format_id:number){
    const index = formats.findIndex((e) => { //spread found element into object
        return e.csv_format_id === csv_format_id;
    })
    return formats[index];
}

export const CSVFormats:FC = () => {
    const { userID } = useContext(UserContext);
    const [ formats, setFormats ] = useState<CSVFormatRow[]>([]);
    const { showMessage } = useContext(MessageContext);

    async function getFormats() {
        await axios.get(`${process.env.REACT_APP_API_ROOT}csv-formats/get-formats`, {
            params:{
                user_id: userID,
                columns: undefined
            }
        })
        .then((response) => {
            const formats = response.data.formats as CSVFormatRow[];
            
            formats.forEach((e) => {
                formatSetNewValueDefaults(e);
            });

            console.log("Formats", formats);

            setFormats(formats);
        })
        .catch((error:Error) => {
            showMessage("error", "Error fetching CSV formats!");
            console.log("CSV Format Fetch error:", error.message);
        });
    }

    useEffect(() => {
        getFormats();
    }, []);

    const handleSubmit:FormProps['onFinish'] = async (values) => {
        console.log({
            user_id: userID,
            ...values
        });
        
        await axios.post('http://localhost:3000/csv-formats/format', {
            user_id: userID,
            ...values
        })
        .then((response) => {
            console.log(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    }
    
    async function handleFormatEdit(csv_format_id:number){
        const row = findCSVFormatFromID(formats, csv_format_id);
        if (row.bank_name !== row.newBankName ||
            row.account_number !== row.newAccountNumber ||
            row.transaction_date !== row.newTransactionDate ||
            row.credit !== row.newCredit ||
            row.debit !== row.newDebit ||
            row.description !== row.newDescription ||
            row.type !== row.newType || 
            row.balance !== row.newBalance){
            await axios.patch(`${process.env.REACT_APP_API_ROOT}csv-formats/update-csv-format`, {
                user_id: userID,
                csv_format_id: csv_format_id,
                bank_name: row.newBankName,
                account_number: row.newAccountNumber,
                transaction_date: row.newTransactionDate,
                credit: row.newCredit,
                debit: row.newDebit,
                description: row.newDescription,
                type: row.newType,
                balance: row.newBalance
            })
            .then(() => {
                showMessage("success", "Format Updated!");
                getFormats();
            })
            .catch((error:Error) => {
                showMessage("error", "Format edit failed!");
                console.log(error.message);
            });
        }
        else{
            console.log("nothing changed");
            row.editing = false;
            setFormats([...formats]);
        }
    }

    async function handleFormatDelete(csv_format_id:number){
        await axios.delete(`${process.env.REACT_APP_API_ROOT}csv-formats/delete-csv-format`, {
            params: {
                user_id: userID,
                csv_format_id: csv_format_id
            }
        })
        .then(() => {
            showMessage("success", "CSV Format Deleted!");
            getFormats();
        })
        .catch((error:Error) => {
            showMessage("error", "CSV Format deletion failed!");
            console.log(error.message);
        });
    }

    const inputStyle:React.CSSProperties = {width: "8rem"};
    const columns = [
        {
            title: 'Database Names:',
            render: () => {
                return "CSV Names:"
            }
        },
        {
            title: 'Bank',
            dataIndex: 'bank_name',
            key: 'bank_name',
            align: 'center' as const,
            render: (text:string, {csv_format_id, bank_name}:CSVFormatRow, index:number) => {
                const thisRow = findCSVFormatFromID(formats, csv_format_id);
                return (
                    <EditableTableInput
                        currentValue={bank_name}
                        row={thisRow}
                        style={inputStyle}
                        onChange={( element:{ target:{value:string} } ) => {
                            thisRow.newBankName = element.target.value;
                            setFormats([...formats]);
                        }}
                    />
                )
            }
        },
        {
            title: 'account_number',
            dataIndex: 'account_number',
            key: 'account_number',
            align: 'center' as const,
            render: (text:string, {csv_format_id, account_number}:CSVFormatRow, index:number) => {
                const thisRow = findCSVFormatFromID(formats, csv_format_id);
                return (
                    <EditableTableInput
                        currentValue={account_number}
                        row={thisRow}
                        style={inputStyle}
                        onChange={( element:{ target:{value:string} } ) => {
                            thisRow.newAccountNumber = element.target.value;
                            setFormats([...formats]);
                        }}
                    />
                )
            }
        },
        {
            title: 'transaction_date',
            dataIndex: 'transaction_date',
            key: 'transaction_date',
            align: 'center' as const,
            render: (text:string, {csv_format_id, transaction_date}:CSVFormatRow, index:number) => {
                const thisRow = findCSVFormatFromID(formats, csv_format_id);
                return (
                    <EditableTableInput
                        currentValue={transaction_date}
                        row={thisRow}
                        style={inputStyle}
                        onChange={( element:{ target:{value:string} } ) => {
                            thisRow.newTransactionDate = element.target.value;
                            setFormats([...formats]);
                        }}
                    />
                )
            }
        },
        {
            title: 'credit',
            dataIndex: 'credit',
            key: 'credit',
            align: 'center' as const,
            render: (text:string, {csv_format_id, credit}:CSVFormatRow, index:number) => {
                const thisRow = findCSVFormatFromID(formats, csv_format_id);
                return (
                    <EditableTableInput
                        currentValue={credit}
                        row={thisRow}
                        style={inputStyle}
                        onChange={( element:{ target:{value:string} } ) => {
                            thisRow.newCredit = element.target.value;
                            setFormats([...formats]);
                        }}
                    />
                )
            }
        },
        {
            title: 'debit',
            dataIndex: 'debit',
            key: 'debit',
            align: 'center' as const,
            render: (text:string, {csv_format_id, debit}:CSVFormatRow, index:number) => {
                const thisRow = findCSVFormatFromID(formats, csv_format_id);
                return (
                    <EditableTableInput
                        currentValue={debit}
                        row={thisRow}
                        style={inputStyle}
                        onChange={( element:{ target:{value:string} } ) => {
                            thisRow.newDebit = element.target.value;
                            setFormats([...formats]);
                        }}
                    />
                )
            }
        },
        {
            title: 'description',
            dataIndex: 'description',
            key: 'description',
            align: 'center' as const,
            render: (text:string, {csv_format_id, description}:CSVFormatRow, index:number) => {
                const thisRow = findCSVFormatFromID(formats, csv_format_id);
                return (
                    <EditableTableInput
                        currentValue={description}
                        row={thisRow}
                        style={inputStyle}
                        onChange={( element:{ target:{value:string} } ) => {
                            thisRow.newDescription = element.target.value;
                            setFormats([...formats]);
                        }}
                    />
                )
            }
        },
        {
            title: 'type',
            dataIndex: 'type',
            key: 'type',
            align: 'center' as const,
            render: (text:string, {csv_format_id, type}:CSVFormatRow, index:number) => {
                const thisRow = findCSVFormatFromID(formats, csv_format_id);
                return (
                    <EditableTableInput
                        currentValue={type}
                        row={thisRow}
                        style={inputStyle}
                        onChange={( element:{ target:{value:string} } ) => {
                            thisRow.newType = element.target.value;
                            setFormats([...formats]);
                        }}
                    />
                )
            }
        },
        {
            title: 'balance',
            dataIndex: 'balance',
            key: 'balance',
            align: 'center' as const,
            render: (text:string, {csv_format_id, balance}:CSVFormatRow, index:number) => {
                const thisRow = findCSVFormatFromID(formats, csv_format_id);
                return (
                    <EditableTableInput
                        currentValue={balance}
                        row={thisRow}
                        style={inputStyle}
                        onChange={( element:{ target:{value:string} } ) => {
                            thisRow.newBalance = element.target.value;
                            setFormats([...formats]);
                        }}
                    />
                )
            }
        },
        {
            title: 'Actions',
            key: "actions",
            align: 'right' as const,
            render: (text:string, {csv_format_id}:CSVFormat, index:number) => {
                const thisRow = findCSVFormatFromID(formats, csv_format_id);
                const editing = thisRow?.editing || false; //ensures it defaults to false if editing cannot be found
                return (
                    <FieldControls
                        editing = {editing}
                        setEditing = {() => {
                            thisRow.editing = !editing;
                            if (thisRow.editing){//set to default on edit start
                                formatSetNewValueDefaults(thisRow, true);
                            }
                            setFormats([...formats]);
                        }}
                        handleEdit = {() => {handleFormatEdit(csv_format_id)}}
                        handleDelete = {() => {handleFormatDelete(csv_format_id)}}
                    />
                )
            }
        }
    ];

    return (
        <>
            <Row gutter={200} justify={"center"}>
                <Card key={0} title="New Bank CSV Format" style={{width:800}}>
                    <Form
                        style={{ maxWidth: 600}}
                        onFinish={handleSubmit}
                        labelCol={{span: 10}}
                        spellCheck={true}
                    >
                        <Form.Item
                            label="Bank Name"
                            name="bank_name"
                            rules={[{ required: true, message: 'Please input a bank name!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Account Number"
                            name="account_number"
                            rules={[{ required: true, message: 'Please input the account number CSV title!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Transaction Date"
                            name="transaction_date"
                            rules={[{ required: true, message: 'Please input the transaction date CSV title!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Credit"
                            name="credit"
                            rules={[{ required: true, message: 'Please input the credit CSV title!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Debit"
                            name="debit"
                            rules={[{ required: true, message: 'Please input the debit CSV title!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Description"
                            name="description"
                            rules={[{ required: true, message: 'Please input the description CSV title!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Type"
                            name="type"
                            rules={[{ required: true, message: 'Please input the type CSV title!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Balance"
                            name="balance"
                            rules={[{ required: true, message: 'Please input the balance CSV title!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Row>
            <Row gutter={16} justify={"center"}>
                <Table
                    columns={columns}
                    dataSource={formats}
                    pagination={false}
                    style={{minWidth: 800}}
                    bordered
                />
            </Row>
        </>
    );
}

export default CSVFormats;