import react from 'react'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Legend
} from 'recharts';

const LINE_DATA = [
  { name: 'Mon', count: 400 },
  { name: 'Tue', count: 300 },
  { name: 'Wed', count: 600 },
  { name: 'Thu', count: 800 },
  { name: 'Fri', count: 500 },
  { name: 'Sat', count: 900 },
  { name: 'Sun', count: 1000 },
];
const CATEGORY_DATA = [
  { category: 'Tech', registrations: 2400 },
  { category: 'Arts', registrations: 1398 },
  { category: 'Sports', registrations: 9800 },
  { category: 'Business', registrations: 3908 },
  { category: 'Science', registrations: 4800 },
];

export const TrendChart = ({data})=>{
     const actualData = data?.length > 0 ? data : LINE_DATA
    return (<div className="h-64 w-full min-w-0">
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={actualData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" fontSize={12} stroke="#9CA3AF" />
        <YAxis fontSize={12} stroke="#9CA3AF" />
        <Tooltip />
        <Line type="monotone" dataKey="attendance" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
)
}

export const CategoryBarChart = ({data }) => {
      const actualData = data?.length > 0 ? data : CATEGORY_DATA
     return (
      <div className="h-64 w-full min-w-0">
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={actualData} layout="vertical" margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
        <XAxis type="number" hide />
        <YAxis dataKey="category" type="category" fontSize={12} stroke="#4B5563" width={80} padding={{ top: 20, bottom: actualData.length === 1 ? 150 : 0 }} />
        <Tooltip />
        <Bar dataKey="registrations" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={20} />
      </BarChart>
    </ResponsiveContainer>
  </div>
     )
};





