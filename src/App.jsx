import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import ConfigManagerApp from './components/ConfigManagerApp';
import Resources from './components/Resources';

// eslint-disable-next-line no-unused-vars
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('config');
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
    <div className="app-container">
      {/* Sidebar with Primary Navigation */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="inline-block mr-2"
              style={{ width: '24px', height: '24px' }}
            >
              <rect x="3" y="11" width="18" height="10" rx="2" />
              <circle cx="12" cy="5" r="2" />
              <path d="M12 7v4" />
              <line x1="8" y1="16" x2="8" y2="16" />
              <line x1="16" y1="16" x2="16" y2="16" />
            </svg>
            Hivemind Orchestrator
          </h2>
        </div>
        <nav className="sidebar-nav">
          <div 
            className={`nav-item ${activeSection === 'config' ? 'active' : ''}`}
            onClick={() => setActiveSection('config')}
          >
            <span className="flex items-center">
              <Settings size={16} className="mr-2" />
              Config
            </span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveSection('resources')}
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              Resources
            </span>
          </div>
          <div 
            className={`nav-item ${activeSection === 'monitoring' ? 'active' : ''}`}
            onClick={() => setActiveSection('monitoring')}
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
              Monitoring
            </span>
          </div>
        </nav>
      </div>
      
      {/* Main Content Area */}
      <div className="main-content">
        {activeSection === 'config' ? (
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
        ) : activeSection === 'resources' ? (
          <Resources configs={configs} />
        ) : (
          <div className="container">
            <div className="content">
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold mb-4">
                  Monitoring Coming Soon
                </h2>
                <p className="text-gray-600 mb-6">
                  We're working hard to bring you this feature. Stay tuned!
                </p>
                <div className="flex justify-center">
                  <button 
                    className="btn btn-primary"
                    onClick={() => setActiveSection('config')}
                  >
                    Back to Config
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        <Toaster position="top-right" />
      </div>
    </div>
  );
};

export default App;
