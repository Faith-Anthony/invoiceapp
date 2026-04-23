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
        {/* Go Back */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors mb-8 text-sm"
        >
          <FiArrowLeft size={18} />
          Go back
        </button>

        {/* Header with Status and Actions */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 md:p-8 mb-8 border border-gray-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Status</p>
              <StatusBadge status={invoice.status} variant="large" />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => navigate(`/edit/${invoice.id}`)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600 rounded-lg transition-colors text-sm font-medium"
              >
                <FiEdit2 size={18} />
                Edit
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors text-sm font-medium"
              >
                <FiTrash2 size={18} />
                Delete
              </button>
              {invoice.status === 'pending' && (
                <button
                  onClick={() => markAsPaid(invoice.id)}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Mark as Paid
                </button>
              )}
              <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 rounded-lg transition-colors text-sm font-medium">
                <FiDownload size={18} />
                Download
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Content */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 md:p-8 border border-gray-200 dark:border-slate-700">
          {/* Invoice Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-gray-200 dark:border-slate-700">
            {/* Invoice Number and Description */}
            <div className="md:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                #{invoice.invoiceNumber}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {invoice.items[0]?.description || 'Invoice'}
              </p>
            </div>

            {/* Invoice Dates */}
            <div className="md:col-span-1">
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">
                  Invoice Date
                </p>
                <p className="text-sm text-gray-900 dark:text-white font-medium">
                  {formatDateDisplay(invoice.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-1">
                  Payment Due
                </p>
                <p className="text-sm text-gray-900 dark:text-white font-medium">
                  {formatDateDisplay(invoice.dueDate)}
                </p>
              </div>
            </div>

            {/* Bill To */}
            <div className="md:col-span-1">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">
                Bill To
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                {invoice.clientName}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                {invoice.clientAddress}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {invoice.clientEmail}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-slate-700">
                  <th className="text-left py-3 px-0 font-semibold text-gray-600 dark:text-gray-400 text-sm">
                    Item Name
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-600 dark:text-gray-400 text-sm">
                    QTY
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400 text-sm">
                    Price
                  </th>
                  <th className="text-right py-3 px-0 font-semibold text-gray-600 dark:text-gray-400 text-sm">
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
                    <td className="py-3 px-0 text-gray-900 dark:text-white text-sm">
                      {item.description}
                    </td>
                    <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-400 text-sm">
                      {item.quantity}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-600 dark:text-gray-400 text-sm">
                      £ {item.price.toFixed(2)}
                    </td>
                    <td className="py-3 px-0 text-right font-semibold text-gray-900 dark:text-white text-sm">
                      £ {item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Amount Due Section */}
          <div className="bg-slate-800 dark:bg-slate-900 text-white p-6 rounded-lg flex items-center justify-between">
            <p className="text-sm font-medium text-gray-300">Amount Due</p>
            <p className="text-3xl font-bold">
              £ {invoice.total.toFixed(2)}
            </p>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-slate-700">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3">
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
