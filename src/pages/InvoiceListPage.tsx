import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPlus } from 'react-icons/fi'
import { useInvoice } from '../context/InvoiceContext'
import { InvoiceStatus } from '../types'
import { Filter } from '../components/Filter'
import { InvoiceListItem } from '../components/InvoiceListItem'
import { EmptyState } from '../components/EmptyState'

export function InvoiceListPage() {
  const { invoices, filterByStatus } = useInvoice()
  const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus | null>(null)

  const filteredInvoices = selectedStatus
    ? filterByStatus(selectedStatus)
    : invoices

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 sm:p-5 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Invoices
            </h1>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              There are {filteredInvoices.length} total invoices
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
              <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full text-primary">
                <FiPlus size={20} />
              </div>
              <span className="hidden md:inline">New Invoice</span>
              <span className="md:hidden">New</span>
            </Link>
          </div>
        </div>

        {/* Invoice List */}
        {filteredInvoices.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
            {filteredInvoices.map(invoice => (
              <InvoiceListItem key={invoice.id} invoice={invoice} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  )
}
