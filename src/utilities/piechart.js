import React, { PureComponent } from 'react';
import * as bs from 'react-bootstrap'
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Group A', value: 400 },
  { name: 'Group B', value: 300 },
  { name: 'Group C', value: 300 },
  { name: 'Group D', value: 200 },
];



const COLORS = ['#28A745', '#DC3545',  '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function DataPieChart(props) {
  if(props.data){
    let upVotePercentage = (props.data[0].value / (props.data[0].value + props.data[1].value)) * 100;
    return (
      <>
      <bs.Row style={{textAlign: "center"}}>
        <h3>{upVotePercentage.toFixed(0)}% Positive Rankings</h3>
      </bs.Row>
      <bs.Row>
        <PieChart width={400} height={400}>
            <Pie
              data={props.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              <Tooltip />
              {props.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
      </bs.Row>
        </>
    );
  } else return null;
}
  

    

    

