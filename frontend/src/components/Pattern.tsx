import { FC } from "react"
import { Flex, Table } from "antd"

export type PatternType = {
    pattern_id?: number,
    name: string,
    regex_array: string[],
    match_array: boolean[]
}

type PatternDataType = {
    regex: string,
    match: string
}

export const Pattern:FC<PatternType> = (props) => {
    //const data = props.patterns as unknown as PatternType;

    const data:PatternDataType[] = [];
    
    props.regex_array.forEach((element, index) => {
        const obj:PatternDataType = {
            regex: element,
            match: props.match_array[index].toString()
        };

        data.push(obj);
    });

    return (
        <Flex vertical style={{borderStyle: 'solid none solid'}}>
        <h3>Pattern: {props.name}</h3>
        <Table
            style = {{width:800, textAlign:"center"}}
            dataSource = {data}
            columns = {[
                {
                    title: 'Regex',
                    dataIndex: 'regex',
                    key: 'regex',
                    align: 'center' as const
                },
                {
                    title: 'Match',
                    dataIndex: 'match',
                    key: 'match',
                    align: 'center' as const
                }
            ]}
            pagination = {false}
        />
        </Flex>
    )
}

export default Pattern;