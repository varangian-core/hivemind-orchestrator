/**
 * Utility functions for managing configurations
 */

// Format a config ID to snake_case
export const formatConfigId = (id) => {
  if (!id) return '';
  
  // Replace spaces and invalid chars with underscores
  let formatted = id.toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_')  // Replace invalid chars with underscore
    .replace(/_{2,}/g, '_')        // Replace multiple underscores with a single one
    .replace(/^_|_$/g, '');        // Remove leading/trailing underscores
  
  return formatted;
};

// Generate a filename for a configuration
export const generateConfigFilename = (type, id) => {
  const safeId = formatConfigId(id);
  return `${type}/${safeId}.json`;
};

// Create a new agent configuration with defaults
export const createNewAgentConfig = (id = '') => {
  return {
    id: formatConfigId(id || 'new_agent'),
    name: '',
    model: 'anthropic/claude-3-opus',
    role: '',
    goal: '',
    instructions: '',
    tools: [],
    functions: [],
    resources: {
      memory: '1G',
      cpu: '0.5'
    }
  };
};

// Create a new task configuration with defaults
export const createNewTaskConfig = (id = '') => {
  return {
    id: formatConfigId(id || 'new_task'),
    agentId: '',
    name: '',
    schedule: {
      type: 'cron',
      expression: '0 0 * * *'
    },
    input: {},
    output: {
      eventName: '',
      outputMapping: {}
    },
    timeout: '5m',
    retries: 0
  };
};

// Generate a default model configuration
export const createNewModelConfig = (provider = 'anthropic', modelName = '') => {
  const defaultModels = {
    anthropic: {
      id: `anthropic/${formatConfigId(modelName) || 'claude-model'}`,
      provider: 'anthropic',
      name: modelName || 'Claude Model',
      endpoint: 'https://api.anthropic.com/v1/messages',
      apiKey: 'ENV_ANTHROPIC_API_KEY',
      parameters: {
        temperature: 0.7,
        maxTokens: 4000
      },
      capabilities: ['text'],
      contextWindow: 100000
    },
    openai: {
      id: `openai/${formatConfigId(modelName) || 'gpt-model'}`,
      provider: 'openai',
      name: modelName || 'GPT Model',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      apiKey: 'ENV_OPENAI_API_KEY',
      parameters: {
        temperature: 0.7,
        maxTokens: 4000
      },
      capabilities: ['text'],
      contextWindow: 16000
    },
    gemini: {
      id: `gemini/${formatConfigId(modelName) || 'gemini-model'}`,
      provider: 'gemini',
      name: modelName || 'Gemini Model',
      endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      apiKey: 'ENV_GEMINI_API_KEY',
      parameters: {
        temperature: 0.7,
        maxTokens: 4000
      },
      capabilities: ['text'],
      contextWindow: 32000
    }
  };
  
  return defaultModels[provider] || defaultModels.anthropic;
};

// Process a template with variable replacements
export const processTemplate = (template, variables) => {
  if (!template || !variables) return template;
  
  // Deep clone the template to avoid modifying the original
  const processedTemplate = JSON.parse(JSON.stringify(template));
  
  // Function to replace variables in the template
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
  return replaceVariables(processedTemplate);
};

// Convert comma-separated string to array and trim values
export const stringToArray = (str) => {
  if (!str) return [];
  return str.split(',').map(item => item.trim()).filter(Boolean);
};

// Create a new gateway configuration with defaults
export const createDefaultGatewayConfig = () => {
  return {
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
  };
};

// Create a default system configuration
export const createDefaultSystemConfig = () => {
  return {
    orchestrator: {
      id: "main_orchestrator",
      api: {
        port: 8000,
        host: "0.0.0.0"
      },
      docker: {
        registry: "registry.example.com",
        baseImage: "agent-base:latest",
        networkName: "agent-network"
      },
      metrics: {
        enabled: true,
        prometheusEndpoint: "/metrics"
      },
      logging: {
        level: "INFO",
        format: "json",
        destination: "stdout"
      }
    }
  };
};