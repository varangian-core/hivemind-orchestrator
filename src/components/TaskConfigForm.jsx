import React, { useState, useEffect } from 'react';
import { RefreshCw, Book } from 'lucide-react';

// Assuming this function would fetch templates from your template library
// In a real app, this would likely be a prop passed from a parent component
// or fetched via an API call
const fetchTemplates = async () => {
  // In production, this would be an API call
  // For this example, we'll just return a promise that resolves with template data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        templates: [
          {
            id: "task_completion_trigger",
            name: "Task Completion Trigger",
            description: "Triggers when another task completes successfully",
            template: {
              schedule: {
                type: "event",
                event: "task.complete",
                filter: {
                  taskId: "{{predecessorTaskId}}",
                  status: "success"
                }
              },
              dependencies: ["{{predecessorTaskId}}"]
            },
            variables: [
              {
                name: "predecessorTaskId",
                description: "ID of the task that must complete before this one runs",
                type: "string",
                required: true
              }
            ]
          },
          {
            id: "ticket_resolved_trigger",
            name: "Ticket Resolved Trigger",
            description: "Triggers when a support ticket is resolved",
            template: {
              schedule: {
                type: "event",
                event: "ticket.resolved",
                filter: {
                  category: "{{categories}}"
                }
              },
              input: {
                action: "send_satisfaction_survey",
                delay: "{{delay}}",
                ticketId: "#{event.ticketId}",
                customerEmail: "#{event.customerEmail}"
              }
            },
            variables: [
              {
                name: "categories",
                description: "Categories of tickets to monitor",
                type: "array",
                itemType: "string",
                default: ["technical", "account"]
              },
              {
                name: "delay",
                description: "Delay before sending survey",
                type: "string",
                default: "24h"
              }
            ]
          }
        ]
      });
    }, 300);
  });
};

