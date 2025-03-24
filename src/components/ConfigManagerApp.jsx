import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { PlusCircle, FileDown, Upload, Settings, Trash2, Edit } from 'lucide-react';
import AgentConfigForm from './AgentConfigForm';
import { TaskConfigForm } from './TaskConfigForm';
import GatewayConfigForm from './GatewayConfigForm';

const ConfigManagerApp = ({ 
  configs,
  activeConfigTab,
  onConfigTabChange,
  onSaveAgent,
  onDeleteAgent, 
  onSaveTask, 
  onDeleteTask, 
  onSaveGateway, 
  onSaveSystem,
  onImportConfigs,
  onExportAllConfigs
}) => {
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

  const renderAgentsList = () => {
    if (!configs.agents.length) {
      return (
        <div className="text-center py-8 text-gray-500">
          No agents configured yet
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {configs.agents.map(agent => (
          <Card key={agent.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {agent.name}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingConfig(agent)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDeleteAgent(agent.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Model:</span> {agent.model}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Role:</span> {agent.role}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Goal:</span> {agent.goal}
                </div>
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
            onSave={onSaveAgent} 
            onCancel={() => setEditingConfig(null)}
          />
        </div>
      )}
      
      {editingTask && (
        <div className="mb-8">
          <TaskConfigForm 
            initialData={editingTask} 
            onSave={onSaveTask}
            onCancel={() => setEditingTask(null)}
            availableAgents={configs.agents}
          />
        </div>
      )}
      
      {editingGateway && (
        <div className="mb-8">
          <GatewayConfigForm 
            initialData={configs.gateway} 
            onSave={onSaveGateway}
            onCancel={() => setEditingGateway(false)}
          />
        </div>
      )}

      {/* Secondary Navigation */}
      <div className="border-b mb-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => onConfigTabChange('agents')}
            className={`px-3 py-2 text-sm font-medium ${
              activeConfigTab === 'agents'
                ? 'border-blue-500 text-blue-600 border-b-2'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Agents
          </button>
          <button
            onClick={() => onConfigTabChange('tasks')}
            className={`px-3 py-2 text-sm font-medium ${
              activeConfigTab === 'tasks'
                ? 'border-blue-500 text-blue-600 border-b-2'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Tasks
          </button>
          <button
            onClick={() => onConfigTabChange('gateway')}
            className={`px-3 py-2 text-sm font-medium ${
              activeConfigTab === 'gateway'
                ? 'border-blue-500 text-blue-600 border-b-2'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Gateway
          </button>
          <button
            onClick={() => onConfigTabChange('system')}
            className={`px-3 py-2 text-sm font-medium ${
              activeConfigTab === 'system'
                ? 'border-blue-500 text-blue-600 border-b-2'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            System
          </button>
        </nav>
      </div>

      {/* Config Content */}
      <div className="space-y-8">
        {activeConfigTab === 'agents' && (
          <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Agent Configurations</h2>
            <button 
              onClick={() => setEditingConfig({})}
              className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              <PlusCircle size={16} /> Add Agent
            </button>
          </div>
          {renderAgentsList()}
          </section>
        )}

        {activeConfigTab === 'tasks' && (
          <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Task Scheduler</h2>
            <button 
              onClick={() => setEditingTask({})}
              className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              <PlusCircle size={16} /> Add Task
            </button>
          </div>
          {/* Render Task Scheduler Here */}
          </section>
        )}

        {activeConfigTab === 'gateway' && (
          <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Gateway Configuration</h2>
            <button 
              onClick={() => setEditingGateway(true)}
              className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              <Settings size={16} /> Edit Gateway Config
            </button>
          </div>
          {/* Render Gateway Config Here */}
        </section>

        {/* System Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">System Configuration</h2>
            <button 
              onClick={() => onSaveSystem(configs.system)}
              className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              <Settings size={16} /> Save Settings
            </button>
          </div>
          {/* Render System Config Here */}
          </section>
        )}
      </div>
    </div>
  );
};

export default ConfigManagerApp;
