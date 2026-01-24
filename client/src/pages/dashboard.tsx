import { Layout } from "@/components/layout";
import { useQuery } from "@tanstack/react-query";
import { Candidate } from "@shared/schema";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Dashboard() {
  const { data: candidates } = useQuery<Candidate[]>({
    queryKey: ["/api/candidates"],
  });

  // Aggregate data for the chart by Ward
  const wardAggregation = candidates?.reduce((acc, c) => {
    const ward = c.ward;
    if (!acc[ward]) {
      acc[ward] = {
        name: ward,
        allocated: 0,
        utilized: 0,
        candidates: [] as string[]
      };
    }
    acc[ward].allocated += c.funds.allocated;
    acc[ward].utilized += c.funds.utilized;
    acc[ward].candidates.push(c.name);
    return acc;
  }, {} as Record<string, { name: string; allocated: number; utilized: number; candidates: string[] }>) || {};

  const wardData = Object.values(wardAggregation).map(w => ({
    ...w,
    candidate: w.candidates.join(", ") // Join multiple candidate names
  })).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

  // Data for the grid cards (individual candidates, but with Ward information)
  const candidatesData = candidates?.map(c => ({
    name: c.ward,
    allocated: c.funds.allocated,
    utilized: c.funds.utilized,
    candidate: c.name
  })) || [];

  const formatCurrency = (value: number) => `₹${(value / 10000000).toFixed(1)}Cr`;

  return (
    <Layout>
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Ward Dashboard</h1>
          <p className="text-muted-foreground">Compare fund allocation and utilization across different wards.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
          <div className="flex gap-4 w-full sm:w-auto">
            <Select defaultValue="2025-2026">
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Financial Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-2026">FY 2025-2026</SelectItem>
                <SelectItem value="2024-2025">FY 2024-2025</SelectItem>
                <SelectItem value="2023-2024">FY 2023-2024</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Regions</SelectItem>
                <SelectItem value="north">North Zone</SelectItem>
                <SelectItem value="south">South Zone</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Chart */}
        <Card className="shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle className="font-serif">Fund Utilization by Ward</CardTitle>
            <CardDescription>Comparing allocated budget vs. actual spending</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={wardData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={formatCurrency}
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
                  />
                  <Legend />
                  <Bar dataKey="allocated" name="Allocated Funds" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="utilized" name="Utilized Funds" fill="hsl(var(--secondary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidatesData.map((data, i) => (
            <Card key={i} className="hover:border-primary/30 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-serif">{data.name}</CardTitle>
                  <div className="text-xs font-medium bg-muted px-2 py-1 rounded">
                    {(data.utilized / data.allocated * 100).toFixed(0)}% Utilized
                  </div>
                </div>
                <CardDescription>Rep: {data.candidate}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Allocated</span>
                      <span className="font-bold">{formatCurrency(data.allocated)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-full"></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Spent</span>
                      <span className="font-bold">{formatCurrency(data.utilized)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary"
                        style={{ width: `${(data.utilized / data.allocated * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
