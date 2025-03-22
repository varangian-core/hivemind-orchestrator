/**
 * Utilities for API communication
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// Fetch agent configurations from API
export const fetchAgents = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/config/agents`);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching agents:', error);
    throw error;
  }
};

// Fetch a specific agent configuration
export const fetchAgent = async (agentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/config/agents/${agentId}`);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching agent ${agentId}:`, error);
    throw error;
  }
};

// Save agent configuration
export const saveAgent = async (agentConfig) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/config/agents/${agentConfig.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(agentConfig)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting task ${taskId}:`, error);
    throw error;
  }
};

// Fetch gateway configuration
export const fetchGateway = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/config/gateway`);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching gateway config:', error);
    throw error;
  }
};

// Save gateway configuration
export const saveGateway = async (gatewayConfig) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/config/gateway`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(gatewayConfig)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving gateway config:', error);
    throw error;
  }
};

// Fetch system configuration
export const fetchSystem = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/config/system`);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching system config:', error);
    throw error;
  }
};

// Save system configuration
export const saveSystem = async (systemConfig) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/config/system`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(systemConfig)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving system config:', error);
    throw error;
  }
};

// Import configurations
export const importConfigs = async (configs) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/config/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(configs)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error importing configs:', error);
    throw error;
  }
};

// Export all configurations
export const exportAllConfigs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/config/export`);
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error('Error exporting configs:', error);
    throw error;
  }
};

// Deploy agent
export const deployAgent = async (agentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/deploy/agent/${agentId}`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error deploying agent ${agentId}:`, error);
    throw error;
  }
};

// Deploy scheduler
export const deployScheduler = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/deploy/scheduler`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deploying scheduler:', error);
    throw error;
  }
};

// Deploy gateway
export const deployGateway = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/deploy/gateway`, {
      method: 'POST'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deploying gateway:', error);
    throw error;
  }
};

// Get deployment status for a component
export const getDeploymentStatus = async (component, id = null) => {
  try {
    const url = id 
      ? `${API_BASE_URL}/api/deploy/status/${component}/${id}`
      : `${API_BASE_URL}/api/deploy/status/${component}`;
      
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error getting deployment status for ${component}:`, error);
    throw error;
  }
};

// Helper function to handle API errors
export const handleApiError = (error, fallbackAction) => {
  console.error('API Error:', error);
  
  // Check if we can do a fallback action (like using localStorage)
  if (fallbackAction && typeof fallbackAction === 'function') {
    try {
      return fallbackAction();
    } catch (fallbackError) {
      console.error('Fallback action also failed:', fallbackError);
      throw fallbackError;
    }
  }
  
  throw error;
};response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving agent:', error);
    throw error;
  }
};

// Delete agent configuration
export const deleteAgent = async (agentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/config/agents/${agentId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting agent ${agentId}:`, error);
    throw error;
  }
};

// Fetch scheduler configuration
export const fetchScheduler = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/config/scheduler`);
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching scheduler config:', error);
    throw error;
  }
};

// Save scheduler configuration
export const saveScheduler = async (schedulerConfig) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/config/scheduler`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(schedulerConfig)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving scheduler config:', error);
    throw error;
  }
};

// Save task configuration
export const saveTask = async (taskConfig) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/config/scheduler/tasks/${taskConfig.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(taskConfig)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error saving task:', error);
    throw error;
  }
};

// Delete task configuration
export const deleteTask = async (taskId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/config/scheduler/tasks/${taskId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `HTTP error: ${