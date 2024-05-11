import { FC } from "react";
import { Input } from "antd";


const EditableTableField:FC<{currentValue:string, row:{editing:boolean}, onChange:Function, style?:React.CSSProperties}> = (props) => {
    const {currentValue, row, onChange, style} = props;
    
    const defaultStyle:React.CSSProperties = {display: 'inline', textAlign: 'center'};

    return (
        <>
            {row.editing ?
                <Input 
                    name = 'name'
                    defaultValue = {currentValue}
                    style = {{...defaultStyle, ...style}}
                    onChange = {(element) => {
                        onChange(element);
                    }}
                />
            :
                <p style = {{display:"inline", marginRight: 5}}>{currentValue}</p>
            }
        </>
    )
}

export default EditableTableField;