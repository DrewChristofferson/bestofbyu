import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";


const COLORS = ["#a9024a", "#24d4ae", "#FFBB28", "#FF8042"];



export default function DataLineChart(props) {
  //https://css-tricks.com/snippets/javascript/random-hex-color/
  const randomColor = Math.floor(Math.random()*16777215).toString(16);
  return (
    <LineChart
      width={800}
      height={300}
      data={props.data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend verticalAlign="top" align="right" layout="vertical" height={36} chartWidth={20} iconType="circle" margin={{  top: 0, left: 40, right: 40, bottom: 0 }}/>
      {
        Object.keys(props.data[0]).map((key, i) => {
          if(key !== "name"){
            return(
              <Line key={key} type="monotone" dataKey={key} stroke={COLORS[i]} activeDot={{ r: 8 }}/>
            )
          }else{
            return null;
          }
          
        }
        )
      }

      {/* <Line
        type="monotone"
        dataKey="Greg Andersen"
        stroke="#8884d8"
        activeDot={{ r: 8 }}
      />
      <Line type="monotone" dataKey="Degan Kettles" stroke="#82ca9d" activeDot={{ r: 8 }}/>
      <Line type="monotone" dataKey="Stephen Liddle" stroke="#82339d" activeDot={{ r: 8 }}/>
      <Line type="monotone" dataKey="Gove Allen" stroke="#32ca9d" activeDot={{ r: 8 }}/> */}
    </LineChart>
  );
}
