import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { PlusCircle, FileDown, Upload, Settings, Trash2, Edit } from 'lucide-react';
import AgentConfigForm from './AgentConfigForm';
import { TaskConfigForm } from './TaskConfigForm';
import GatewayConfigForm from './GatewayConfigForm';

const ConfigManagerApp = ({ 
  configs, 
  onSaveAgent, 
  onDeleteAgent, 
  onSaveTask, 
  onDeleteTask, 
  onSaveGateway, 
  onSaveSystem,
  onImportConfigs,
  onExportAllConfigs
}) => {
  const [activeTab, setActiveTab] = useState('agents');
  const [editingConfig, setEditingConfig] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editingGateway, setEditingGateway] = useState(false);
  
  // Handle file import
  const handleConfigImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          onImportConfigs(imported);
        } catch (error) {
          console.error("Failed to parse JSON", error);
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  // Save agent configuration
  const handleSaveAgent = async (agentConfig) => {
    const success = await onSaveAgent(agentConfig);
    if (success) {
      setEditingConfig(null);
    }
  };
  
  // Save task configuration
  const handleSaveTask = async (taskConfig) => {
    const success = await onSaveTask(taskConfig);
    if (success) {
      setEditingTask(null);
    }
  };

  // Save gateway configuration
  const handleSaveGateway = async (gatewayConfig) => {
    const success = await onSaveGateway(gatewayConfig);
    if (success) {
      setEditingGateway(false);
    }
  };

  // Save system configuration
  const handleSaveSystem = async () => {
    await onSaveSystem(configs.system);
  };
  
  // Render agent configurations list
  const renderAgentsList = () => {
    if (!configs.agents || configs.agents.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No agents configured yet. Click "Add Agent" to create one.
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {configs.agents.map(agent => (
          <Card key={agent.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50 flex flex-row items-center justify-between p-4">
              <CardTitle className="text-md truncate">{agent.name}</CardTitle>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setEditingConfig(agent);
                  }}
                  className="text-gray-500 hover:text-blue-600"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => onDeleteAgent(agent.id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500 mb-1">ID: {agent.id}</div>
              <div className="text-sm mb-2">Role: <span className="font-medium">{agent.role}</span></div>
              <div className="text-sm mb-3">Model: <span className="font-medium">{agent.model}</span></div>
              <div className="text-sm mb-2">Goal:</div>
              <div className="text-sm text-gray-700 mb-2 line-clamp-2">{agent.goal}</div>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {agent.tools && agent.tools.map(tool => (
                  <span key={tool.id} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                    {tool.id}
                  </span>
                ))}
                {agent.functions && agent.functions.map(func => (
                  <span key={func.id} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                    {func.id}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  // Render task configurations list
  const renderTasksList = () => {
    if (!configs.scheduler.tasks || configs.scheduler.tasks.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No tasks configured yet. Click "Add Task" to create one.
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {configs.scheduler.tasks.map(task => (
          <Card key={task.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50 flex flex-row items-center justify-between p-4">
              <CardTitle className="text-md truncate">{task.name}</CardTitle>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setEditingTask(task);
                  }}
                  className="text-gray-500 hover:text-blue-600"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => onDeleteTask(task.id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500 mb-1">ID: {task.id}</div>
              <div className="text-sm mb-2">Agent: <span className="font-medium">{task.agentId}</span></div>
              
              <div className="text-sm mb-2">Schedule: 
                <span className="font-medium ml-1">
                  {task.schedule?.type === 'cron' && `Cron (${task.schedule.expression})`}
                  {task.schedule?.type === 'interval' && `Every ${task.schedule.interval}`}
                  {task.schedule?.type === 'event' && `On event "${task.schedule.event}"`}
                </span>
              </div>
              
              {task.schedule?.type === 'event' && task.dependencies && task.dependencies.length > 0 && (
                <div className="text-sm mb-2">Dependencies: 
                  <span className="font-medium ml-1">{task.dependencies.join(', ')}</span>
                </div>
              )}
              
              <div className="text-sm mb-2">Timeout: <span className="font-medium">{task.timeout}</span></div>
              
              {task.output?.eventName && (
                <div className="text-sm mb-2">Emits: 
                  <span className="font-medium ml-1">{task.output.eventName}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  // Render models list
  const renderModelsList = () => {
    if (!configs.gateway.models || configs.gateway.models.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No models configured yet. Use the Gateway Config form to add models.
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {configs.gateway.models.map((model, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="bg-gray-50 flex flex-row items-center justify-between p-4">
              <CardTitle className="text-md truncate">{model.name}</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500 mb-1">ID: {model.id}</div>
              <div className="text-sm mb-2">Provider: <span className="font-medium">{model.provider}</span></div>
              <div className="text-sm mb-2">Context Window: <span className="font-medium">{model.contextWindow}</span></div>
              
              <div className="mt-2 flex flex-wrap gap-2">
                {model.capabilities && model.capabilities.map((capability, i) => (
                  <span key={i} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                    {capability}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Configuration Manager</h1>
        <div className="flex gap-2">
          <label className="cursor-pointer flex items-center gap-2 bg-gray-100 hover:bg-gray-200 py-2 px-3 rounded-md">
            <Upload size={16} /> Import
            <input type="file" className="hidden" onChange={handleConfigImport} accept=".json" />
          </label>
          <button 
            onClick={onExportAllConfigs}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 py-2 px-3 rounded-md"
          >
            <FileDown size={16} /> Export All
          </button>
        </div>
      </div>

      {/* Show forms when editing */}
      {editingConfig && (
        <div className="mb-8">
          <AgentConfigForm 
            initialData={editingConfig} 
            onSave={handleSaveAgent} 
            onCancel={() => {
              setEditingConfig(null);
            }}
          />
        </div>
      )}
      
      {editingTask && (
        <div className="mb-8">
          <TaskConfigForm 
            initialData={editingTask} 
            onSave={handleSaveTask}
            onCancel={() => {
              setEditingTask(null);
            }}
            availableAgents={configs.agents}
          />
        </div>
      )}
      
      {editingGateway && (
        <div className="mb-8">
          <GatewayConfigForm 
            initialData={configs.gateway} 
            onSave={handleSaveGateway}
            onCancel={() => setEditingGateway(false)}
          />
        </div>
      )}

      {/* Config Content */}
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Agent Configurations</h2>
          <button 
            onClick={() => {
              setEditingConfig({});
            }}
            className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            <PlusCircle size={16} /> Add Agent
          </button>
        </div>
        
        {renderAgentsList()}
          </TabsContent>
          
          <TabsContent value="scheduler" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Task Scheduler</h2>
              <button 
                onClick={() => {
                  setEditingTask({});
                }}
                className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                <PlusCircle size={16} /> Add Task
              </button>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Scheduler Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Scheduler Type</label>
                    <select 
                      className="w-full p-2 border rounded-md"
                      value={configs.scheduler.type || 'cron'}
                      onChange={(e) => onSaveSystem({
                        ...configs.system,
                        scheduler: {
                          ...configs.scheduler,
                          type: e.target.value
                        }
                      })}
                    >
                      <option value="cron">Cron</option>
                      <option value="event_driven">Event Driven</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Memory</label>
                    <input 
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={configs.scheduler.resources?.memory || '512M'}
                      onChange={(e) => onSaveSystem({
                        ...configs.system,
                        scheduler: {
                          ...configs.scheduler,
                          resources: {
                            ...configs.scheduler.resources,
                            memory: e.target.value
                          }
                        }
                      })}
                      placeholder="512M"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Workers</label>
                    <input 
                      type="number"
                      className="w-full p-2 border rounded-md"
                      value={configs.scheduler.resources?.maxWorkers || 10}
                      onChange={(e) => onSaveSystem({
                        ...configs.system,
                        scheduler: {
                          ...configs.scheduler,
                          resources: {
                            ...configs.scheduler.resources,
                            maxWorkers: parseInt(e.target.value)
                          }
                        }
                      })}
                      placeholder="10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Configured Tasks</h3>
              {renderTasksList()}
            </div>
          </TabsContent>
          
          <TabsContent value="gateway" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Gateway Configuration</h2>
              <button 
                onClick={() => setEditingGateway(true)}
                className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                <Settings size={16} /> Edit Gateway Config
              </button>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">API Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Port</label>
                    <div className="p-2 bg-gray-100 rounded-md">
                      {configs.gateway.api?.port || 8080}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">API Key Header</label>
                    <div className="p-2 bg-gray-100 rounded-md">
                      {configs.gateway.api?.security?.apiKeyHeader || 'X-API-Key'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Configured Models</h3>
              {renderModelsList()}
            </div>
          </TabsContent>
          
          <TabsContent value="system" className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">System Configuration</h2>
              <button 
                onClick={handleSaveSystem}
                className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                <Settings size={16} /> Save Settings
              </button>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Orchestrator Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">API Port</label>
                    <input 
                      type="number"
                      className="w-full p-2 border rounded-md"
                      value={configs.system?.orchestrator?.api?.port || 8000}
                      onChange={(e) => onSaveSystem({
                        ...configs.system,
                        orchestrator: {
                          ...configs.system?.orchestrator,
                          api: {
                            ...configs.system?.orchestrator?.api,
                            port: parseInt(e.target.value)
                          }
                        }
                      })}
                      placeholder="8000"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Host</label>
                    <input 
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={configs.system?.orchestrator?.api?.host || '0.0.0.0'}
                      onChange={(e) => onSaveSystem({
                        ...configs.system,
                        orchestrator: {
                          ...configs.system?.orchestrator,
                          api: {
                            ...configs.system?.orchestrator?.api,
                            host: e.target.value
                          }
                        }
                      })}
                      placeholder="0.0.0.0"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Docker Registry</label>
                  <input 
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={configs.system?.orchestrator?.docker?.registry || 'registry.example.com'}
                    onChange={(e) => onSaveSystem({
                      ...configs.system,
                      orchestrator: {
                        ...configs.system?.orchestrator,
                        docker: {
                          ...configs.system?.orchestrator?.docker,
                          registry: e.target.value
                        }
                      }
                    })}
                    placeholder="registry.example.com"
                  />
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Logging Level</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={configs.system?.orchestrator?.logging?.level || 'INFO'}
                    onChange={(e) => onSaveSystem({
                      ...configs.system,
                      orchestrator: {
                        ...configs.system?.orchestrator,
                        logging: {
                          ...configs.system?.orchestrator?.logging,
                          level: e.target.value
                        }
                      }
                    })}
                  >
                    <option value="DEBUG">DEBUG</option>
                    <option value="INFO">INFO</option>
                    <option value="WARNING">WARNING</option>
                    <option value="ERROR">ERROR</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ConfigManagerApp;
