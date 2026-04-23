import React, { createContext, useContext, useEffect, useState } from 'react'
import { Invoice, InvoiceStatus, CreateInvoiceInput } from '../types'
import { v4 as uuidv4 } from 'uuid'
import { formatDate } from '../utils/dateUtils'

interface InvoiceContextType {
  invoices: Invoice[]
  addInvoice: (data: CreateInvoiceInput) => void
  updateInvoice: (id: string, data: Partial<Invoice>) => void
  deleteInvoice: (id: string) => void
  getInvoice: (id: string) => Invoice | undefined
  markAsPaid: (id: string) => void
  filterByStatus: (status: InvoiceStatus | null) => Invoice[]
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined)

const STORAGE_KEY = 'invoices'

const SAMPLE_INVOICES: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'RT3080',
    clientName: 'Jensen Huang',
    clientEmail: 'jensen@example.com',
    clientAddress: '123 Main St',
    dueDate: '2024-08-19',
    createdAt: '2024-08-12',
    items: [
      { id: '1', description: 'Web Design', quantity: 1, price: 1800.90, total: 1800.90 },
    ],
    total: 1800.90,
    status: 'paid',
  },
  {
    id: 'inv-2',
    invoiceNumber: 'XM9141',
    clientName: 'Alex Grim',
    clientEmail: 'alex@example.com',
    clientAddress: '456 Oak Ave',
    dueDate: '2024-09-20',
    createdAt: '2024-09-13',
    items: [
      { id: '1', description: 'Logo Design', quantity: 1, price: 556.00, total: 556.00 },
    ],
    total: 556.00,
    status: 'pending',
  },
  {
    id: 'inv-3',
    invoiceNumber: 'RG0314',
    clientName: 'John Morrison',
    clientEmail: 'john@example.com',
    clientAddress: '789 Pine Rd',
    dueDate: '2024-10-01',
    createdAt: '2024-09-24',
    items: [
      { id: '1', description: 'Development', quantity: 5, price: 2800.66, total: 14003.33 },
    ],
    total: 14003.33,
    status: 'paid',
  },
  {
    id: 'inv-4',
    invoiceNumber: 'RT2080',
    clientName: 'Alysa Werner',
    clientEmail: 'alysa@example.com',
    clientAddress: '321 Elm St',
    dueDate: '2024-10-12',
    createdAt: '2024-10-05',
    items: [
      { id: '1', description: 'Consulting', quantity: 1, price: 102.04, total: 102.04 },
    ],
    total: 102.04,
    status: 'pending',
  },
  {
    id: 'inv-5',
    invoiceNumber: 'AA1449',
    clientName: 'Mellisa Clarke',
    clientEmail: 'mellisa@example.com',
    clientAddress: '654 Birch Ln',
    dueDate: '2024-10-14',
    createdAt: '2024-10-07',
    items: [
      { id: '1', description: 'UI Design', quantity: 2, price: 2016.17, total: 4032.33 },
    ],
    total: 4032.33,
    status: 'pending',
  },
  {
    id: 'inv-6',
    invoiceNumber: 'TY9141',
    clientName: 'Thomas Wayne',
    clientEmail: 'thomas@example.com',
    clientAddress: '987 Cedar Dr',
    dueDate: '2024-10-31',
    createdAt: '2024-10-24',
    items: [
      { id: '1', description: 'Development', quantity: 3, price: 2051.97, total: 6155.91 },
    ],
    total: 6155.91,
    status: 'pending',
  },
  {
    id: 'inv-7',
    invoiceNumber: 'FV2353',
    clientName: 'Anita Wainwright',
    clientEmail: 'anita@example.com',
    clientAddress: '147 Walnut Ct',
    dueDate: '2024-11-12',
    createdAt: '2024-11-05',
    items: [
      { id: '1', description: 'Branding', quantity: 1, price: 3102.04, total: 3102.04 },
    ],
    total: 3102.04,
    status: 'draft',
  },
]

export function InvoiceProvider({ children }: { children: React.ReactNode }) {
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : SAMPLE_INVOICES
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices))
  }, [invoices])

  const addInvoice = (data: CreateInvoiceInput) => {
    const newInvoice: Invoice = {
      id: uuidv4(),
      invoiceNumber: `INV-${Date.now()}`,
      ...data,
      createdAt: formatDate(new Date()),
    }
    setInvoices([...invoices, newInvoice])
  }

  const updateInvoice = (id: string, data: Partial<Invoice>) => {
    setInvoices(invoices.map(inv => (inv.id === id ? { ...inv, ...data } : inv)))
  }

  const deleteInvoice = (id: string) => {
    setInvoices(invoices.filter(inv => inv.id !== id))
  }

  const getInvoice = (id: string) => {
    return invoices.find(inv => inv.id === id)
  }

  const markAsPaid = (id: string) => {
    updateInvoice(id, { status: 'paid' })
  }

  const filterByStatus = (status: InvoiceStatus | null) => {
    return status ? invoices.filter(inv => inv.status === status) : invoices
  }

  return (
    <InvoiceContext.Provider
      value={{
        invoices,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        getInvoice,
        markAsPaid,
        filterByStatus,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  )
}

export function useInvoice() {
  const context = useContext(InvoiceContext)
  if (!context) {
    throw new Error('useInvoice must be used within InvoiceProvider')
  }
  return context
}
