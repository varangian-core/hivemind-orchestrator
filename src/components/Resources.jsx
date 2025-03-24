import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Gauge, BarChart, LineChart } from './ui/charts';

const Resources = ({ configs }) => {
  // Calculate resource metrics from configs
  const metrics = {
    agents: {
      count: configs.agents?.length || 0,
      cpu: configs.agents?.reduce((sum, a) => sum + parseFloat(a.resources?.cpu || 0), 0) || 0,
      memory: configs.agents?.reduce((sum, a) => {
        const mem = parseFloat(a.resources?.memory?.replace(/[^\d.]/g, '') || 0);
        return sum + mem;
      }, 0) || 0
    },
    models: {
      count: configs.gateway?.models?.length || 0
    }
  };

  return (
    <div className="container">
      <div className="content">
        <h2 className="text-2xl font-bold mb-6">Resource Dashboard</h2>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metrics.agents.count}</div>
              <div className="text-sm text-gray-500">
                {metrics.agents.cpu} total vCPUs | {metrics.agents.memory}GB memory
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Models</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{metrics.models.count}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <Gauge value={75} label="Capacity" />
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>CPU Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <BarChart 
                data={configs.agents?.map(a => ({
                  name: a.name || a.id,
                  value: parseFloat(a.resources?.cpu || 0)
                }))} 
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Memory Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                data={configs.agents?.map(a => ({
                  name: a.name || a.id,
                  value: parseFloat(a.resources?.memory?.replace(/[^\d.]/g, '') || 0)
                }))}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Resources;
