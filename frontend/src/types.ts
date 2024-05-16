import { StringLiteral } from "typescript";

export type Category = {
    category_id: number;
    name: string;
}

export type Account = {
    bank_account_id: number;
    name: string;
    account_number: string;
}

export type CSVFormat = {
    csv_format_id: number;
    bank_name: string;
    account_number: string;
    transaction_date: string;
    credit: string;
    debit: string;
    description: string;
    type: string;
    balance: string;
}

export type PatternGroupType = {
    pattern_group_id: number,
    category_id: number,
    category_name?: string,
    name: string,
    patterns: PatternType[]
}

export type PatternRuleType = {
    regex_array: string[];
    match_array: boolean[];
}
export type PatternType = {
    pattern_id: number,
    name: string
}
& PatternRuleType;