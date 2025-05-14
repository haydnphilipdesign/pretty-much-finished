import Airtable from 'airtable';

interface AutomationConfig {
  name: string;
  description: string;
  trigger: {
    type: 'recordCreated' | 'recordUpdated' | 'recordDeleted' | 'schedule';
    table: string;
    conditions?: Record<string, any>;
  };
  actions: Array<{
    type: string;
    params: Record<string, any>;
  }>;
}

const TRANSACTION_AUTOMATIONS: AutomationConfig[] = [
  {
    name: 'Create Commission Record and Send Cover Sheet',
    description: 'Creates a commission record and sends a PDF cover sheet when a new transaction is created',
    trigger: {
      type: 'recordCreated',
      table: 'Transactions'
    },
    actions: [
      {
        type: 'createRecord',
        params: {
          table: 'Commissions',
          fields: {
            'Commission Base': 'Sale Price',
            'Related Transaction': '{{triggerId}}'
          }
        }
      },
      {
        type: 'generatePdf',
        params: {
          template: 'coverSheet',
          data: {
            mlsNumber: '{{record.MLSNumber}}',
            address: '{{record.Address}}',
            salePrice: '{{record.SalePrice}}',
            status: '{{record.Status}}',
            clientName: '{{record.ClientName}}',
            agentName: '{{currentUser.name}}',
            submissionDate: '{{now}}'
          }
        }
      },
      {
        type: 'sendEmail',
        params: {
          to: 'debbie@parealestatesupport.com',
          subject: 'New Transaction Cover Sheet - {{record.MLSNumber}}',
          template: 'coverSheetEmail',
          attachments: ['{{lastAction.output}}'],
          data: {
            mlsNumber: '{{record.MLSNumber}}',
            address: '{{record.Address}}',
            submissionDate: '{{now}}'
          }
        }
      }
    ]
  },
  {
    name: 'Update MLS Status',
    description: 'Updates MLS when property status changes',
    trigger: {
      type: 'recordUpdated',
      table: 'Transactions',
      conditions: {
        changedFields: ['Status']
      }
    },
    actions: [
      {
        type: 'updateMls',
        params: {
          mlsNumber: '{{record.MLSNumber}}',
          status: '{{record.Status}}'
        }
      }
    ]
  }
];

const CLIENT_AUTOMATIONS: AutomationConfig[] = [
  {
    name: 'Send Welcome Email',
    description: 'Sends a welcome email when a new client is added',
    trigger: {
      type: 'recordCreated',
      table: 'Clients'
    },
    actions: [
      {
        type: 'sendEmail',
        params: {
          to: '{{record.Email}}',
          template: 'welcomeEmail',
          data: {
            clientName: '{{record.Name}}',
            agentName: '{{currentUser.name}}'
          }
        }
      }
    ]
  }
];

const COMMISSION_AUTOMATIONS: AutomationConfig[] = [
  {
    name: 'Calculate Commission Splits',
    description: 'Automatically calculates commission splits when total commission is updated',
    trigger: {
      type: 'recordUpdated',
      table: 'Commissions',
      conditions: {
        changedFields: ['Total Commission']
      }
    },
    actions: [
      {
        type: 'calculateCommission',
        params: {
          totalCommission: '{{record.TotalCommission}}',
          splits: {
            listingAgent: 0.5,
            buyersAgent: 0.5
          }
        }
      }
    ]
  }
];

export async function setupAutomations(base: Airtable.Base) {
  try {
    // Set up transaction automations
    for (const automation of TRANSACTION_AUTOMATIONS) {
      await createAutomation(base, automation);
    }

    // Set up client automations
    for (const automation of CLIENT_AUTOMATIONS) {
      await createAutomation(base, automation);
    }

    // Set up commission automations
    for (const automation of COMMISSION_AUTOMATIONS) {
      await createAutomation(base, automation);
    }

    console.log('Automations setup completed successfully');
  } catch (error) {
    console.error('Error setting up automations:', error);
    throw error;
  }
}

async function createAutomation(base: Airtable.Base, config: AutomationConfig) {
  // Implementation will use Airtable's Automation API
  // This requires appropriate API permissions and authentication
  const automation = await base.automations.create({
    name: config.name,
    description: config.description,
    trigger: config.trigger,
    actions: config.actions
  });

  return automation;
}

// Helper functions for specific automation actions
function calculateCommissionSplits(totalCommission: number, splits: Record<string, number>) {
  const results: Record<string, number> = {};
  for (const [role, percentage] of Object.entries(splits)) {
    results[role] = totalCommission * percentage;
  }
  return results;
}

function formatEmailTemplate(template: string, data: Record<string, string>) {
  let formatted = template;
  for (const [key, value] of Object.entries(data)) {
    formatted = formatted.replace(`{{${key}}}`, value);
  }
  return formatted;
}