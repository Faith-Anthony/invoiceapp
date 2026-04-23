import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiTrash2, FiPlus } from 'react-icons/fi'
import { useInvoice } from '../context/InvoiceContext'
import { Invoice, InvoiceItem, CreateInvoiceInput } from '../types'
import { v4 as uuidv4 } from 'uuid'

export function InvoiceFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { getInvoice, addInvoice, updateInvoice } = useInvoice()
  const isEditing = !!id

  const existingInvoice = isEditing && id ? getInvoice(id) : null

  const [formData, setFormData] = useState<CreateInvoiceInput>(() => {
    if (existingInvoice) {
      return {
        clientName: existingInvoice.clientName,
        clientEmail: existingInvoice.clientEmail,
        clientAddress: existingInvoice.clientAddress,
        dueDate: existingInvoice.dueDate,
        items: existingInvoice.items,
        status: existingInvoice.status,
        notes: existingInvoice.notes,
      }
    }
    return {
      clientName: '',
      clientEmail: '',
      clientAddress: '',
      dueDate: '',
      items: [{ id: uuidv4(), description: '', quantity: 1, price: 0, total: 0 }],
      status: 'draft',
      notes: '',
    }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.clientName.trim()) newErrors.clientName = 'Client name is required'
    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Valid email is required'
    }
    if (!formData.clientAddress.trim()) newErrors.clientAddress = 'Address is required'
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required'

    const validItems = formData.items.filter(item => item.description.trim())
    if (validItems.length === 0) {
      newErrors.items = 'At least one item is required'
    }

    validItems.forEach((item, idx) => {
      if (item.quantity <= 0) newErrors[`quantity-${idx}`] = 'Quantity must be positive'
      if (item.price < 0) newErrors[`price-${idx}`] = 'Price must be positive'
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const newItems = [...formData.items]
    const item = newItems[index]

    if (field === 'quantity' || field === 'price') {
      newItems[index] = {
        ...item,
        [field]: Number(value),
        total: field === 'quantity' ? Number(value) * item.price : item.quantity * Number(value),
      }
    } else {
      newItems[index] = { ...item, [field]: value }
    }

    setFormData(prev => ({ ...prev, items: newItems }))
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { id: uuidv4(), description: '', quantity: 1, price: 0, total: 0 },
      ],
    }))
  }

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    if (isEditing && existingInvoice) {
      updateInvoice(existingInvoice.id, {
        ...formData,
        total: formData.items.reduce((sum, item) => sum + item.total, 0),
      })
    } else {
      addInvoice({
        ...formData,
        total: formData.items.reduce((sum, item) => sum + item.total, 0),
      })
    }

    navigate('/')
  }

  const total = formData.items.reduce((sum, item) => sum + item.total, 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6"
          >
            <FiArrowLeft size={20} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Invoice' : 'Create Invoice'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Client Info */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Client Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.clientName
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                  } text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary`}
                />
                {errors.clientName && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                    {errors.clientName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.clientEmail
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                  } text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary`}
                />
                {errors.clientEmail && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                    {errors.clientEmail}
                  </p>
                )}
              </div>

              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="clientAddress"
                  value={formData.clientAddress}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.clientAddress
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                  } text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary`}
                />
                {errors.clientAddress && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                    {errors.clientAddress}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.dueDate
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                  } text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary`}
                />
                {errors.dueDate && (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                    {errors.dueDate}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-gray-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Invoice Items
              </h2>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
              >
                <FiPlus size={18} />
                Add Item
              </button>
            </div>

            {errors.items && (
              <p className="text-red-600 dark:text-red-400 text-sm mb-4">{errors.items}</p>
            )}

            <div className="space-y-4">
              {formData.items.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-3">
                  <input
                    type="text"
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    className="col-span-1 md:col-span-4 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                  <div className="col-span-1 md:col-span-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        errors[`quantity-${idx}`]
                          ? 'border-red-500'
                          : 'border-gray-300 dark:border-slate-600'
                      } bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary`}
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <input
                      type="number"
                      placeholder="Price"
                      step="0.01"
                      min="0"
                      value={item.price}
                      onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border ${
                        errors[`price-${idx}`]
                          ? 'border-red-500'
                          : 'border-gray-300 dark:border-slate-600'
                      } bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary`}
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 flex items-center justify-between">
                    <span className="text-gray-900 dark:text-white font-medium">
                      £ {item.total.toFixed(2)}
                    </span>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700 flex justify-end">
              <div className="bg-primary/10 dark:bg-primary/5 px-6 py-3 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  £ {total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-gray-200 dark:border-slate-700">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Payment terms, thanks message, etc."
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
            >
              {isEditing ? 'Update Invoice' : 'Create Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
