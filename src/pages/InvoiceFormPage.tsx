import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiTrash2, FiPlus } from 'react-icons/fi'
import { useInvoice } from '../context/InvoiceContext'
import { InvoiceItem, CreateInvoiceInput } from '../types'
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
        clientCity: existingInvoice.clientCity || '',
        clientPostalCode: existingInvoice.clientPostalCode || '',
        clientCountry: existingInvoice.clientCountry || '',
        dueDate: existingInvoice.dueDate,
        items: existingInvoice.items,
        status: existingInvoice.status,
        notes: existingInvoice.notes || '',
        total: existingInvoice.total,
      }
    }
    return {
      clientName: '',
      clientEmail: '',
      clientAddress: '',
      clientCity: '',
      clientPostalCode: '',
      clientCountry: '',
      dueDate: '',
      items: [{ id: uuidv4(), description: '', quantity: 1, price: 0, total: 0 }],
      status: 'draft',
      notes: '',
      total: 0,
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 sm:p-5 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-6 text-sm"
          >
            <FiArrowLeft size={18} />
            Go back
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEditing ? `Edit - ${existingInvoice?.invoiceNumber}` : 'New Invoice'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bill From Section */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Bill From
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Company
                </label>
                <input
                  type="text"
                  placeholder="Your Company Name"
                  defaultValue="My Company"
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  disabled
                  defaultValue="your@email.com"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="Your Address"
                  disabled
                  defaultValue="123 Main Street"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  placeholder="City"
                  disabled
                  defaultValue="London"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  placeholder="Postal Code"
                  disabled
                  defaultValue="E1 2IZ"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  placeholder="Country"
                  disabled
                  defaultValue="United Kingdom"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Bill To Section */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Bill To
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="sm:col-span-2 md:col-span-3">
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

              <div className="sm:col-span-2 md:col-span-3">
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

              <div className="sm:col-span-2 md:col-span-3">
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
                  City
                </label>
                <input
                  type="text"
                  name="clientCity"
                  placeholder="City"
                  value={formData.clientCity || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="clientPostalCode"
                  placeholder="Postal Code"
                  value={formData.clientPostalCode || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="clientCountry"
                  placeholder="Country"
                  value={formData.clientCountry || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Invoice Dates Section */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Invoice Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Invoice Date
                </label>
                <input
                  type="date"
                  disabled
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                />
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

          {/* Item List Section */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-gray-200 dark:border-slate-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Item List
            </h2>

            {errors.items && (
              <p className="text-red-600 dark:text-red-400 text-sm mb-4">{errors.items}</p>
            )}

            <div className="space-y-3 mb-4">
              {formData.items.map((item, idx) => (
                <div key={item.id} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-12 gap-2 items-end">
                  <input
                    type="text"
                    placeholder="Item name"
                    value={item.description}
                    onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                    className="col-span-2 sm:col-span-3 md:col-span-4 px-3 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />

                  <div className="col-span-1 sm:col-span-1 md:col-span-2">
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
                      } bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm`}
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-1 md:col-span-2">
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
                      } bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm`}
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1 md:col-span-2 flex items-center justify-between">
                    <span className="text-gray-900 dark:text-white font-medium text-sm">
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

            <button
              type="button"
              onClick={addItem}
              className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1 mb-6"
            >
              <FiPlus size={16} />
              Add Item Row
            </button>

            {/* Total Section */}
            <div className="border-t border-gray-200 dark:border-slate-700 pt-4 flex justify-end">
              <div className="bg-slate-800 dark:bg-slate-900 text-white px-6 py-3 rounded-lg">
                <p className="text-sm text-gray-300 mb-1">Total</p>
                <p className="text-2xl font-bold">£ {total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 sm:justify-end">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-2 sm:px-6 sm:py-2 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600 rounded-lg font-medium transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 sm:px-6 sm:py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors text-sm sm:text-base"
            >
              {isEditing ? 'Save Changes' : 'Save Invoice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
