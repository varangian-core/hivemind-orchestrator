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

  return (
      <div className="container mx-auto p-6 grid grid-rows-main gap-6">
        {/* Top Navigation */}
        <div className="sticky top-0 h-16 border-b bg-white z-10">
          <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Configuration Manager</h1>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                <Upload size={16} className="w-4 h-4" />
                <span>Import</span>
                <input type="file" className="hidden" onChange={handleConfigImport} accept=".json" />
              </label>
              <span className="text-gray-300">|</span>
              <button
                  onClick={onExportAllConfigs}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <FileDown size={16} className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
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
        <div className="sticky top-16 h-12 border-b bg-white z-10">
          <div className="h-full max-w-7xl mx-auto px-6 flex items-center">
            <nav className="flex space-x-6">
              <button
                  onClick={() => onConfigTabChange('agents')}
                  className={`h-full flex items-center border-b-2 text-sm font-medium ${
                      activeConfigTab === 'agents'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Agents
              </button>
              <button
                  onClick={() => onConfigTabChange('tasks')}
                  className={`h-full flex items-center border-b-2 text-sm font-medium ${
                      activeConfigTab === 'tasks'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
              </section>
          )}
        </div>
      </div>
  );
};

export default ConfigManagerApp;
