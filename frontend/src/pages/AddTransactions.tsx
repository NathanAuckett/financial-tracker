import { FC, useEffect, useState, useContext } from 'react';
import { Upload } from 'antd';

interface props {
    
}

const AddTransactions:FC<props> = (props) => {

    return (
        <>
            <p>Add your tranactions here yaaaay!</p>
            <Upload
            showUploadList={true}
            >
                <p>Drop CSV file here</p>
            </Upload>
        </>
    )
}

export default AddTransactions;