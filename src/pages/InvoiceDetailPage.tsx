import { useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiEdit2, FiTrash2, FiDownload } from 'react-icons/fi'
import { useInvoice } from '../context/InvoiceContext'
import { StatusBadge } from '../components/StatusBadge'
import { formatDateDisplay } from '../utils/dateUtils'
import { useState } from 'react'

export function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getInvoice, deleteInvoice, markAsPaid } = useInvoice()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const invoice = id ? getInvoice(id) : undefined

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-8 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Invoice not found</p>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:text-primary/80 font-medium"
          >
            Back to invoices
          </button>
        </div>
      </div>
    )
  }

  const handleDelete = () => {
    deleteInvoice(invoice.id)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors self-start"
          >
            <FiArrowLeft size={20} />
            Back
          </button>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-4">
            <button
              onClick={() => navigate(`/edit/${invoice.id}`)}
              className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 rounded-lg transition-colors border border-gray-200 dark:border-slate-700 text-sm md:text-base"
            >
              <FiEdit2 size={18} />
              <span className="hidden md:inline">Edit</span>
            </button>
            {invoice.status === 'pending' && (
              <button
                onClick={() => markAsPaid(invoice.id)}
                className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm md:text-base"
              >
                Mark as Paid
              </button>
            )}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm md:text-base"
            >
              <FiTrash2 size={18} />
              <span className="hidden md:inline">Delete</span>
            </button>
            <button className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm md:text-base">
              <FiDownload size={18} />
              <span className="hidden md:inline">Download</span>
            </button>
          </div>
        </div>

        {/* Invoice Card */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-slate-700">
          {/* Invoice Info */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  #{invoice.invoiceNumber}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Created {formatDateDisplay(invoice.createdAt)}
                </p>
              </div>
              <StatusBadge status={invoice.status} variant="large" />
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Bill To
                </h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  {invoice.clientName}
                </p>
                <p className="text-gray-600 dark:text-gray-400">{invoice.clientEmail}</p>
                <p className="text-gray-600 dark:text-gray-400">{invoice.clientAddress}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Invoice Details
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Due:</span> {formatDateDisplay(invoice.dueDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">
                    Item Description
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">
                    QTY
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">
                    Price
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={idx !== invoice.items.length - 1 ? 'border-b border-gray-200 dark:border-slate-700' : ''}
                  >
                    <td className="py-3 px-4 text-gray-900 dark:text-white">
                      {item.description}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400">
                      £ {item.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-900 dark:text-white">
                      £ {item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total */}
          <div className="flex justify-end mb-8">
            <div className="bg-primary/10 dark:bg-primary/5 px-6 py-3 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                £ {invoice.total.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Notes
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-sm w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Delete Invoice?
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete invoice #{invoice.invoiceNumber}? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
