import React, { useState } from 'react';
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

      {/* Config Content */}
      <div className="space-y-8">
        {/* Agents Section */}
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

        {/* Scheduler Section */}
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

        {/* Gateway Section */}
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
      </div>
    </div>
  );
};

export default ConfigManagerApp;
