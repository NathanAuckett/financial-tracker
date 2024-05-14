import { FC } from "react"
import { Flex, Table } from "antd"

export type PatternType = {
    pattern_id?: number,
    name: string,
    regex_array: string[],
    match_array: boolean[]
}

export type PatternDataType = {
    regex: string,
    match: string
}

interface props {
    pattern: PatternType;
}

export const Pattern:FC<props> = (props) => {
    const { pattern } = props;
    const data: PatternDataType[] = [];

    pattern.regex_array.forEach((e, i) => {
        data.push({
            regex: e,
            match: pattern.match_array[i] ? "True" : "False"
        });
    });

    const patternColumns = [
        {
            title: "Regex",
            dataIndex: "regex",
        },
        {
            title: "Match",
            dataIndex: "match"
        },
        {
            title: "Actions"
        }
    ];

    return (
        <Table
            dataSource={data}
            columns={patternColumns}
            pagination={false}
        />
    )
}

export default Pattern;