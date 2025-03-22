# Agent Orchestrator Configuration UI

A React-based UI for creating and managing configuration files for the Agent Orchestration system. This UI allows users to configure agents, schedulers, tasks, and gateway settings through a user-friendly interface, generating standardized JSON configuration files for use with the Python Orchestrator.

## Features

- **Visual Configuration Editor:** Create and edit agent, scheduler, and gateway configurations without writing JSON manually
- **Template Support:** Apply and customize pre-defined templates for common task types
- **JSON Import/Export:** Import and export configuration files for backup or sharing
- **Validation:** Ensures configurations follow the required schema and contain all necessary fields
- **Multi-Component Support:** Manage all system components from a single interface

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/agent-orchestrator-ui.git
cd agent-orchestrator-ui
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
src/
├── components/
│   ├── AgentConfigForm.jsx    # Agent configuration form
│   ├── TaskConfigForm.jsx     # Task configuration form with template support
│   ├── GatewayConfigForm.jsx  # Gateway configuration form
│   └── ConfigManagerApp.jsx   # Main application component
├── templates/
│   └── eventTaskTemplates.js  # Event-driven task templates
├── utils/
│   ├── configValidation.js    # Configuration validation utilities
│   └── configExport.js        # Export and download utilities
└── App.jsx                    # Application entry point
```

## Configuration Schema

The UI generates configuration files following these schemas:

### Agents Configuration

```json
{
  "id": "customer_support_agent",
  "name": "Customer Support Specialist",
  "model": "anthropic/claude-3-opus",
  "role": "Customer Support Specialist",
  "goal": "Help customers resolve product issues",
  "instructions": "...",
  "tools": [
    {
      "id": "knowledge_base",
      "type": "database",
      "description": "Access the knowledge base",
      "config": { ... }
    }
  ],
  "functions": [
    {
      "id": "escalate_to_human",
      "description": "Escalate to human support",
      "parameters": { ... },
      "handler": "com.example.agent.functions.EscalationHandler"
    }
  ],
  "resources": {
    "memory": "1G",
    "cpu": "0.5"
  }
}
```

### Scheduler Configuration

```json
{
  "id": "main_scheduler",
  "type": "cron",
  "resources": {
    "memory": "512M",
    "cpu": "0.25",
    "maxWorkers": 20
  },
  "tasks": [
    {
      "id": "daily_summary_report",
      "agentId": "data_analysis_agent",
      "name": "Daily Business Summary Report",
      "schedule": {
        "type": "cron",
        "expression": "0 6 * * *"
      },
      "input": { ... },
      "output": {
        "eventName": "daily_report_complete",
        "outputMapping": { ... }
      },
      "timeout": "10m",
      "retries": 2
    },
    {
      "id": "customer_satisfaction_followup",
      "agentId": "customer_support_agent",
      "name": "Customer Satisfaction Follow-up",
      "schedule": {
        "type": "event",
        "event": "ticket.resolved",
        "filter": { ... }
      },
      "input": { ... },
      "dependencies": [ ... ],
      "timeout": "2m"
    }
  ]
}
```

### Gateway Configuration

```json
{
  "models": [
    {
      "id": "anthropic/claude-3-opus",
      "provider": "anthropic",
      "name": "Claude 3 Opus",
      "endpoint": "https://api.anthropic.com/v1/messages",
      "apiKey": "ENV_ANTHROPIC_API_KEY",
      "parameters": { ... },
      "capabilities": ["text", "image", "multimodal", "function_calling"],
      "contextWindow": 200000,
      "cost": { ... }
    }
  ],
  "api": {
    "port": 8080,
    "rateLimit": { ... },
    "cors": { ... },
    "security": { ... }
  },
  "resources": {
    "memory": "1G",
    "cpu": "0.5"
  }
}
```

## Working with Templates

The system supports templates for common task configurations. Templates are defined in `src/templates/eventTaskTemplates.js` and can be customized or extended.

To add a new template:

1. Open `eventTaskTemplates.js`
2. Add a new template object following the existing pattern:

```javascript
{
  "id": "your_template_id",
  "name": "Your Template Name",
  "description": "Description of what this template does",
  "template": {
    // Template structure with {{variableName}} placeholders
  },
  "variables": [
    {
      "name": "variableName",
      "description": "What this variable is for",
      "type": "string", // or "array", "number", etc.
      "required": true,
      "default": "optional default value"
    }
  ]
}
```

## Integration with Python Orchestrator

The UI generates configuration files that can be used directly with the Python Orchestrator. 

### Export Options

1. **Individual Export:** Each component can be exported individually as a JSON file
2. **Bulk Export:** All configurations can be exported as a ZIP file
3. **API Integration:** Configure the UI to send configurations directly to the Orchestrator API

### Configuration Directory

The JSON files created by this UI should be saved to the orchestrator's configuration directory:

```
configs/
├── agents/
│   ├── customer_support_agent.json
│   └── data_analysis_agent.json
├── scheduler/
│   └── main_scheduler.json
└── gateway/
    ├── models.json
    └── api_config.json
```

## Customizing the UI

### Styling

The UI uses Tailwind CSS for styling. You can customize the look and feel by:

1. Modifying the Tailwind configuration in `tailwind.config.js`
2. Adding custom CSS in `src/styles/custom.css`

### Adding New Components

To add support for new orchestrator components:

1. Create a new form component in `src/components/`
2. Define the component's schema in your validation utilities
3. Add the component to the main `ConfigManagerApp.jsx` file
4. Update any related components that need to interact with it

## License

MIT License