export const TaskConfigForm = ({ onSave, onCancel, initialData, availableAgents = [] }) => {
  const [task, setTask] = useState(initialData || {
    id: "",
    agentId: "",
    name: "",
    schedule: {
      type: "cron",
      expression: "0 0 * * *"
    },
    input: {},
    output: {
      eventName: "",
      outputMapping: {}
    },
    timeout: "5m",
    retries: 0
  });

  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateVariables, setTemplateVariables] = useState({});
  const [isApplyingTemplate, setIsApplyingTemplate] = useState(false);

  // Fetch templates on component mount
  useEffect(() => {
    const getTemplates = async () => {
      try {
        const result = await fetchTemplates();
        setTemplates(result.templates);
      } catch (error) {
        console.error("Failed to fetch templates:", error);
      }
    };
    
    getTemplates();
  }, []);

  // Update a field in the task object
  const updateField = (field, value) => {
    setTask(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Update a nested field in the task object
  const updateNestedField = (parent, field, value) => {
    setTask(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(task);
  };

  // Select a template to apply
  const selectTemplate = (templateId) => {
    const selected = templates.find(t => t.id === templateId);
    setSelectedTemplate(selected);
    
    // Initialize variable values with defaults if available
    if (selected) {
      const vars = {};
      selected.variables.forEach(v => {
        vars[v.name] = v.default !== undefined ? v.default : '';
      });
      setTemplateVariables(vars);
    }
    
    setIsApplyingTemplate(true);
  };

  // Apply the selected template with variable values
  const applyTemplate = () => {
    if (!selectedTemplate) return;
    
    // Start with a deep clone of the template
    let appliedTemplate = JSON.parse(JSON.stringify(selectedTemplate.template));
    
    // Replace variables in the template
    const replaceVariables = (obj) => {
      if (!obj) return obj;
      
      if (typeof obj === 'string') {
        // Replace {{variableName}} with actual values
        return obj.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
          return templateVariables[varName] !== undefined ? templateVariables[varName] : match;
        });
      }
      
      if (Array.isArray(obj)) {
        return obj.map(item => replaceVariables(item));
      }
      
      if (typeof obj === 'object') {
        const result = {};
        for (const key in obj) {
          result[key] = replaceVariables(obj[key]);
        }
        return result;
      }
      
      return obj;
    };
    
    // Apply variable replacements throughout the template
    appliedTemplate = replaceVariables(appliedTemplate);
    
    // Merge the applied template with the current task
    setTask(prev => ({
      ...prev,
      ...appliedTemplate,
      // Preserve these fields
      id: prev.id,
      agentId: prev.agentId,
      name: prev.name
    }));
    
    setIsApplyingTemplate(false);
    setSelectedTemplate(null);
  };
  
  // Cancel template application
  const cancelTemplateApplication = () => {
    setIsApplyingTemplate(false);
    setSelectedTemplate(null);
  };

  // Render schedule configuration based on type
  const renderScheduleConfig = () => {
    const scheduleType = task.schedule?.type || 'cron';
    
    switch (scheduleType) {
      case 'cron':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Schedule Type</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value="cron"
                  onChange={(e) => updateNestedField('schedule', 'type', e.target.value)}
                >
                  <option value="cron">Cron</option>
                  <option value="interval">Interval</option>
                  <option value="event">Event</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Cron Expression</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={task.schedule?.expression || ''}
                  onChange={(e) => updateNestedField('schedule', 'expression', e.target.value)}
                  placeholder="0 0 * * *"
                />
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded text-xs text-blue-800">
              <p><strong>Examples:</strong></p>
              <p>• Daily at midnight: <code>0 0 * * *</code></p>
              <p>• Every hour: <code>0 * * * *</code></p>
              <p>• Weekdays at 9 AM: <code>0 9 * * 1-5</code></p>
            </div>
          </div>
        );
        
      case 'interval':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Schedule Type</label>
              <select
                className="w-full p-2 border rounded-md"
                value="interval"
                onChange={(e) => updateNestedField('schedule', 'type', e.target.value)}
              >
                <option value="cron">Cron</option>
                <option value="interval">Interval</option>
                <option value="event">Event</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Interval</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                value={task.schedule?.interval || ''}
                onChange={(e) => updateNestedField('schedule', 'interval', e.target.value)}
                placeholder="5m"
              />
              <p className="text-xs text-gray-500 mt-1">Examples: 5m, 1h, 30s</p>
            </div>
          </div>
        );
        
      case 'event':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Schedule Type</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value="event"
                  onChange={(e) => updateNestedField('schedule', 'type', e.target.value)}
                >
                  <option value="cron">Cron</option>
                  <option value="interval">Interval</option>
                  <option value="event">Event</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Event Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={task.schedule?.event || ''}
                  onChange={(e) => updateNestedField('schedule', 'event', e.target.value)}
                  placeholder="task.complete, ticket.resolved"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Event Filter (JSON)</label>
              <textarea
                className="w-full p-2 border rounded-md font-mono text-sm"
                value={JSON.stringify(task.schedule?.filter || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const filterObj = JSON.parse(e.target.value);
                    setTask(prev => ({
                      ...prev,
                      schedule: {
                        ...prev.schedule,
                        filter: filterObj
                      }
                    }));
                  } catch (error) {
                    // Don't update if invalid JSON
                  }
                }}
                rows={5}
                placeholder='{"taskId": "task_id", "status": "success"}'
              />
            </div>
            
            <div className="flex items-center gap-2 text-indigo-600">
              <Book size={16} />
              <span className="text-sm">
                <button type="button" onClick={() => setIsApplyingTemplate(true)} className="underline text-indigo-600">
                  Use a template instead
                </button>
              </span>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-4xl">
      {isApplyingTemplate && selectedTemplate ? (
        <div className="mb-6 border p-4 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Applying Template: {selectedTemplate.name}</h3>
          <p className="text-sm text-gray-600 mb-4">{selectedTemplate.description}</p>
          
          <div className="space-y-4 mb-6">
            <h4 className="font-medium text-sm">Template Variables:</h4>
            {selectedTemplate.variables.map((variable) => (
              <div key={variable.name}>
                <label className="block text-sm font-medium mb-1">
                  {variable.description}
                  {variable.required && <span className="text-red-500">*</span>}
                </label>
                
                {variable.type === 'array' ? (
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={Array.isArray(templateVariables[variable.name]) 
                      ? templateVariables[variable.name].join(', ')
                      : templateVariables[variable.name] || ''}
                    onChange={(e) => {
                      // Convert comma-separated string to array
                      const value = e.target.value.split(',').map(v => v.trim());
                      setTemplateVariables(prev => ({
                        ...prev,
                        [variable.name]: value
                      }));
                    }}
                    placeholder="Value1, Value2, Value3"
                  />
                ) : (
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={templateVariables[variable.name] || ''}
                    onChange={(e) => {
                      setTemplateVariables(prev => ({
                        ...prev,
                        [variable.name]: e.target.value
                      }));
                    }}
                    placeholder={`Enter ${variable.name}`}
                    required={variable.required}
                  />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={cancelTemplateApplication}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={applyTemplate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Apply Template
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-bold">Task Configuration</h2>
            <button
              type="button"
              onClick={() => setIsApplyingTemplate(true)}
              className="flex items-center gap-2 text-sm bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-md"
            >
              <RefreshCw size={16} /> Use Template
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Task ID</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={task.id}
                    onChange={(e) => updateField('id', e.target.value)}
                    placeholder="daily_summary_report"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Display Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={task.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Daily Summary Report"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Agent</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={task.agentId}
                  onChange={(e) => updateField('agentId', e.target.value)}
                  required
                >
                  <option value="">Select an agent</option>
                  {availableAgents.map(agent => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Schedule Configuration */}
              <div className="border-t pt-4">
                <h3 className="text-md font-semibold mb-4">Schedule Configuration</h3>
                {renderScheduleConfig()}
              </div>
              
              {/* Input Parameters */}
              <div className="border-t pt-4">
                <h3 className="text-md font-semibold mb-4">Input Parameters</h3>
                <div>
                  <label className="block text-sm font-medium mb-1">Input JSON</label>
                  <textarea
                    className="w-full p-2 border rounded-md font-mono text-sm"
                    value={JSON.stringify(task.input || {}, null, 2)}
                    onChange={(e) => {
                      try {
                        const inputObj = JSON.parse(e.target.value);
                        updateField('input', inputObj);
                      } catch (error) {
                        // Don't update if invalid JSON
                      }
                    }}
                    rows={5}
                    placeholder='{"param1": "value1", "param2": "value2"}'
                  />
                </div>
              </div>
              
              {/* Output Configuration */}
              <div className="border-t pt-4">
                <h3 className="text-md font-semibold mb-4">Output Configuration</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Event Name</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={task.output?.eventName || ''}
                      onChange={(e) => updateNestedField('output', 'eventName', e.target.value)}
                      placeholder="daily_report_complete"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Output Mapping</label>
                    <textarea
                      className="w-full p-2 border rounded-md font-mono text-sm"
                      value={JSON.stringify(task.output?.outputMapping || {}, null, 2)}
                      onChange={(e) => {
                        try {
                          const mappingObj = JSON.parse(e.target.value);
                          setTask(prev => ({
                            ...prev,
                            output: {
                              ...prev.output,
                              outputMapping: mappingObj
                            }
                          }));
                        } catch (error) {
                          // Don't update if invalid JSON
                        }
                      }}
                      rows={3}
                      placeholder='{"reportUrl": "$.result.reportUrl"}'
                    />
                  </div>
                </div>
              </div>
              
              {/* Execution Settings */}
              <div className="border-t pt-4">
                <h3 className="text-md font-semibold mb-4">Execution Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Timeout</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={task.timeout || ''}
                      onChange={(e) => updateField('timeout', e.target.value)}
                      placeholder="5m"
                    />
                    <p className="text-xs text-gray-500 mt-1">Examples: 5m, 1h, 30s</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Retries</label>
                    <input
                      type="number"
                      className="w-full p-2 border rounded-md"
                      value={task.retries || 0}
                      onChange={(e) => updateField('retries', parseInt(e.target.value))}
                      min="0"
                    />
                  </div>
                </div>
              </div>
              
              {task.schedule?.type === 'event' && (
                <div className="border-t pt-4">
                  <h3 className="text-md font-semibold mb-4">Dependencies</h3>
                  <div>
                    <label className="block text-sm font-medium mb-1">Task Dependencies</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      value={(task.dependencies || []).join(', ')}
                      onChange={(e) => {
                        const deps = e.target.value.split(',').map(d => d.trim()).filter(Boolean);
                        updateField('dependencies', deps);
                      }}
                      placeholder="task_id_1, task_id_2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Comma-separated list of task IDs this task depends on
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Task
                </button>
              </div>
            </div>
          </form>
        </>
      )}
      
      {/* Template Selection Modal */}
      {isApplyingTemplate && !selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Select a Template</h2>
            
            <div className="space-y-4">
              {templates.map(template => (
                <div
                  key={template.id}
                  className="border rounded-md p-4 hover:border-blue-400 cursor-pointer transition-colors"
                  onClick={() => selectTemplate(template.id)}
                >
                  <h3 className="font-medium">{template.name}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={cancelTemplateApplication}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
