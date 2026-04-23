export type InvoiceStatus = 'draft' | 'pending' | 'paid'

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  price: number
  total: number
}

export interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  clientEmail: string
  clientAddress: string
  dueDate: string
  createdAt: string
  items: InvoiceItem[]
  total: number
  status: InvoiceStatus
  notes?: string
}

export interface CreateInvoiceInput {
  clientName: string
  clientEmail: string
  clientAddress: string
  dueDate: string
  items: InvoiceItem[]
  status: InvoiceStatus
  notes?: string
}
