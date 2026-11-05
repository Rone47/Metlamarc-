export const QUOTE_STATUS_LABELS = {
  draft: 'Draft',
  sent: 'Sent',
  accepted: 'Accepted',
  declined: 'Declined',
  expired: 'Expired',
}

export function computeQuoteTotals(items, discountType, discountValue) {
  const subtotal = items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  const rawDiscount = Number(discountValue) || 0

  let discountAmount = 0
  if (discountType === 'percent') {
    discountAmount = subtotal * (Math.min(Math.max(rawDiscount, 0), 100) / 100)
  } else if (discountType === 'fixed') {
    discountAmount = Math.min(Math.max(rawDiscount, 0), subtotal)
  }

  return {
    subtotal,
    discountAmount,
    total: subtotal - discountAmount,
  }
}

export function isQuoteExpired(quote) {
  if (!quote.valid_until) return false
  if (quote.status === 'accepted' || quote.status === 'declined') return false
  const validUntil = new Date(quote.valid_until)
  validUntil.setHours(23, 59, 59, 999)
  return validUntil < new Date()
}
