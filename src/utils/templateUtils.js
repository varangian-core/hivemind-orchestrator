/**
 * Utility functions for working with templates
 */
import eventTaskTemplates from '../templates/eventTaskTemplates';

// Get a list of all available templates
export const getAvailableTemplates = () => {
  return eventTaskTemplates;
};

// Find a template by ID
export const getTemplateById = (templateId) => {
  return eventTaskTemplates.find(template => template.id === templateId);
};

// Apply template variables and return a processed template
export const applyTemplate = (templateId, variables) => {
  const template = getTemplateById(templateId);
  if (!template) return null;
  
  // Deep clone the template to avoid modifying the original
  const appliedTemplate = JSON.parse(JSON.stringify(template.template));
  
  // Replace variables in the template
  const replaceVariables = (obj) => {
    if (!obj) return obj;
    
    if (typeof obj === 'string') {
      // Replace {{variableName}} with actual values
      return obj.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
        return variables[varName] !== undefined ? variables[varName] : match;
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
  return replaceVariables(appliedTemplate);
};

// Get default variable values for a template
export const getTemplateDefaultVariables = (templateId) => {
  const template = getTemplateById(templateId);
  if (!template) return {};
  
  const defaultVariables = {};
  
  template.variables.forEach(variable => {
    if (variable.default !== undefined) {
      defaultVariables[variable.name] = variable.default;
    } else if (variable.type === 'string') {
      defaultVariables[variable.name] = '';
    } else if (variable.type === 'array') {
      defaultVariables[variable.name] = [];
    } else if (variable.type === 'number') {
      defaultVariables[variable.name] = 0;
    } else if (variable.type === 'boolean') {
      defaultVariables[variable.name] = false;
    }
  });
  
  return defaultVariables;
};

// Validate template variables against their definitions
export const validateTemplateVariables = (templateId, variables) => {
  const template = getTemplateById(templateId);
  if (!template) return { isValid: false, errors: ['Template not found'] };
  
  const errors = [];
  
  template.variables.forEach(varDef => {
    // Check required variables
    if (varDef.required && (variables[varDef.name] === undefined || variables[varDef.name] === '')) {
      errors.push(`${varDef.description} is required`);
    }
    
    // Type checks
    if (variables[varDef.name] !== undefined) {
      if (varDef.type === 'array' && !Array.isArray(variables[varDef.name])) {
        errors.push(`${varDef.description} must be an array`);
      } else if (varDef.type === 'number' && typeof variables[varDef.name] !== 'number') {
        errors.push(`${varDef.description} must be a number`);
      } else if (varDef.type === 'boolean' && typeof variables[varDef.name] !== 'boolean') {
        errors.push(`${varDef.description} must be a boolean`);
      }
      
      // Enum validation
      if (varDef.enum && !varDef.enum.includes(variables[varDef.name])) {
        errors.push(`${varDef.description} must be one of: ${varDef.enum.join(', ')}`);
      }
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Filter templates by category or tag
export const filterTemplatesByCategory = (category) => {
  if (!category) return eventTaskTemplates;
  
  // Map category names to template IDs or patterns
  const categoryMappings = {
    'scheduling': ['scheduled_data_pipeline', 'interval_health_check', 'knowledge_base_update'],
    'event-driven': ['task_completion_trigger', 'task_failure_handler', 'ticket_resolved_trigger'],
    'monitoring': ['interval_health_check', 'api_endpoint_monitoring'],
    'data': ['scheduled_data_pipeline', 'knowledge_base_update'],
    'support': ['ticket_resolved_trigger', 'customer_feedback_processing']
  };
  
  const templateIds = categoryMappings[category] || [];
  
  if (templateIds.length === 0) return eventTaskTemplates;
  
  return eventTaskTemplates.filter(template => templateIds.includes(template.id));
};

// Convert a standard task to template format with variables
export const taskToTemplate = (task) => {
  // Extract possible variables from task (e.g., IDs, expressions, etc.)
  const variableCandidates = {
    // For cron schedules
    cronExpression: task.schedule?.type === 'cron' ? task.schedule.expression : undefined,
    
    // For interval schedules
    interval: task.schedule?.type === 'interval' ? task.schedule.interval : undefined,
    
    // For event schedules
    event: task.schedule?.type === 'event' ? task.schedule.event : undefined,
    
    // Dependencies
    dependencies: task.dependencies,
    
    // Input values (first level only)
    ...task.input,
    
    // Output event name
    outputEventName: task.output?.eventName
  };
  
  // Create variables array
  const variables = [];
  
  // Add variables for each candidate
  Object.entries(variableCandidates).forEach(([key, value]) => {
    if (value !== undefined) {
      variables.push({
        name: key,
        description: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase(),
        type: Array.isArray(value) ? 'array' : typeof value,
        default: value
      });
    }
  });
  
  // Convert task to template format
  const template = {
    template: task,
    variables
  };
  
  return template;
};