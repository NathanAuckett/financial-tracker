import { Table } from "antd";
import { FC } from "react";

const columns = [
    {
        title: 'Account',
        dataIndex: 'account_id',
        key: 'account'
    },
    {
        title: 'Date',
        dataIndex: 'transaction_date',
        key: 'transaction_date'
    },
    {
        title: 'Description',
        dataIndex: 'description',
        key: 'description'
    },
    {
        title: 'Credit',
        dataIndex: 'credit',
        key: 'credit'
    },
    {
        title: 'Debit',
        dataIndex: 'debit',
        key: 'debit'
    },
    {
        title: 'Categories',
        dataIndex: 'category_ids',
        key: 'category_ids'
    }
]; 


interface tableProps {
    data:object[]
}

const TransactionTable:FC<tableProps> = (props) => {
    const {data} = props;

    return (
        <Table dataSource={data} columns={columns}>
            
        </Table>
    )
}

export default TransactionTable;