import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Users, Eye, Smartphone, Monitor, Tablet, TrendingUp, Globe, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [analytics, setAnalytics] = useState<any>({
    dailyVisits: [],
    weeklyVisits: [],
    monthlyVisits: [],
    topPages: [],
    trafficSources: [],
    devices: [],
    totalVisitors: 0
  });
  const { toast } = useToast();

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Load analytics data
  useEffect(() => {
    if (isAuthenticated) {
      loadAnalytics();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.username,
        password: credentials.password,
      });
      
      if (error) throw error;
      
      setIsAuthenticated(true);
      toast({
        title: "Inloggning lyckades",
        description: "Välkommen till adminpanelen",
      });
    } catch (error: any) {
      toast({
        title: "Inloggning misslyckades",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    toast({
      title: "Utloggad",
      description: "Du har loggats ut från adminpanelen",
    });
  };

  const loadAnalytics = async () => {
    try {
      // Load different analytics data
      const [dailyData, weeklyData, monthlyData, pagesData, sourcesData, devicesData] = await Promise.all([
        supabase.from('analytics_daily').select('*').order('date', { ascending: false }).limit(30),
        supabase.from('analytics_weekly').select('*').order('week_start', { ascending: false }).limit(12),
        supabase.from('analytics_monthly').select('*').order('month_start', { ascending: false }).limit(12),
        supabase.from('analytics_pages').select('*').order('visits', { ascending: false }).limit(10),
        supabase.from('analytics_sources').select('*').order('visits', { ascending: false }),
        supabase.from('analytics_devices').select('*').order('visits', { ascending: false }),
      ]);

      setAnalytics({
        dailyVisits: dailyData.data || [],
        weeklyVisits: weeklyData.data || [],
        monthlyVisits: monthlyData.data || [],
        topPages: pagesData.data || [],
        trafficSources: sourcesData.data || [],
        devices: devicesData.data || [],
        totalVisitors: dailyData.data?.reduce((sum, day) => sum + day.unique_visitors, 0) || 0
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Inloggning</CardTitle>
            <CardDescription>Logga in för att komma åt adminpanelen</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">E-post</Label>
                <Input
                  id="username"
                  type="email"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Lösenord</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Logga in
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  const deviceColors = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))'];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tian's Grill - Adminpanel</h1>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logga ut
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totala besökare</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics.totalVisitors}</div>
              <p className="text-xs text-muted-foreground">+12% från förra månaden</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Idag</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.dailyVisits[0]?.unique_visitors || 0}
              </div>
              <p className="text-xs text-muted-foreground">Unika besökare</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sidvisningar</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.dailyVisits[0]?.page_views || 0}
              </div>
              <p className="text-xs text-muted-foreground">Idag</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mest populär sida</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics.topPages[0]?.page || 'Hem'}
              </div>
              <p className="text-xs text-muted-foreground">
                {analytics.topPages[0]?.visits || 0} besök
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="visitors" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="visitors">Besökare</TabsTrigger>
            <TabsTrigger value="pages">Sidor</TabsTrigger>
            <TabsTrigger value="sources">Källor</TabsTrigger>
            <TabsTrigger value="devices">Enheter</TabsTrigger>
          </TabsList>

          <TabsContent value="visitors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Besökare över tid</CardTitle>
                <CardDescription>Dagliga unika besökare senaste 30 dagarna</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analytics.dailyVisits.slice(0, 30).reverse()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="unique_visitors" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Veckovis statistik</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={analytics.weeklyVisits.slice(0, 8).reverse()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week_start" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="unique_visitors" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Månadsvis statistik</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={analytics.monthlyVisits.slice(0, 6).reverse()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month_start" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="unique_visitors" fill="hsl(var(--secondary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="pages">
            <Card>
              <CardHeader>
                <CardTitle>Mest besökta sidor</CardTitle>
                <CardDescription>Sidvisningar de senaste 30 dagarna</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.topPages.map((page: any, index: number) => (
                    <div key={page.page} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span>{page.page}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{page.visits}</div>
                        <div className="text-xs text-muted-foreground">besök</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources">
            <Card>
              <CardHeader>
                <CardTitle>Trafikkällor</CardTitle>
                <CardDescription>Var kommer besökarna ifrån</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {analytics.trafficSources.map((source: any, index: number) => (
                      <div key={source.source} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4" />
                          <span>{source.source}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{source.visits}</div>
                          <div className="text-xs text-muted-foreground">
                            {((source.visits / analytics.totalVisitors) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={analytics.trafficSources}
                        dataKey="visits"
                        nameKey="source"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="hsl(var(--primary))"
                      >
                        {analytics.trafficSources.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={deviceColors[index % deviceColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices">
            <Card>
              <CardHeader>
                <CardTitle>Enhetsstatistik</CardTitle>
                <CardDescription>Vilka enheter använder besökarna</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {analytics.devices.map((device: any) => {
                      const Icon = device.device === 'mobile' ? Smartphone : 
                                   device.device === 'tablet' ? Tablet : Monitor;
                      return (
                        <div key={device.device} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" />
                            <span className="capitalize">{device.device}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{device.visits}</div>
                            <div className="text-xs text-muted-foreground">
                              {((device.visits / analytics.totalVisitors) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={analytics.devices}
                        dataKey="visits"
                        nameKey="device"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="hsl(var(--primary))"
                      >
                        {analytics.devices.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={deviceColors[index % deviceColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;