import { InvoiceStatus } from '../types'

interface StatusBadgeProps {
  status: InvoiceStatus
  variant?: 'small' | 'large'
}

export function StatusBadge({ status, variant = 'small' }: StatusBadgeProps) {
  const styles = {
    paid: {
      bg: 'bg-teal-100 dark:bg-teal-900',
      text: 'text-teal-600 dark:text-teal-200',
      dot: 'bg-teal-500',
    },
    pending: {
      bg: 'bg-amber-100 dark:bg-amber-900',
      text: 'text-amber-600 dark:text-amber-200',
      dot: 'bg-amber-500',
    },
    draft: {
      bg: 'bg-gray-200 dark:bg-gray-700',
      text: 'text-gray-700 dark:text-gray-300',
      dot: 'bg-gray-500',
    },
  }

  const style = styles[status]
  const label = status.charAt(0).toUpperCase() + status.slice(1)
  const size = variant === 'large' ? 'px-6 py-2 text-sm' : 'px-3 py-1 text-xs'

  return (
    <div className={`${style.bg} ${style.text} ${size} rounded-full font-medium flex items-center gap-2 w-fit`}>
      <span className={`${style.dot} w-2 h-2 rounded-full`}></span>
      {label}
    </div>
  )
}
