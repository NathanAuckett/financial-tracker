import { FC } from "react";
import { Button } from "antd";
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
                    <Button type='text' danger onClick={()=>{handleDelete()}}>
                        <DeleteOutlined/>
                    </Button>
                </>
            }
        </>
    )
}

export default FieldControls;