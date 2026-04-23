import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { InvoiceStatus } from '../types'

interface FilterProps {
  onStatusChange: (status: InvoiceStatus | null) => void
  selectedStatus: InvoiceStatus | null
}

export function Filter({ onStatusChange, selectedStatus }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const statuses: (InvoiceStatus | null)[] = [null, 'draft', 'pending', 'paid']
  const labels: Record<string, string> = {
    null: 'Filter by status',
    draft: 'Draft',
    pending: 'Pending',
    paid: 'Paid',
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors border border-gray-200 dark:border-slate-700"
      >
        <span className="text-sm font-medium">{labels[String(selectedStatus)]}</span>
        <FiChevronDown
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-10">
          {statuses.map(status => (
            <button
              key={String(status)}
              onClick={() => {
                onStatusChange(status)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                selectedStatus === status
                  ? 'bg-primary text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            >
              {labels[String(status)]}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
