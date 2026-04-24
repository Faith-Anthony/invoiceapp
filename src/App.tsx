import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { InvoiceProvider } from './context/InvoiceContext'
import { Sidebar } from './components/Sidebar'
import { InvoiceListPage } from './pages/InvoiceListPage'
import { InvoiceDetailPage } from './pages/InvoiceDetailPage'
import { InvoiceFormPage } from './pages/InvoiceFormPage'

function App() {
  return (
    <ThemeProvider>
      <InvoiceProvider>
        <Router>
          <div className="w-full flex flex-col lg:flex-row min-h-screen dark:bg-slate-900">
            <Sidebar />
            <main className="flex-1 w-full lg:ml-[100px]">
              <Routes>
                <Route path="/" element={<InvoiceListPage />} />
                <Route path="/invoice/:id" element={<InvoiceDetailPage />} />
                <Route path="/create" element={<InvoiceFormPage />} />
                <Route path="/edit/:id" element={<InvoiceFormPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </InvoiceProvider>
    </ThemeProvider>
  )
}

export default App
