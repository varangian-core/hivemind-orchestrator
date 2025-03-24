import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import ConfigManagerApp from './components/ConfigManagerApp';

// eslint-disable-next-line no-unused-vars
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeConfigTab, setActiveConfigTab] = useState('agents');
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
        
        // Check for localStorage data first
        const savedConfigs = localStorage.getItem('agentOrchestratorConfigs');
        if (savedConfigs) {
          try {
            setConfigs(JSON.parse(savedConfigs));
            return; // Use saved configs if available
          } catch (parseError) {
            console.error('Failed to parse saved configs:', parseError);
          }
        }

        // For demo purposes, let's create some sample mock data
        const mockConfigs = {
          agents: [
            {
              id: "customer_support",
              name: "Customer Support Agent",
              model: "anthropic/claude-3-opus",
              role: "Customer Support Specialist",
              goal: "Help customers resolve product issues efficiently",
              instructions: "You are a helpful customer support agent. Always be polite and empathetic.",
              tools: [
                { id: "knowledge_base", type: "database", description: "Access to product documentation" }
              ],
              functions: [
                { id: "escalate_ticket", description: "Escalate ticket to human support" }
              ],
              resources: {
                memory: "1G",
                cpu: "0.5"
              }
            },
            {
              id: "data_analyst",
              name: "Data Analysis Agent",
              model: "openai/gpt-4",
              role: "Data Analyst",
              goal: "Analyze data and provide actionable insights",
              instructions: "Analyze data sets and create clear visualizations and reports.",
              tools: [
                { id: "sql_database", type: "database", description: "Connect to data warehouse" },
                { id: "chart_generator", type: "api", description: "Generate charts and graphs" }
              ],
              resources: {
                memory: "2G",
                cpu: "1.0"
              }
            }
          ],
          scheduler: {
            id: 'main_scheduler',
            type: 'cron',
            resources: {
              memory: '512M',
              cpu: '0.25',
              maxWorkers: 10
            },
            tasks: [
              {
                id: "daily_report",
                name: "Daily Analytics Report",
                agentId: "data_analyst",
                schedule: {
                  type: "cron",
                  expression: "0 9 * * *"
                },
                timeout: "10m",
                retries: 2,
                output: {
                  eventName: "report_generated"
                }
              },
              {
                id: "ticket_followup",
                name: "Support Ticket Follow-up",
                agentId: "customer_support",
                schedule: {
                  type: "event",
                  event: "ticket.resolved"
                },
                timeout: "5m",
                dependencies: []
              }
            ]
          },
          gateway: {
            models: [
              {
                id: "anthropic/claude-3-opus",
                name: "Claude 3 Opus",
                provider: "anthropic",
                endpoint: "https://api.anthropic.com/v1/messages",
                apiKey: "ENV_ANTHROPIC_API_KEY",
                contextWindow: 100000,
                capabilities: ["text", "multimodal", "function_calling"],
                parameters: {
                  temperature: 0.7,
                  maxTokens: 4000
                }
              },
              {
                id: "openai/gpt-4",
                name: "GPT-4",
                provider: "openai",
                endpoint: "https://api.openai.com/v1/chat/completions",
                apiKey: "ENV_OPENAI_API_KEY",
                contextWindow: 8192,
                capabilities: ["text", "multimodal", "function_calling", "tools"],
                parameters: {
                  temperature: 0.7,
                  maxTokens: 2000
                }
              }
            ],
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
        };
        
        setConfigs(mockConfigs);
        toast.success('Using demo data for display purposes');
        
      } catch (error) {
        console.error('Error setting up configurations:', error);
        toast.error('Failed to set up configurations. Using default templates.');
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
  
  // Save agent configuration (mock implementation)
  const saveAgentConfig = async (agentConfig) => {
    try {
      // Just update the local state directly
      setConfigs(prev => ({
        ...prev,
        agents: prev.agents.some(a => a.id === agentConfig.id)
          ? prev.agents.map(a => a.id === agentConfig.id ? agentConfig : a)
          : [...prev.agents, agentConfig]
      }));
      toast.success(`Agent "${agentConfig.name}" saved successfully`);
      return true;
    } catch (error) {
      console.error('Error saving agent config:', error);
      toast.error('Failed to save agent. Check console for details.');
      return false;
    }
  };
  
  // Delete agent configuration (mock implementation)
  const deleteAgentConfig = async (agentId) => {
    try {
      // Just update the local state directly
      setConfigs(prev => ({
        ...prev,
        agents: prev.agents.filter(a => a.id !== agentId)
      }));
      toast.success('Agent deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting agent config:', error);
      toast.error('Failed to delete agent. Check console for details.');
      return false;
    }
  };
  
  // Save task configuration (mock implementation)
  const saveTaskConfig = async (taskConfig) => {
    try {
      // Just update the local state directly
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
    } catch (error) {
      console.error('Error saving task config:', error);
      toast.error('Failed to save task. Check console for details.');
      return false;
    }
  };
  
  // Delete task configuration (mock implementation)
  const deleteTaskConfig = async (taskId) => {
    try {
      // Just update the local state directly
      setConfigs(prev => ({
        ...prev,
        scheduler: {
          ...prev.scheduler,
          tasks: prev.scheduler.tasks.filter(t => t.id !== taskId)
        }
      }));
      toast.success('Task deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting task config:', error);
      toast.error('Failed to delete task. Check console for details.');
      return false;
    }
  };
  
  // Save gateway configuration (mock implementation)
  const saveGatewayConfig = async (gatewayConfig) => {
    try {
      // Just update the local state directly
      setConfigs(prev => ({
        ...prev,
        gateway: gatewayConfig
      }));
      toast.success('Gateway configuration saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving gateway config:', error);
      toast.error('Failed to save gateway configuration. Check console for details.');
      return false;
    }
  };
  
  // Save system configuration (mock implementation)
  const saveSystemConfig = async (systemConfig) => {
    try {
      // Just update the local state directly
      setConfigs(prev => ({
        ...prev,
        system: systemConfig
      }));
      toast.success('System configuration saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving system config:', error);
      toast.error('Failed to save system configuration. Check console for details.');
      return false;
    }
  };
  
  // Import configurations from file (mock implementation)
  const importConfigs = async (importedConfigs) => {
    try {
      // Just update the local state directly
      setConfigs(prev => ({
        ...prev,
        ...importedConfigs
      }));
      toast.success('Configurations imported successfully');
      return true;
    } catch (error) {
      console.error('Error importing configurations:', error);
      toast.error('Failed to import configurations. Check console for details.');
      return false;
    }
  };
  
  // Export all configurations (mock implementation)
  const exportAllConfigs = async () => {
    try {
      // Just do the browser-based JSON export
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(configs, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", "agent-orchestrator-configs.json");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      toast.success('Configuration exported as JSON');
      return true;
    } catch (error) {
      console.error('Error exporting configurations:', error);
      toast.error('Failed to export configurations. Check console for details.');
      return false;
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
    <div className="min-h-screen bg-gray-50 grid grid-cols-sidebar">
      {/* Left Navigation */}
      <nav className="bg-white border-r border-gray-200">
        <div className="h-16 border-b flex items-center px-6">
          <h2 className="text-lg font-semibold">Orchestrator</h2>
        </div>
        <div className="p-4 space-y-1">
          <button 
            className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
          >
            Configs
          </button>
          <button 
            className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-500 hover:bg-gray-100"
          >
            Resources
          </button>
          <button 
            className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-500 hover:bg-gray-100"
          >
            Monitoring
          </button>
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="grid grid-rows-[auto,1fr]">
        <ConfigManagerApp 
        configs={configs}
        activeConfigTab={activeConfigTab}
        onConfigTabChange={setActiveConfigTab}
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
    </div>
  );
};

export default App;
