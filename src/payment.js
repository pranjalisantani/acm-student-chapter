// Payment adapter boundary. Keep provider credentials and verification on a server.
export async function createPaymentOrder({ event, participant }) {
  return { status: 'integration_required', event: event.title, participant }
}

export async function processPayment() {
  return { status: 'integration_required' }
}

export async function verifyPayment() {
  return { status: 'integration_required' }
}

export const accessFor = () => ({ label: 'FREE', requiresPayment: false })
