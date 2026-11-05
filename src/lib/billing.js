// Grace period after an invoice's due date before an account is treated as overdue.
export const GRACE_PERIOD_DAYS = 7

export const INVOICE_CATEGORIES = [
  'Software Development',
  'Database',
  'Hosting',
  'Domain Name',
  'Third-Party Services',
  'Security & Compliance Checks',
  'Testing & QA',
  'Deployment',
  'Support & Maintenance',
  'Consulting',
  'Other',
]

export const BILLING_TYPE_LABELS = {
  one_time: 'One-Time',
  recurring: 'Monthly Recurring',
}

export function daysPastDue(dueDate) {
  const due = new Date(dueDate)
  const today = new Date()
  due.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  return Math.round((today - due) / (1000 * 60 * 60 * 24))
}

export function isInvoiceOverdue(invoice) {
  return invoice.status === 'unpaid' && daysPastDue(invoice.due_date) > GRACE_PERIOD_DAYS
}

// A client is suspended when: an admin has forced suspension, OR they have an
// overdue unpaid invoice and the admin hasn't force-reactivated them.
export function computeClientStatus(client, invoices) {
  const clientInvoices = invoices.filter((invoice) => invoice.client_id === client.id)
  const overdueInvoices = clientInvoices.filter(isInvoiceOverdue)
  const hasOverdue = overdueInvoices.length > 0

  let isSuspended
  if (client.suspension_override === 'force_suspended') {
    isSuspended = true
  } else if (client.suspension_override === 'force_active') {
    isSuspended = false
  } else {
    isSuspended = hasOverdue
  }

  const outstandingBalance = clientInvoices
    .filter((invoice) => invoice.status === 'unpaid')
    .reduce((sum, invoice) => sum + Number(invoice.amount), 0)

  return {
    isSuspended,
    hasOverdue,
    overdueInvoices,
    outstandingBalance,
  }
}

export function computeItemsTotal(items) {
  return items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
}

export function formatMoney(amount, currency = 'USD') {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(Number(amount) || 0)
  } catch {
    return `${currency} ${(Number(amount) || 0).toFixed(2)}`
  }
}

export function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date) {
  if (!date) return '—'
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}
