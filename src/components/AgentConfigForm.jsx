
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { PlusCircle, Trash2, Save, FileDown, Upload, Code } from 'lucide-react';

const AgentConfigForm = ({ onSave, initialData }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [config, setConfig] = useState(initialData || {
    id: "",
    name: "",
    model: "anthropic/claude-3-opus",
    role: "",
    goal: "",
    instructions: "",
    tools: [],
    functions: [],
    resources: {
      memory: "1G",
      cpu: "0.5"
    }
  });
  const [jsonView, setJsonView] = useState(false);

  // Update a specific field in the config
  const updateField = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  // Update a nested field in the config
  const updateNestedField = (parent, field, value) => {
    setConfig(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Add a new tool
  const addTool = () => {
    setConfig(prev => ({
      ...prev,
      tools: [
        ...(prev.tools || []),
        {
          id: `tool_${(prev.tools || []).length + 1}`,
          type: "api",
          description: "",
          config: {}
        }
      ]
    }));
  };

  // Update a tool field
  const updateToolField = (index, field, value) => {
    const updatedTools = [...(config.tools || [])];
    updatedTools[index] = {
      ...updatedTools[index],
      [field]: value
    };
    setConfig(prev => ({ ...prev, tools: updatedTools }));
  };

  // Remove a tool
  const removeTool = (index) => {
    const updatedTools = [...(config.tools || [])];
    updatedTools.splice(index, 1);
    setConfig(prev => ({ ...prev, tools: updatedTools }));
  };

  // Add a new function
  const addFunction = () => {
    setConfig(prev => ({
      ...prev,
      functions: [
        ...(prev.functions || []),
        {
          id: `function_${(prev.functions || []).length + 1}`,
          description: "",
          parameters: {
            type: "object",
            required: [],
            properties: {}
          },
          handler: ""
        }
      ]
    }));
  };

  // Update a function field
  const updateFunctionField = (index, field, value) => {
    const updatedFunctions = [...(config.functions || [])];
    updatedFunctions[index] = {
      ...updatedFunctions[index], 
      [field]: value
    };
    setConfig(prev => ({ ...prev, functions: updatedFunctions }));
  };

  // Remove a function
  const removeFunction = (index) => {
    const updatedFunctions = [...(config.functions || [])];
    updatedFunctions.splice(index, 1);
    setConfig(prev => ({ ...prev, functions: updatedFunctions }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(config);
  };

  // Download configuration as JSON
  const downloadConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(config, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${config.id || 'agent'}-config.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // Import configuration from JSON file
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          setConfig(imported);
        } catch (error) {
          console.error("Failed to parse JSON", error);
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  // Toggle between form and JSON view
  const toggleJsonView = () => {
    setJsonView(!jsonView);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Agent Configuration</CardTitle>
        <CardDescription>Define the behavior and capabilities of this agent</CardDescription>
        <div className="flex justify-end gap-2">
          <label className="cursor-pointer flex items-center gap-2 bg-gray-100 hover:bg-gray-200 py-1 px-3 rounded text-sm">
            <Upload size={16} />
            Import
            <input type="file" className="hidden" onChange={handleImport} accept=".json" />
          </label>
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
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="tools">Tools</TabsTrigger>
                <TabsTrigger value="functions">Functions</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Agent ID (snake_case)</label>
                    <input
                      className="w-full p-2 border rounded-md"
                      type="text"
                      value={config.id || ''}
                      onChange={(e) => updateField('id', e.target.value)}
                      placeholder="customer_support_agent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Display Name</label>
                    <input
                      className="w-full p-2 border rounded-md"
                      type="text"
                      value={config.name || ''}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="Customer Support Agent"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Model</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={config.model || ''}
                    onChange={(e) => updateField('model', e.target.value)}
                    required
                  >
                    <option value="">Select a model</option>
                    <option value="anthropic/claude-3-opus">Anthropic / Claude 3 Opus</option>
                    <option value="anthropic/claude-3-sonnet">Anthropic / Claude 3 Sonnet</option>
                    <option value="openai/gpt-4">OpenAI / GPT-4</option>
                    <option value="gemini/gemini-pro">Gemini / Gemini Pro</option>
                    <option value="deepseek/deepseek-coder">DeepSeek / DeepSeek Coder</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input
                    className="w-full p-2 border rounded-md"
                    type="text"
                    value={config.role || ''}
                    onChange={(e) => updateField('role', e.target.value)}
                    placeholder="Customer Support Specialist"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Goal</label>
                  <input
                    className="w-full p-2 border rounded-md"
                    type="text"
                    value={config.goal || ''}
                    onChange={(e) => updateField('goal', e.target.value)}
                    placeholder="Help customers resolve product issues efficiently"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Instructions</label>
                  <textarea
                    className="w-full p-2 border rounded-md min-h-32"
                    value={config.instructions || ''}
                    onChange={(e) => updateField('instructions', e.target.value)}
                    placeholder="Detailed instructions for how the agent should behave..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Memory</label>
                    <input
                      className="w-full p-2 border rounded-md"
                      type="text"
                      value={config.resources?.memory || '1G'}
                      onChange={(e) => updateNestedField('resources', 'memory', e.target.value)}
                      placeholder="1G"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">CPU</label>
                    <input
                      className="w-full p-2 border rounded-md"
                      type="text"
                      value={config.resources?.cpu || '0.5'}
                      onChange={(e) => updateNestedField('resources', 'cpu', e.target.value)}
                      placeholder="0.5"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="tools" className="space-y-4">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={addTool}
                    className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 px-3 rounded-md text-sm"
                  >
                    <PlusCircle size={16} /> Add Tool
                  </button>
                </div>

                {(!config.tools || config.tools.length === 0) ? (
                  <div className="text-center py-8 text-gray-500">
                    No tools added yet. Click "Add Tool" to create one.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {config.tools.map((tool, index) => (
                      <div key={index} className="border p-4 rounded-md">
                        <div className="flex justify-between mb-4">
                          <h3 className="font-medium">Tool #{index + 1}</h3>
                          <button
                            type="button"
                            onClick={() => removeTool(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Tool ID</label>
                            <input
                              className="w-full p-2 border rounded-md"
                              type="text"
                              value={tool.id || ''}
                              onChange={(e) => updateToolField(index, 'id', e.target.value)}
                              placeholder="knowledge_base"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select
                              className="w-full p-2 border rounded-md"
                              value={tool.type || ''}
                              onChange={(e) => updateToolField(index, 'type', e.target.value)}
                              required
                            >
                              <option value="database">Database</option>
                              <option value="api">API</option>
                              <option value="web_search">Web Search</option>
                              <option value="file_system">File System</option>
                              <option value="custom">Custom</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Description</label>
                          <input
                            className="w-full p-2 border rounded-md"
                            type="text"
                            value={tool.description || ''}
                            onChange={(e) => updateToolField(index, 'description', e.target.value)}
                            placeholder="Description of what this tool does"
                          />
                        </div>

                        <div className="mt-4">
                          <label className="block text-sm font-medium mb-1">Tool Configuration (JSON)</label>
                          <textarea
                            className="w-full p-2 border rounded-md font-mono text-sm"
                            value={JSON.stringify(tool.config || {}, null, 2)}
                            onChange={(e) => {
                              try {
                                const configObj = JSON.parse(e.target.value);
                                updateToolField(index, 'config', configObj);
                              } catch (error) {
                                // Don't update if invalid JSON
                              }
                            }}
                            rows={5}
                            placeholder="{}"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="functions" className="space-y-4">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={addFunction}
                    className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 px-3 rounded-md text-sm"
                  >
                    <PlusCircle size={16} /> Add Function
                  </button>
                </div>

                {(!config.functions || config.functions.length === 0) ? (
                  <div className="text-center py-8 text-gray-500">
                    No functions added yet. Click "Add Function" to create one.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {config.functions.map((func, index) => (
                      <div key={index} className="border p-4 rounded-md">
                        <div className="flex justify-between mb-4">
                          <h3 className="font-medium">Function #{index + 1}</h3>
                          <button
                            type="button"
                            onClick={() => removeFunction(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Function ID</label>
                            <input
                              className="w-full p-2 border rounded-md"
                              type="text"
                              value={func.id || ''}
                              onChange={(e) => updateFunctionField(index, 'id', e.target.value)}
                              placeholder="escalate_to_human"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <input
                              className="w-full p-2 border rounded-md"
                              type="text"
                              value={func.description || ''}
                              onChange={(e) => updateFunctionField(index, 'description', e.target.value)}
                              placeholder="Description of what this function does"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Handler</label>
                            <input
                              className="w-full p-2 border rounded-md"
                              type="text"
                              value={func.handler || ''}
                              onChange={(e) => updateFunctionField(index, 'handler', e.target.value)}
                              placeholder="com.example.functions.EscalationHandler"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-1">Parameters (JSON Schema)</label>
                            <textarea
                              className="w-full p-2 border rounded-md font-mono text-sm"
                              value={JSON.stringify(func.parameters || {}, null, 2)}
                              onChange={(e) => {
                                try {
                                  const paramsObj = JSON.parse(e.target.value);
                                  updateFunctionField(index, 'parameters', paramsObj);
                                } catch (error) {
                                  // Don't update if invalid JSON
                                }
                              }}
                              rows={8}
                              placeholder='{"type": "object", "required": [], "properties": {}}'
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </form>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <div>
          <button
            type="button"
            onClick={downloadConfig}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 py-2 px-4 rounded-md"
          >
            <FileDown size={16} /> Download JSON
          </button>
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          <Save size={16} /> Save Configuration
        </button>
      </CardFooter>
    </Card>
  );
};

export default AgentConfigForm;
