import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Map as MapIcon, Info, Layers, Maximize2 } from "lucide-react";

export default function WardMap() {
  return (
    <Layout>
      <div className="bg-primary/5 border-b">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-serif font-bold text-primary mb-4">BMC Ward Map</h1>
            <p className="text-lg text-muted-foreground">
              Explore Mumbai's wards and constituencies. Click on a ward to view candidate details and fund utilization data.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Layers className="h-4 w-4" /> Map Layers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Boundary View</label>
                  <div className="flex flex-col gap-2">
                    <button className="flex items-center justify-between px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">
                      Administrative Wards
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    </button>
                    <button className="flex items-center justify-between px-3 py-2 rounded-md bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80">
                      Electoral Constituencies
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <label className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Data Heatmap</label>
                  <div className="flex flex-col gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80">
                      Fund Utilization
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 rounded-md bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80">
                      Population Density
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-secondary/5 border-secondary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Info className="h-4 w-4 text-secondary" /> Legend
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-3 h-3 rounded bg-primary"></div>
                  <span>High Spending (&gt;₹50Cr)</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-3 h-3 rounded bg-primary/60"></div>
                  <span>Mid Spending (₹20Cr - ₹50Cr)</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <div className="w-3 h-3 rounded bg-primary/20"></div>
                  <span>Low Spending (&lt;₹20Cr)</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map Area */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="overflow-hidden border-primary/10 shadow-xl min-h-[600px] flex flex-col relative">
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <button className="p-2 bg-white rounded-md shadow-md border hover:bg-muted transition-colors">
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>

              {/* Placeholder for real map integration */}
              <div className="flex-1 bg-muted/20 flex flex-col items-center justify-center p-12 text-center space-y-4">
                <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary animate-pulse">
                  <MapIcon size={48} />
                </div>
                <div className="max-w-md space-y-2">
                  <h3 className="text-xl font-serif font-bold text-primary">Map Integration Ready</h3>
                  <p className="text-muted-foreground text-sm">
                    This container is prepared for integration with Mapbox, Google Maps, or Leaflet. 
                    Interactive BMC Ward boundaries (GeoJSON) can be overlaid here.
                  </p>
                  <div className="pt-4 flex flex-wrap justify-center gap-2">
                    <Badge variant="outline">Ward A</Badge>
                    <Badge variant="outline">Ward D</Badge>
                    <Badge variant="outline">Ward G/South</Badge>
                    <Badge variant="outline">Ward K/East</Badge>
                    <Badge variant="outline">Ward R/Central</Badge>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-background border-t flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>Last Updated: 19 Jan 2026</span>
                  <span>Source: BMC Open Data Portal</span>
                </div>
                <div className="font-medium text-primary uppercase tracking-tighter">Mumbai Core Map v1.0</div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
               <Card>
                 <CardHeader>
                   <CardTitle className="text-lg font-serif">Ward Analysis: G/South</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4">
                   <div className="flex justify-between items-end">
                     <div>
                       <div className="text-2xl font-bold">₹82.4 Cr</div>
                       <div className="text-xs text-muted-foreground">Total Ward Budget</div>
                     </div>
                     <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Optimal Utilization</Badge>
                   </div>
                   <div className="h-2 bg-muted rounded-full overflow-hidden">
                     <div className="h-full bg-primary w-[75%]"></div>
                   </div>
                 </CardContent>
               </Card>
               
               <Card>
                 <CardHeader>
                   <CardTitle className="text-lg font-serif">Quick Stats</CardTitle>
                 </CardHeader>
                 <CardContent className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-muted/30">
                      <div className="text-xl font-bold">24</div>
                      <div className="text-xs text-muted-foreground">Total Wards</div>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <div className="text-xl font-bold">227</div>
                      <div className="text-xs text-muted-foreground">Corporators</div>
                    </div>
                 </CardContent>
               </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
