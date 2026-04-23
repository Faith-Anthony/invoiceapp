import { Link } from 'react-router-dom'
import { FiChevronRight } from 'react-icons/fi'
import { Invoice } from '../types'
import { StatusBadge } from './StatusBadge'
import { formatDateDisplay } from '../utils/dateUtils'

interface InvoiceListItemProps {
  invoice: Invoice
}

export function InvoiceListItem({ invoice }: InvoiceListItemProps) {
  return (
    <Link
      to={`/invoice/${invoice.id}`}
      className="block p-4 md:p-6 bg-white dark:bg-slate-800 rounded-lg hover:shadow-md dark:hover:shadow-slate-900 transition-all hover:scale-105 transform duration-200 border border-transparent hover:border-primary/20 dark:border-slate-700"
    >
      <div className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center">
        {/* Mobile Layout */}
        <div className="md:hidden w-full">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                #{invoice.invoiceNumber}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Due {formatDateDisplay(invoice.dueDate)}
              </p>
            </div>
            <FiChevronRight size={20} className="text-gray-400 dark:text-gray-600" />
          </div>
          <p className="text-sm text-primary font-medium mb-2">
            {invoice.clientName}
          </p>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-gray-900 dark:text-white">
              £ {invoice.total.toFixed(2)}
            </p>
            <StatusBadge status={invoice.status} />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:col-span-2 md:block">
          <p className="font-semibold text-gray-900 dark:text-white">#{invoice.invoiceNumber}</p>
        </div>

        <div className="hidden md:col-span-2 md:block">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Due {formatDateDisplay(invoice.dueDate)}
          </p>
        </div>

        <div className="hidden md:col-span-2 md:block">
          <p className="text-sm text-primary hover:text-primary/80 font-medium">
            {invoice.clientName}
          </p>
        </div>

        <div className="hidden md:col-span-2 md:block">
          <p className="font-semibold text-gray-900 dark:text-white">
            £ {invoice.total.toFixed(2)}
          </p>
        </div>

        <div className="hidden md:col-span-2 md:flex md:justify-center">
          <StatusBadge status={invoice.status} />
        </div>

        <div className="hidden md:col-span-2 md:flex md:justify-end">
          <FiChevronRight
            size={20}
            className="text-gray-400 dark:text-gray-600 group-hover:text-primary transition-colors"
          />
        </div>
      </div>
    </Link>
  )
}
