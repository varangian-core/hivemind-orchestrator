import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { PlusCircle, Upload, Settings, Download } from 'lucide-react';
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
  const [activeGuidanceTab, setActiveGuidanceTab] = useState('configurations');

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
  
  // Trigger file input click
  const triggerFileInput = () => {
    document.getElementById('config-import').click();
  };

  return (
    <div className="main-content">
        {/* Show forms when editing */}
        {editingConfig && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <AgentConfigForm
                initialData={editingConfig}
                onSave={onSaveAgent}
                onCancel={() => setEditingConfig(null)}
              />
            </div>
          </div>
        )}

        {editingTask && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <TaskConfigForm
                initialData={editingTask}
                onSave={onSaveTask}
                onCancel={() => setEditingTask(null)}
                availableAgents={configs.agents}
              />
            </div>
          </div>
        )}

        {editingGateway && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <GatewayConfigForm
                initialData={configs.gateway}
                onSave={onSaveGateway}
                onCancel={() => setEditingGateway(false)}
              />
            </div>
          </div>
        )}

        {/* Secondary Navigation */}
        <nav className="secondary-nav">
          <div className="container" style={{ display: 'flex' }}>
            <div 
              className={`nav-item ${activeConfigTab === 'agents' ? 'active' : ''}`}
              onClick={() => onConfigTabChange('agents')}
            >
              Agents
            </div>
            <div 
              className={`nav-item ${activeConfigTab === 'tasks' ? 'active' : ''}`}
              onClick={() => onConfigTabChange('tasks')}
            >
              Tasks
            </div>
            <div 
              className={`nav-item ${activeConfigTab === 'gateway' ? 'active' : ''}`}
              onClick={() => onConfigTabChange('gateway')}
            >
              Gateway
            </div>
            <div 
              className={`nav-item ${activeConfigTab === 'system' ? 'active' : ''}`}
              onClick={() => onConfigTabChange('system')}
            >
              System
            </div>
          </div>
        </nav>

        <div className="container">
          {/* Breadcrumb navigation */}
          <div className="breadcrumb">
            <span className="cursor-pointer text-primary">Config</span> &gt; <span>{activeConfigTab.charAt(0).toUpperCase() + activeConfigTab.slice(1)}</span>
          </div>
          
          {/* Page title and actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>{activeConfigTab.charAt(0).toUpperCase() + activeConfigTab.slice(1)} Configuration</h2>
            <div className="header-actions">
              <button className="btn btn-secondary" onClick={triggerFileInput}>
                <Upload size={16} className="mr-2" /> Import
              </button>
              <button className="btn btn-secondary" onClick={onExportAllConfigs}>
                <Download size={16} className="mr-2" /> Export
              </button>
            </div>
          </div>
          
          {/* Tertiary Navigation */}
          <nav className="tertiary-nav">
            <div 
              className={`nav-item ${activeGuidanceTab === 'configurations' ? 'active' : ''}`}
              onClick={() => setActiveGuidanceTab('configurations')}
            >
              Configurations
            </div>
            <div 
              className={`nav-item ${activeGuidanceTab === 'guidance' ? 'active' : ''}`}
              onClick={() => setActiveGuidanceTab('guidance')}
            >
              Guidance
            </div>
            <div 
              className={`nav-item ${activeGuidanceTab === 'templates' ? 'active' : ''}`}
              onClick={() => setActiveGuidanceTab('templates')}
            >
              Templates
            </div>
            <div 
              className={`nav-item ${activeGuidanceTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveGuidanceTab('history')}
            >
              History
            </div>
          </nav>
          {/* Content based on active tabs */}
          {activeGuidanceTab === 'configurations' && (
            <div className="content">
              {activeConfigTab === 'agents' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3>Agent Configurations</h3>
                    <button
                      className="btn btn-primary"
                      onClick={() => setEditingConfig({})}
                    >
                      <PlusCircle size={16} className="mr-2" /> Add Agent
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {configs.agents && configs.agents.map((agent) => (
                      <Card key={agent.id} className="cursor-pointer hover-shadow-md">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">{agent.displayName || agent.id}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-2">{agent.description || 'No description'}</p>
                          <div className="flex justify-end">
                            <button 
                              className="btn btn-secondary"
                              onClick={() => setEditingConfig(agent)}
                            >
                              Edit
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
              
              {activeConfigTab === 'tasks' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3>Task Scheduler</h3>
                    <button
                      className="btn btn-primary"
                      onClick={() => setEditingTask({})}
                    >
                      <PlusCircle size={16} className="mr-2" /> Add Task
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {configs.tasks && configs.tasks.map((task) => (
                      <Card key={task.id} className="cursor-pointer hover-shadow-md">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-md">{task.displayName || task.id}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-2">{task.description || 'No description'}</p>
                          <div className="flex justify-end">
                            <button 
                              className="btn btn-secondary"
                              onClick={() => setEditingTask(task)}
                            >
                              Edit
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}
              
              {activeConfigTab === 'gateway' && (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3>Gateway Configuration</h3>
                    <button
                      className="btn btn-primary"
                      onClick={() => setEditingGateway(true)}
                    >
                      <Settings size={16} className="mr-2" /> Edit Gateway Config
                    </button>
                  </div>
                  
                  <div className="form-group">
                    <label>Gateway URL</label>
                    <div className="form-control bg-gray-50">{configs.gateway?.url || 'Not configured'}</div>
                  </div>
                  
                  <div className="form-group">
                    <label>API Key</label>
                    <div className="form-control bg-gray-50">••••••••••••••••</div>
                  </div>
                </>
              )}
            </div>
          )}
          
          {activeGuidanceTab === 'guidance' && (
            <div className="content">
              <h3 className="text-lg font-medium mb-4">Configuration Guidance</h3>
              <p className="mb-4">
                This section provides guidance on how to configure your {activeConfigTab}.
                Follow the instructions below to set up your system correctly.
              </p>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '20px' }}>
                <li>Make sure to provide all required fields</li>
                <li>Use descriptive names for better organization</li>
                <li>Test your configuration before deploying to production</li>
                <li>Refer to documentation for advanced settings</li>
              </ul>
            </div>
          )}
          
          {activeGuidanceTab === 'templates' && (
            <div className="content">
              <h3 className="text-lg font-medium mb-4">Configuration Templates</h3>
              <p className="mb-4">
                Use these pre-defined templates to quickly set up common configurations.
                Select a template below to get started.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <Card className="cursor-pointer hover-shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Basic Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">A simple starting point with essential settings</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover-shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-md">Advanced Configuration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">Comprehensive setup with all available options</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {activeGuidanceTab === 'history' && (
            <div className="content">
              <h3 className="text-lg font-medium mb-4">Configuration History</h3>
              <p className="mb-4">
                View and restore previous configurations. Recent changes are listed below.
              </p>
              <div className="border rounded-md divide-y">
                {[1, 2, 3].map((item) => (
                  <div key={`history-item-${item}`} className="p-3 flex justify-between items-center hover-bg-gray-100">
                    <div>
                      <p className="font-medium">Configuration update #{item}</p>
                      <p className="text-sm text-gray-500">Modified on {new Date().toLocaleDateString()}</p>
                    </div>
                    <button className="btn btn-secondary">Restore</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* File import hidden input */}
          <input 
            type="file" 
            className="hidden" 
            id="config-import" 
            onChange={handleConfigImport} 
            accept=".json" 
          />
        </div>
    </div>
  );
};

export default ConfigManagerApp;
