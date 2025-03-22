import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Trash2, Save, FileDown, Code } from 'lucide-react';

const GatewayConfigForm = ({ initialData, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState('models');
  const [config, setConfig] = useState(initialData || {
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
  });
  const [jsonView, setJsonView] = useState(false);

  // Add a new model
  const addModel = () => {
    setConfig(prev => ({
      ...prev,
      models: [
        ...(prev.models || []),
        {
          id: `provider/model-${(prev.models || []).length + 1}`,
          provider: "anthropic",
          name: `New Model ${(prev.models || []).length + 1}`,
          endpoint: "",
          apiKey: "ENV_API_KEY",
          parameters: {
            temperature: 0.7,
            maxTokens: 4000
          },
          capabilities: ["text"]
        }
      ]
    }));
  };

  // Update a model
  const updateModel = (index, field, value) => {
    const updatedModels = [...(config.models || [])];
    updatedModels[index] = {
      ...updatedModels[index],
      [field]: value
    };
    setConfig(prev => ({
      ...prev,
      models: updatedModels
    }));
  };

  // Remove a model
  const removeModel = (index) => {
    const updatedModels = [...(config.models || [])];
    updatedModels.splice(index, 1);
    setConfig(prev => ({
      ...prev,
      models: updatedModels
    }));
  };

  // Update API config
  const updateApiConfig = (field, value) => {
    setConfig(prev => ({
      ...prev,
      api: {
        ...prev.api,
        [field]: value
      }
    }));
  };

  // Update security config
  const updateSecurityConfig = (field, value) => {
    setConfig(prev => ({
      ...prev,
      api: {
        ...prev.api,
        security: {
          ...prev.api.security,
          [field]: value
        }
      }
    }));
  };

  // Update resources
  const updateResource = (field, value) => {
    setConfig(prev => ({
      ...prev,
      resources: {
        ...prev.resources,
        [field]: value
      }
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(config);
  };

  // Toggle JSON view
  const toggleJsonView = () => {
    setJsonView(!jsonView);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gateway Configuration</CardTitle>
        <CardDescription>Configure LLM models and API settings</CardDescription>
        <div className="flex justify-end gap-2">
          <button 
            onClick={toggleJsonView}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 py-1 px-3 rounded text-sm"
          >
            <Code size={16} />
            {jsonView ? 'Form View' : 'JSON View'}
          </button>
        </div>
      </CardHeader>

      <CardContent>
        {jsonView ? (
          <div className="bg-gray-100 p-4 rounded-md">
            <pre className="text-sm overflow-auto max-h-96">
              {JSON.stringify(config, null, 2)}
            </pre>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="models">Models</TabsTrigger>
                <TabsTrigger value="api">API Settings</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>

              <TabsContent value="models" className="space-y-4">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={addModel}
                    className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 px-3 rounded-md text-sm"
                  >
                    <PlusCircle size={16} /> Add Model
                  </button>
                </div>

                {(!config.models || config.models.length === 0) ? (
                  <div className="text-center py-8 text-gray-500">
                    No models added yet. Click "Add Model" to create one.
                  </div>
                ) : (
                  <div className="space-y-6">
                    {config.models.map((model, index) => (
                      <div key={index} className="border p-4 rounded-md">
                        <div className="flex justify-between mb-4">
                          <h3 className="font-medium">Model #{index + 1}</h3>
                          <button
                            type="button"
                            onClick={() => removeModel(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Model ID</label>
                            <input
                              className="w-full p-2 border rounded-md"
                              type="text"
                              value={model.id || ''}
                              onChange={(e) => updateModel(index, 'id', e.target.value)}
                              placeholder="provider/model-name"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Display Name</label>
                            <input
                              className="w-full p-2 border rounded-md"
                              type="text"
                              value={model.name || ''}
                              onChange={(e) => updateModel(index, 'name', e.target.value)}
                              placeholder="Claude 3 Opus"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Provider</label>
                            <select
                              className="w-full p-2 border rounded-md"
                              value={model.provider || ''}
                              onChange={(e) => updateModel(index, 'provider', e.target.value)}
                              required
                            >
                              <option value="anthropic">Anthropic</option>
                              <option value="openai">OpenAI</option>
                              <option value="gemini">Gemini</option>
                              <option value="deepseek">DeepSeek</option>
                              <option value="ollama">Ollama</option>
                              <option value="mixtral">Mixtral</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">API Key Reference</label>
                            <input
                              className="w-full p-2 border rounded-md"
                              type="text"
                              value={model.apiKey || ''}
                              onChange={(e) => updateModel(index, 'apiKey', e.target.value)}
                              placeholder="ENV_API_KEY"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Endpoint</label>
                          <input
                            className="w-full p-2 border rounded-md"
                            type="text"
                            value={model.endpoint || ''}
                            onChange={(e) => updateModel(index, 'endpoint', e.target.value)}
                            placeholder="https://api.example.com/v1/chat/completions"
                            required
                          />
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Context Window</label>
                          <input
                            className="w-full p-2 border rounded-md"
                            type="number"
                            value={model.contextWindow || ''}
                            onChange={(e) => updateModel(index, 'contextWindow', parseInt(e.target.value))}
                            placeholder="32000"
                          />
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Capabilities</label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {['text', 'image', 'multimodal', 'function_calling', 'tools'].map(capability => (
                              <label key={capability} className="flex items-center gap-1 text-sm">
                                <input
                                  type="checkbox"
                                  checked={(model.capabilities || []).includes(capability)}
                                  onChange={(e) => {
                                    const capabilities = model.capabilities || [];
                                    if (e.target.checked) {
                                      updateModel(index, 'capabilities', [...capabilities, capability]);
                                    } else {
                                      updateModel(index, 'capabilities', capabilities.filter(c => c !== capability));
                                    }
                                  }}
                                />
                                {capability}
                              </label>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Default Parameters</label>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs mb-1">Temperature</label>
                              <input
                                className="w-full p-2 border rounded-md"
                                type="number"
                                min="0"
                                max="1"
                                step="0.1"
                                value={model.parameters?.temperature || 0.7}
                                onChange={(e) => {
                                  const parameters = model.parameters || {};
                                  updateModel(index, 'parameters', {
                                    ...parameters,
                                    temperature: parseFloat(e.target.value)
                                  });
                                }}
                              />
                            </div>
                            <div>
                              <label className="block text-xs mb-1">Max Tokens</label>
                              <input
                                className="w-full p-2 border rounded-md"
                                type="number"
                                value={model.parameters?.maxTokens || 4000}
                                onChange={(e) => {
                                  const parameters = model.parameters || {};
                                  updateModel(index, 'parameters', {
                                    ...parameters,
                                    maxTokens: parseInt(e.target.value)
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="api" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">API Port</label>
                    <input
                      className="w-full p-2 border rounded-md"
                      type="number"
                      value={config.api?.port || 8080}
                      onChange={(e) => updateApiConfig('port', parseInt(e.target.value))}
                      placeholder="8080"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">API Key Header</label>
                    <input
                      className="w-full p-2 border rounded-md"
                      type="text"
                      value={config.api?.security?.apiKeyHeader || ''}
                      onChange={(e) => updateSecurityConfig('apiKeyHeader', e.target.value)}
                      placeholder="X-API-Key"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">Rate Limiting</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs mb-1">Requests Per Minute</label>
                      <input
                        className="w-full p-2 border rounded-md"
                        type="number"
                        value={config.api?.rateLimit?.requestsPerMinute || 100}
                        onChange={(e) => {
                          setConfig(prev => ({
                            ...prev,
                            api: {
                              ...prev.api,
                              rateLimit: {
                                ...prev.api.rateLimit,
                                requestsPerMinute: parseInt(e.target.value)
                              }
                            }
                          }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs mb-1">Burst Size</label>
                      <input
                        className="w-full p-2 border rounded-md"
                        type="number"
                        value={config.api?.rateLimit?.burstSize || 10}
                        onChange={(e) => {
                          setConfig(prev => ({
                            ...prev,
                            api: {
                              ...prev.api,
                              rateLimit: {
                                ...prev.api.rateLimit,
                                burstSize: parseInt(e.target.value)
                              }
                            }
                          }));
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium mb-1">CORS Settings</label>
                  <div>
                    <label className="block text-xs mb-1">Allowed Origins (comma-separated)</label>
                    <input
                      className="w-full p-2 border rounded-md"
                      type="text"
                      value={(config.api?.cors?.allowedOrigins || []).join(', ')}
                      onChange={(e) => {
                        const origins = e.target.value.split(',').map(o => o.trim()).filter(Boolean);
                        setConfig(prev => ({
                          ...prev,
                          api: {
                            ...prev.api,
                            cors: {
                              ...prev.api.cors,
                              allowedOrigins: origins
                            }
                          }
                        }));
                      }}
                      placeholder="http://localhost:3000, https://app.example.com"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="resources" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Memory</label>
                    <input
                      className="w-full p-2 border rounded-md"
                      type="text"
                      value={config.resources?.memory || '1G'}
                      onChange={(e) => updateResource('memory', e.target.value)}
                      placeholder="1G"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CPU</label>
                    <input
                      className="w-full p-2 border rounded-md"
                      type="text"
                      value={config.resources?.cpu || '0.5'}
                      onChange={(e) => updateResource('cpu', e.target.value)}
                      placeholder="0.5"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-md"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          Save Configuration
        </button>
      </CardFooter>
    </Card>
  );
};

export default GatewayConfigForm;