import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import { useInvoice } from '../context/InvoiceContext'
import { InvoiceStatus } from '../types'
import { Filter } from '../components/Filter'
import { InvoiceListItem } from '../components/InvoiceListItem'

export function InvoiceListPage() {
  const { invoices, filterByStatus } = useInvoice()
  const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus | null>(null)

  const filteredInvoices = selectedStatus
    ? filterByStatus(selectedStatus)
    : invoices

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Invoices
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              There are {invoices.length} total invoices
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            <div className="flex-1 md:flex-none">
              <Filter onStatusChange={setSelectedStatus} selectedStatus={selectedStatus} />
            </div>
            <Link
              to="/create"
              className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-full font-medium transition-colors shadow-lg hover:shadow-xl text-sm md:text-base"
            >
              <FiPlus size={20} />
              <span className="hidden md:inline">New Invoice</span>
              <span className="md:hidden">New</span>
            </Link>
          </div>
        </div>

        {/* Invoice List */}
        <div className="space-y-3 md:space-y-4">
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map(invoice => (
              <InvoiceListItem key={invoice.id} invoice={invoice} />
            ))
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No invoices found
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
