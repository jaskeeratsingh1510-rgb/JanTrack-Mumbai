import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Candidate } from "@/lib/mock-data";

export function FundUtilizationChart({ funds }: { funds: Candidate['funds'] }) {
  const utilizationData = [
    { name: "Utilized", value: funds.utilized, color: "hsl(var(--chart-1))" },
    { name: "Remaining", value: funds.allocated - funds.utilized, color: "hsl(var(--muted))" },
  ];

  const projectData = funds.projects.map((p, i) => ({
    name: p.name,
    cost: p.cost,
    color: `hsl(var(--chart-${(i % 5) + 1}))`
  }));

  const formatCurrency = (value: number) => {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-card p-6 rounded-xl border shadow-sm">
        <h3 className="font-serif font-bold text-lg mb-6 text-center">Overall Fund Utilization</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={utilizationData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {utilizationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="text-center mt-4 space-y-1">
          <div className="text-sm text-muted-foreground">Total Allocated</div>
          <div className="text-2xl font-bold font-serif">{formatCurrency(funds.allocated)}</div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-xl border shadow-sm">
        <h3 className="font-serif font-bold text-lg mb-6 text-center">Project Cost Breakdown</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectData} layout="vertical" margin={{ left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={100} 
                tick={{ fontSize: 11 }}
                interval={0}
              />
              <Tooltip 
                formatter={(value: number) => `₹${(value / 100000).toFixed(1)}L`}
                cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="cost" radius={[0, 4, 4, 0]}>
                {projectData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
