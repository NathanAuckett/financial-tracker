import { LineChart, Line, Tooltip, XAxis, YAxis, Legend, ResponsiveContainer} from "recharts";
import { FC } from "react";

interface props {
    data:object[]
}

const Chart:FC<props> = (props) => {
    const {data} = props;

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
                <Line dataKey="balance"/>
                <XAxis dataKey="transaction_date"/>
                <YAxis/>
                <Tooltip/>
                <Legend/>
            </LineChart>
        </ResponsiveContainer>
    )
}

export default Chart;