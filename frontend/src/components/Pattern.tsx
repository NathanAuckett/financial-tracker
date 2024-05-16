import { FC } from "react"
import { Table } from "antd"

import type { PatternType, PatternRuleType } from "../types";

type PatternRuleDisplayType = {
    regex: string,
    match: string
}

interface props {
    pattern: PatternType;
}

export const Pattern:FC<props> = (props) => {
    const { pattern } = props;
    const rules: PatternRuleDisplayType[] = [];

    pattern.regex_array.forEach((e, i) => {
        rules.push({
            regex: e,
            match: pattern.match_array[i] ? "True" : "False"
        });
    });

    
    function patternDisplayRulesToPatternRules(rules: PatternRuleDisplayType[]): PatternRuleType{
        const regexArray:string[] = [];
        const matchArray:boolean[] = [];

        rules.forEach((e) => {
            regexArray.push(e.regex);
            matchArray.push(e.match === "True" ? true : false);
        });

        return {regex_array: regexArray, match_array: matchArray}
    }

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
            dataSource={rules}
            columns={patternColumns}
            pagination={false}
        />
    )
}

export default Pattern;