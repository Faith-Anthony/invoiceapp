import { jsPDF } from 'jspdf'
import { Invoice } from '../types'
import { formatDateDisplay } from './dateUtils'

export function generateInvoicePDF(invoice: Invoice) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  let yPosition = margin

  // Colors
  const primaryColor = [124, 58, 237] // #7C3AED
  const darkColor = [45, 46, 68] // #2D2E44
  const lightGray = [107, 114, 128] // #6B7280

  // Helper function to add text
  const addText = (
    text: string,
    x: number,
    y: number,
    options: { fontSize?: number; fontStyle?: 'bold' | 'normal'; color?: number[] } = {}
  ) => {
    const { fontSize = 10, fontStyle = 'normal', color = [0, 0, 0] } = options
    doc.setFontSize(fontSize)
    doc.setTextColor(color[0], color[1], color[2])
    doc.setFontStyle(fontStyle)
    doc.text(text, x, y)
  }

  // Header - Invoice Title
  addText(`INVOICE`, margin, yPosition, { fontSize: 24, fontStyle: 'bold', color: darkColor })
  yPosition += 15

  // Invoice details in two columns
  addText(`Invoice #`, margin, yPosition, { fontSize: 10, color: lightGray })
  addText(`${invoice.invoiceNumber}`, margin, yPosition + 5, { fontSize: 12, fontStyle: 'bold' })

  addText(`Status`, pageWidth - margin - 40, yPosition, { fontSize: 10, color: lightGray })
  addText(`${invoice.status.toUpperCase()}`, pageWidth - margin - 40, yPosition + 5, {
    fontSize: 12,
    fontStyle: 'bold',
    color: primaryColor,
  })

  yPosition += 20

  // Bill From Section
  addText(`Bill From`, margin, yPosition, { fontSize: 11, fontStyle: 'bold', color: darkColor })
  yPosition += 6
  addText(`Your Company`, margin, yPosition, { fontSize: 10 })
  yPosition += 5
  addText(`email@company.com`, margin, yPosition, { fontSize: 10 })
  yPosition += 5
  addText(`123 Business St`, margin, yPosition, { fontSize: 10 })
  yPosition += 5
  addText(`New York, NY 10001, USA`, margin, yPosition, { fontSize: 10 })

  // Bill To Section
  const billToX = pageWidth / 2 + 10
  addText(`Bill To`, billToX, yPosition - 20, { fontSize: 11, fontStyle: 'bold', color: darkColor })
  yPosition = yPosition - 20 + 6
  addText(`${invoice.clientName}`, billToX, yPosition, { fontSize: 10 })
  yPosition += 5
  addText(`${invoice.clientEmail}`, billToX, yPosition, { fontSize: 10 })
  yPosition += 5
  addText(`${invoice.clientAddress}`, billToX, yPosition, { fontSize: 10 })
  yPosition += 5
  const clientCity = `${invoice.clientCity || ''} ${invoice.clientPostalCode || ''} ${invoice.clientCountry || ''}`.trim()
  if (clientCity) {
    addText(clientCity, billToX, yPosition, { fontSize: 10 })
    yPosition += 5
  }

  // Invoice Dates
  yPosition += 10
  addText(`Invoice Date`, margin, yPosition, { fontSize: 10, color: lightGray })
  addText(formatDateDisplay(invoice.createdAt), margin, yPosition + 5, { fontSize: 10, fontStyle: 'bold' })

  addText(`Due Date`, pageWidth / 2 + 10, yPosition, { fontSize: 10, color: lightGray })
  addText(formatDateDisplay(invoice.dueDate), pageWidth / 2 + 10, yPosition + 5, { fontSize: 10, fontStyle: 'bold' })

  yPosition += 20

  // Items Table Header
  const colX = [margin, margin + 80, pageWidth - margin - 50, pageWidth - margin - 20]
  doc.setFontSize(10)
  doc.setFont(undefined, 'bold')
  doc.setTextColor(255, 255, 255)
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F')

  addText(`Item Description`, colX[0], yPosition, { fontSize: 10, fontStyle: 'bold', color: [255, 255, 255] })
  addText(`QTY`, colX[1], yPosition, { fontSize: 10, fontStyle: 'bold', color: [255, 255, 255] })
  addText(`Price`, colX[2], yPosition, { fontSize: 10, fontStyle: 'bold', color: [255, 255, 255] })
  addText(`Total`, colX[3], yPosition, { fontSize: 10, fontStyle: 'bold', color: [255, 255, 255] })

  yPosition += 12

  // Items
  invoice.items.forEach((item, idx) => {
    const itemY = yPosition
    addText(item.description, colX[0], itemY, { fontSize: 9 })
    addText(`${item.quantity}`, colX[1], itemY, { fontSize: 9 })
    addText(`£ ${item.price.toFixed(2)}`, colX[2], itemY, { fontSize: 9 })
    addText(`£ ${item.total.toFixed(2)}`, colX[3], itemY, { fontSize: 9, fontStyle: 'bold' })

    // Alternating row background
    if (idx % 2 === 0) {
      doc.setFillColor(240, 241, 245)
      doc.rect(margin, itemY - 4, pageWidth - 2 * margin, 6, 'F')
    }

    yPosition += 8
  })

  yPosition += 10

  // Total Section
  doc.setFillColor(45, 46, 68)
  doc.rect(margin, yPosition - 3, pageWidth - 2 * margin, 12, 'F')

  addText(`Amount Due`, margin + 5, yPosition + 3, { fontSize: 11, fontStyle: 'bold', color: [255, 255, 255] })
  addText(`£ ${invoice.total.toFixed(2)}`, pageWidth - margin - 20, yPosition + 3, {
    fontSize: 14,
    fontStyle: 'bold',
    color: [255, 255, 255],
  })

  yPosition += 20

  // Notes
  if (invoice.notes) {
    addText(`Notes`, margin, yPosition, { fontSize: 10, fontStyle: 'bold', color: darkColor })
    yPosition += 6
    const noteLines = doc.splitTextToSize(invoice.notes, pageWidth - 2 * margin)
    noteLines.forEach((line: string) => {
      addText(line, margin, yPosition, { fontSize: 9 })
      yPosition += 4
    })
  }

  // Footer
  yPosition = pageHeight - 15
  doc.setTextColor(lightGray[0], lightGray[1], lightGray[2])
  doc.setFontSize(8)
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, yPosition)

  // Save the PDF
  doc.save(`Invoice-${invoice.invoiceNumber}.pdf`)
}
