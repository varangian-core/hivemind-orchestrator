// Event-driven task templates
// These templates are used to generate common event-based task configurations

const eventTaskTemplates = [
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
    id: "task_failure_handler",
    name: "Task Failure Handler",
    description: "Triggers when another task fails",
    template: {
      schedule: {
        type: "event",
        event: "task.complete",
        filter: {
          taskId: "{{taskId}}",
          status: "error"
        }
      },
      input: {
        errorDetails: "#{{{taskId}}.error}",
        action: "{{action}}"
      }
    },
    variables: [
      {
        name: "taskId",
        description: "ID of the task to monitor for failure",
        type: "string",
        required: true
      },
      {
        name: "action",
        description: "Action to take on failure",
        type: "string",
        enum: ["notify", "retry", "escalate"],
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
  },
  {
    id: "scheduled_data_pipeline",
    name: "Scheduled Data Pipeline",
    description: "A scheduled task that kicks off a data processing pipeline",
    template: {
      schedule: {
        type: "cron",
        expression: "{{cronExpression}}"
      },
      input: {
        dataSource: "{{dataSource}}",
        operation: "{{operation}}",
        parameters: {}
      },
      output: {
        eventName: "{{outputEventName}}",
        outputMapping: {
          processedRecords: "$.result.count",
          outputLocation: "$.result.location"
        }
      }
    },
    variables: [
      {
        name: "cronExpression",
        description: "Cron expression for scheduling",
        type: "string",
        default: "0 0 * * *"
      },
      {
        name: "dataSource",
        description: "Source of the data to process",
        type: "string",
        required: true
      },
      {
        name: "operation",
        description: "Operation to perform on the data",
        type: "string",
        required: true
      },
      {
        name: "outputEventName",
        description: "Event name to emit upon completion",
        type: "string",
        default: "data_processing_complete"
      }
    ]
  },
  {
    id: "interval_health_check",
    name: "Interval Health Check",
    description: "Regularly check the health of a system component",
    template: {
      schedule: {
        type: "interval",
        interval: "{{checkInterval}}"
      },
      input: {
        component: "{{componentName}}",
        checkType: "health",
        timeout: "{{timeout}}"
      },
      output: {
        eventName: "health_check_complete",
        outputMapping: {
          status: "$.result.status",
          metrics: "$.result.metrics"
        }
      }
    },
    variables: [
      {
        name: "checkInterval",
        description: "Interval between checks",
        type: "string",
        default: "5m"
      },
      {
        name: "componentName",
        description: "Name of the component to check",
        type: "string",
        required: true
      },
      {
        name: "timeout",
        description: "Timeout for the health check",
        type: "string",
        default: "30s"
      }
    ]
  },
  {
    id: "knowledge_base_update",
    name: "Knowledge Base Update",
    description: "Update knowledge base with new information",
    template: {
      schedule: {
        type: "cron",
        expression: "{{cronExpression}}"
      },
      input: {
        sources: "{{sources}}",
        updateType: "{{updateType}}",
        maxEntries: "{{maxEntries}}"
      },
      output: {
        eventName: "knowledge_base_updated",
        outputMapping: {
          updatedEntries: "$.result.updatedCount",
          newEntries: "$.result.newCount"
        }
      }
    },
    variables: [
      {
        name: "cronExpression",
        description: "Cron expression for scheduling",
        type: "string",
        default: "0 2 * * 1"
      },
      {
        name: "sources",
        description: "Data sources to use for updates",
        type: "array",
        itemType: "string",
        default: ["product_docs", "support_tickets", "forum_posts"]
      },
      {
        name: "updateType",
        description: "Type of update to perform",
        type: "string",
        enum: ["incremental", "full"],
        default: "incremental"
      },
      {
        name: "maxEntries",
        description: "Maximum number of entries to update",
        type: "number",
        default: 100
      }
    ]
  },
  {
    id: "customer_feedback_processing",
    name: "Customer Feedback Processing",
    description: "Process customer feedback and generate reports",
    template: {
      schedule: {
        type: "event",
        event: "feedback.submitted",
        filter: {
          type: "{{feedbackType}}"
        }
      },
      input: {
        processingLevel: "{{processingLevel}}",
        generateReport: "{{generateReport}}",
        notifyTeam: "{{notifyTeam}}"
      },
      output: {
        eventName: "feedback_processed",
        outputMapping: {
          sentimentScore: "$.result.sentiment",
          category: "$.result.category",
          reportUrl: "$.result.reportUrl"
        }
      }
    },
    variables: [
      {
        name: "feedbackType",
        description: "Type of feedback to process",
        type: "string",
        enum: ["survey", "app", "email", "all"],
        default: "all"
      },
      {
        name: "processingLevel",
        description: "Depth of processing",
        type: "string",
        enum: ["basic", "detailed", "comprehensive"],
        default: "detailed"
      },
      {
        name: "generateReport",
        description: "Generate a report",
        type: "boolean",
        default: true
      },
      {
        name: "notifyTeam",
        description: "Notify team of results",
        type: "boolean",
        default: false
      }
    ]
  },
  {
    id: "api_endpoint_monitoring",
    name: "API Endpoint Monitoring",
    description: "Regularly test API endpoints and alert on failures",
    template: {
      schedule: {
        type: "interval",
        interval: "{{checkInterval}}"
      },
      input: {
        endpoint: "{{endpoint}}",
        method: "{{method}}",
        expectedStatusCode: "{{expectedStatusCode}}",
        timeout: "{{timeout}}"
      },
      output: {
        eventName: "api_check_complete",
        outputMapping: {
          status: "$.result.status",
          responseTime: "$.result.responseTime",
          statusCode: "$.result.statusCode"
        }
      }
    },
    variables: [
      {
        name: "checkInterval",
        description: "Interval between checks",
        type: "string",
        default: "5m"
      },
      {
        name: "endpoint",
        description: "API endpoint to check",
        type: "string",
        required: true
      },
      {
        name: "method",
        description: "HTTP method to use",
        type: "string",
        enum: ["GET", "POST", "PUT", "DELETE"],
        default: "GET"
      },
      {
        name: "expectedStatusCode",
        description: "Expected HTTP status code",
        type: "number",
        default: 200
      },
      {
        name: "timeout",
        description: "Request timeout",
        type: "string",
        default: "10s"
      }
    ]
  }
];

export default eventTaskTemplates;