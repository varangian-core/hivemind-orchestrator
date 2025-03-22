import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import ConfigManagerApp from './components/ConfigManagerApp';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [configs, setConfigs] = useState({
    agents: [],
    scheduler: {
      id: 'main_scheduler',
      type: 'cron',
      resources: {
        memory: '512M',
        cpu: '0.25',
        maxWorkers: 10
      },
      tasks: []
    },
    gateway: {
      models: [],
      api: {
        port: 8080,
        rateLimit: {
          requestsPerMinute: 100,
          burstSize: 10
        },
        cors: {
          allowedOrigins: ["http://localhost:3000"],
          allowCredentials: true
        },
        security: {
          apiKeyHeader: "X-API-Key"
        }
      },
      resources: {
        memory: "1G",
        cpu: "0.5"
      }
    },
    system: {
      orchestrator: {
        id: "main_orchestrator",
        api: {
          port: 8000,
          host: "0.0.0.0"
        },
        docker: {
          registry: "registry.example.com",
          baseImage: "agent-base:latest"
        },
        logging: {
          level: "INFO",
          format: "json"
        }
      }
    }
  });

  // Fetch configurations from API on load
  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        setIsLoading(true);
        
        // Fetch agents
        const agentsResponse = await fetch(`${API_BASE_URL}/api/config/agents`);
        if (agentsResponse.ok) {
          const agentsData = await agentsResponse.json();
          setConfigs(prev => ({ ...prev, agents: agentsData }));
        }
        
        // Fetch scheduler config
        const schedulerResponse = await fetch(`${API_BASE_URL}/api/config/scheduler`);
        if (schedulerResponse.ok) {
          const schedulerData = await schedulerResponse.json();
          setConfigs(prev => ({ ...prev, scheduler: schedulerData }));
        }
        
        // Fetch gateway config
        const gatewayResponse = await fetch(`${API_BASE_URL}/api/config/gateway`);
        if (gatewayResponse.ok) {
          const gatewayData = await gatewayResponse.json();
          setConfigs(prev => ({ ...prev, gateway: gatewayData }));
        }
        
        // Fetch system config
        const systemResponse = await fetch(`${API_BASE_URL}/api/config/system`);
        if (systemResponse.ok) {
          const systemData = await systemResponse.json();
          setConfigs(prev => ({ ...prev, system: systemData }));
        }
        
      } catch (error) {
        console.error('Error fetching configurations:', error);
        toast.error('Failed to load configurations. Using default templates.');
        
        // If API fetch fails, load from localStorage as fallback
        const savedConfigs = localStorage.getItem('agentOrchestratorConfigs');
        if (savedConfigs) {
          try {
            setConfigs(JSON.parse(savedConfigs));
          } catch (parseError) {
            console.error('Failed to parse saved configs:', parseError);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchConfigs();
  }, []);
  
  // Save configs to localStorage when they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('agentOrchestratorConfigs', JSON.stringify(configs));
    }
  }, [configs, isLoading]);
  
  // Save agent configuration
  const saveAgentConfig = async (agentConfig) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/config/agents/${agentConfig.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(agentConfig)
      });
      
      if (response.ok) {
        setConfigs(prev => ({
          ...prev,
          agents: prev.agents.some(a => a.id === agentConfig.id)
            ? prev.agents.map(a => a.id === agentConfig.id ? agentConfig : a)
            : [...prev.agents, agentConfig]
        }));
        toast.success(`Agent "${agentConfig.name}" saved successfully`);
        return true;
      } else {
        const errorData = await response.json();
        toast.error(`Failed to save agent: ${errorData.detail || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      console.error('Error saving agent config:', error);
      toast.error('Failed to save agent. Check console for details.');
      return false;
    }
  };
  
  // Delete agent configuration
  const deleteAgentConfig = async (agentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/config/agents/${agentId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setConfigs(prev => ({
          ...prev,
          agents: prev.agents.filter(a => a.id !== agentId)
        }));
        toast.success('Agent deleted successfully');
        return true;
      } else {
        const errorData = await response.json();
        toast.error(`Failed to delete agent: ${errorData.detail || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      console.error('Error deleting agent config:', error);
      toast.error('Failed to delete agent. Check console for details.');
      return false;
    }
  };
  
  // Save task configuration
  const saveTaskConfig = async (taskConfig) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/config/scheduler/tasks/${taskConfig.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskConfig)
      });
      
      if (response.ok) {
        setConfigs(prev => {
          const existingTaskIndex = prev.scheduler.tasks.findIndex(t => t.id === taskConfig.id);
          const updatedTasks = existingTaskIndex >= 0
            ? prev.scheduler.tasks.map((task, index) => index === existingTaskIndex ? taskConfig : task)
            : [...prev.scheduler.tasks, taskConfig];
            
          return {
            ...prev,
            scheduler: {
              ...prev.scheduler,
              tasks: updatedTasks
            }
          };
        });
        toast.success(`Task "${taskConfig.name}" saved successfully`);
        return true;
      } else {
        const errorData = await response.json();
        toast.error(`Failed to save task: ${errorData.detail || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      console.error('Error saving task config:', error);
      toast.error('Failed to save task. Check console for details.');
      return false;
    }
  };
  
  // Delete task configuration
  const deleteTaskConfig = async (taskId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/config/scheduler/tasks/${taskId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setConfigs(prev => ({
          ...prev,
          scheduler: {
            ...prev.scheduler,
            tasks: prev.scheduler.tasks.filter(t => t.id !== taskId)
          }
        }));
        toast.success('Task deleted successfully');
        return true;
      } else {
        const errorData = await response.json();
        toast.error(`Failed to delete task: ${errorData.detail || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      console.error('Error deleting task config:', error);
      toast.error('Failed to delete task. Check console for details.');
      return false;
    }
  };
  
  // Save gateway configuration
  const saveGatewayConfig = async (gatewayConfig) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/config/gateway`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gatewayConfig)
      });
      
      if (response.ok) {
        setConfigs(prev => ({
          ...prev,
          gateway: gatewayConfig
        }));
        toast.success('Gateway configuration saved successfully');
        return true;
      } else {
        const errorData = await response.json();
        toast.error(`Failed to save gateway config: ${errorData.detail || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      console.error('Error saving gateway config:', error);
      toast.error('Failed to save gateway configuration. Check console for details.');
      return false;
    }
  };
  
  // Save system configuration
  const saveSystemConfig = async (systemConfig) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/config/system`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(systemConfig)
      });
      
      if (response.ok) {
        setConfigs(prev => ({
          ...prev,
          system: systemConfig
        }));
        toast.success('System configuration saved successfully');
        return true;
      } else {
        const errorData = await response.json();
        toast.error(`Failed to save system config: ${errorData.detail || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      console.error('Error saving system config:', error);
      toast.error('Failed to save system configuration. Check console for details.');
      return false;
    }
  };
  
  // Import configurations from file
  const importConfigs = async (importedConfigs) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/config/import`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(importedConfigs)
      });
      
      if (response.ok) {
        // Refresh configurations after import
        const updatedConfigs = await response.json();
        setConfigs(updatedConfigs);
        toast.success('Configurations imported successfully');
        return true;
      } else {
        const errorData = await response.json();
        toast.error(`Failed to import configurations: ${errorData.detail || 'Unknown error'}`);
        return false;
      }
    } catch (error) {
      console.error('Error importing configurations:', error);
      toast.error('Failed to import configurations. Check console for details.');
      
      // If API call fails, still update local state
      setConfigs(prev => ({
        ...prev,
        ...importedConfigs
      }));
      toast.success('Configurations imported locally (API unreachable)');
      return true;
    }
  };
  
  // Export all configurations
  const exportAllConfigs = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/config/export`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'agent-orchestrator-configs.zip';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        return true;
      } else {
        // Fallback to browser-based JSON export
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(configs, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "agent-orchestrator-configs.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        return true;
      }
    } catch (error) {
      console.error('Error exporting configurations:', error);
      
      // Fallback to browser-based JSON export
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(configs, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "agent-orchestrator-configs.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      return true;
    }
  };

  // Main render
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading configurations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ConfigManagerApp 
        configs={configs}
        onSaveAgent={saveAgentConfig}
        onDeleteAgent={deleteAgentConfig}
        onSaveTask={saveTaskConfig}
        onDeleteTask={deleteTaskConfig}
        onSaveGateway={saveGatewayConfig}
        onSaveSystem={saveSystemConfig}
        onImportConfigs={importConfigs}
        onExportAllConfigs={exportAllConfigs}
      />
      <Toaster position="top-right" />
    </div>
  );
};

export default App;