/**
 * Format numbers in Indian Rupee format (e.g. ₹1,24,500 or ₹1,24,500.50)
 */
export const formatINR = (amount, showDecimals = false) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }

  const num = Number(amount);
  const isNegative = num < 0;
  const absNum = Math.abs(num);

  const formatted = absNum.toLocaleString('en-IN', {
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0,
  });

  return `${isNegative ? '-' : ''}₹${formatted}`;
};

export const formatPercentage = (val) => {
  if (val === undefined || val === null || isNaN(val)) return '0.0%';
  return `${Number(val).toFixed(1)}%`;
};

export const formatDate = (dateString, formatType = 'medium') => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  if (formatType === 'short') {
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  }

  if (formatType === 'month-year') {
    return date.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
  }

  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};
