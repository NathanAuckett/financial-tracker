import { LineChart, Line, Tooltip, XAxis, YAxis, Legend} from "recharts";
import { FC } from "react";

interface props {
    data:object[]
}

const Chart:FC<props> = (props) => {
    const {data} = props;

    return (
        <LineChart width={1500} height={400} data={data}>
            <Line dataKey="balance"/>
            <XAxis dataKey="transaction_date"/>
            <YAxis/>
            <Tooltip/>
            <Legend/>
        </LineChart>
    )
}

export default Chart;