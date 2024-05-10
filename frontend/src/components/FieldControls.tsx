import { FC } from "react";
import { Button, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';


interface IChart {
    handleEdit:Function;
    handleDelete:Function;
    editing:boolean;
    setEditing:Function;
}
const FieldControls:FC<IChart> = (props) => {
    const { handleEdit, handleDelete, editing, setEditing } = props;

    return (
        <>
            {editing ?
                <>
                    <Button type='link' onClick={()=>{handleEdit()}}>
                        <CheckCircleOutlined/>
                    </Button>
                    <Button type='text' danger onClick={()=>{setEditing(false)}}>
                        <StopOutlined/>
                    </Button>
                </>
            :
                <>
                    <Button type='link' onClick={()=>{setEditing(true)}}>
                        <EditOutlined/>
                    </Button>
                    <Popconfirm
                        placement="topRight"
                        title="Delete?"
                        description="Are you sure you want to delete this?"
                        onConfirm={()=>{handleDelete()}}
                        okText="Yes"
                    >
                        <Button type='text' danger>
                            <DeleteOutlined/>
                        </Button>
                    </Popconfirm>
                </>
            }
        </>
    )
}

export default FieldControls;