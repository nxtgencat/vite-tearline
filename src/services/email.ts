import { delay } from './api'

export async function sendEmail(kind: 'appointment_confirm' | 'appointment_cancel' | 'lab_ready' | 'billing' | 'prescription', to: string, data: Record<string, string>) {
  await delay(600)
  // mock – in prod: emailjs.send(service, template, data)
  console.log(`[EmailJS mock] ${kind} -> ${to}`, data)
  return { ok: true }
}
