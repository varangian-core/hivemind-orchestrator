import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Gauge, BarChart, LineChart } from './ui/charts';
import { Button } from './ui/button.jsx';
import { Play, StopCircle, Settings, RefreshCw } from 'lucide-react';

const Resources = ({ configs }) => {
  const [resources, setResources] = useState([
    ...(configs.agents?.map(agent => ({
      id: agent.id,
      name: agent.name || agent.id,
      type: 'agent',
      status: 'running', // Mock status
      cpu: agent.resources?.cpu || '0.5',
      memory: agent.resources?.memory || '1G',
      lastActive: new Date().toISOString()
    })) || []),
    ...(configs.gateway?.models?.map(model => ({
      id: model.id,
      name: model.name || model.id,
      type: 'model',
      status: 'available',
      provider: model.provider,
      lastUsed: new Date().toISOString()
    })) || [])
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshResources = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const toggleResourceStatus = (id) => {
    setResources(resources.map(resource => {
      if (resource.id === id) {
        return {
          ...resource,
          status: resource.status === 'running' ? 'stopped' : 'running'
        };
      }
      return resource;
    }));
  };

  return (
    <div className="container">
      <div className="content">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Resource Management</h2>
          <Button 
            variant="outline" 
            onClick={refreshResources}
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {resources.filter(r => r.type === 'agent').length}
              </div>
              <div className="text-sm text-gray-500">
                {resources.filter(r => r.type === 'agent' && r.status === 'running').length} active
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">Models</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {resources.filter(r => r.type === 'model').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-md">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <Gauge 
                value={
                  (resources.filter(r => r.status === 'running').length / 
                   resources.length) * 100 || 0
                } 
                label="Availability" 
              />
            </CardContent>
          </Card>
        </div>

        {/* Resources Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resources</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resources.map((resource) => (
                    <tr key={resource.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{resource.name}</div>
                        <div className="text-sm text-gray-500">{resource.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {resource.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          resource.status === 'running' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {resource.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {resource.cpu && `${resource.cpu} CPU`}
                        {resource.memory && `, ${resource.memory} RAM`}
                        {resource.provider && `(${resource.provider})`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(resource.lastActive || resource.lastUsed).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleResourceStatus(resource.id)}
                            disabled={resource.type === 'model'}
                          >
                            {resource.status === 'running' ? (
                              <>
                                <StopCircle className="mr-2 h-4 w-4" />
                                Stop
                              </>
                            ) : (
                              <>
                                <Play className="mr-2 h-4 w-4" />
                                Start
                              </>
                            )}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Settings className="mr-2 h-4 w-4" />
                            Config
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Resource Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">CPU Allocation</h3>
                  <BarChart 
                    data={resources
                      .filter(r => r.cpu)
                      .map(r => ({
                        name: r.name,
                        value: parseFloat(r.cpu)
                      }))} 
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Memory Usage</h3>
                  <LineChart
                    data={resources
                      .filter(r => r.memory)
                      .map(r => ({
                        name: r.name,
                        value: parseFloat(r.memory.replace(/[^\d.]/g, ''))
                      }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Resources;
