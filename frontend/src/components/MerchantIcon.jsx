import React from 'react';
import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  Film, 
  Zap, 
  Home, 
  Briefcase, 
  HeartPulse, 
  Dumbbell,
  CreditCard,
  Banknote,
  Smartphone,
  Coffee,
  Ticket,
  PiggyBank,
  TrendingUp,
  Receipt,
  ShoppingCart,
  Radio
} from 'lucide-react';

/**
 * Returns brand-specific custom SVG / icon and colors based on description, merchant, or category.
 */
export const getMerchantBrand = (description = '', category = '', paymentMethod = '') => {
  const d = (description || '').toLowerCase();
  const c = (category || '').toLowerCase();
  const p = (paymentMethod || '').toLowerCase();

  // 1. Swiggy
  if (d.includes('swiggy')) {
    return {
      name: 'Swiggy',
      bg: 'bg-[#FC8019]',
      text: 'text-white',
      badge: 'Food Delivery',
      defaultPayment: 'Swiggy Pay / UPI',
      icon: ({ className = 'w-4 h-4' }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.5 2 6 4.5 6 8c0 4.5 6 14 6 14s6-9.5 6-14c0-3.5-2.5-6-6-6zm0 8.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 5.5 12 5.5s2.5 1.1 2.5 2.5S13.4 10.5 12 10.5z" />
          <path d="M10.2 11.2c.2.6.8 1 1.4 1s1.2-.4 1.4-1c.2-.5.1-1.1-.3-1.4-.4-.3-.9-.4-1.4-.3-.4.1-.9.3-1.1.7z" opacity="0.6"/>
        </svg>
      )
    };
  }

  // 2. Zomato
  if (d.includes('zomato')) {
    return {
      name: 'Zomato',
      bg: 'bg-[#E23744]',
      text: 'text-white',
      badge: 'Dining & Food',
      defaultPayment: 'Zomato UPI',
      icon: ({ className = 'w-4 h-4' }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14.2h-7.8c-.5 0-.8-.5-.6-.9l4.2-6.5h-3.4c-.4 0-.7-.3-.7-.7s.3-.7.7-.7h6.8c.5 0 .8.5.6.9l-4.2 6.5h3.6c.4 0 .7.3.7.7s-.3.7-.7.7z" />
        </svg>
      )
    };
  }

  // 3. Uber
  if (d.includes('uber')) {
    return {
      name: 'Uber',
      bg: 'bg-black text-white border border-white/20',
      text: 'text-white',
      badge: 'Rides & Travel',
      defaultPayment: 'Uber Cash / Card',
      icon: ({ className = 'w-4 h-4' }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="4" fill="#000000" />
          <circle cx="12" cy="12" r="4.5" fill="none" stroke="#FFFFFF" strokeWidth="2.5" />
          <path d="M12 7.5v4.5h4.5" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      )
    };
  }

  // 4. Ola
  if (d.includes('ola')) {
    return {
      name: 'Ola Cabs',
      bg: 'bg-[#B1D337]',
      text: 'text-black',
      badge: 'Cab & Auto',
      defaultPayment: 'OlaMoney',
      icon: ({ className = 'w-4 h-4' }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="12" r="10" fill="#B1D337" />
          <circle cx="8" cy="12" r="3" fill="#000000" />
          <circle cx="16" cy="12" r="3" fill="#000000" />
          <path d="M8 12h8" stroke="#000000" strokeWidth="2" />
        </svg>
      )
    };
  }

  // 5. Spotify
  if (d.includes('spotify')) {
    return {
      name: 'Spotify',
      bg: 'bg-[#1DB954]',
      text: 'text-black',
      badge: 'Music Stream',
      defaultPayment: 'Mastercard payment',
      icon: ({ className = 'w-4 h-4' }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.308-1.758-8.793-.963-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.746 3.808-.87 7.076-.496 9.722 1.115.294.18.386.562.207.855zm1.226-2.723c-.226.367-.706.482-1.072.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.127-.848-.106-.973-.518-.127-.413.106-.848.518-.973 3.632-1.102 8.147-.568 11.235 1.328.366.226.481.707.257 1.072zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.493.15-1.016-.129-1.165-.623-.15-.493.129-1.016.623-1.165 3.532-1.072 9.404-.866 13.115 1.338.445.264.59.838.327 1.282-.264.444-.838.59-1.28.324z"/>
        </svg>
      )
    };
  }

  // 6. Apple / App Store
  if (d.includes('apple') || d.includes('app store') || d.includes('itunes') || d.includes('icloud')) {
    return {
      name: 'Apple',
      bg: 'bg-white',
      text: 'text-black',
      badge: 'Digital Services',
      defaultPayment: 'Apple Pay',
      icon: ({ className = 'w-4 h-4' }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.87-.96.04-2.12.64-2.77 1.39-.56.64-1.06 1.7-1.01 2.76 1.08.08 2.16-.54 2.77-1.28z" />
        </svg>
      )
    };
  }

  // 7. Netflix
  if (d.includes('netflix')) {
    return {
      name: 'Netflix',
      bg: 'bg-[#E50914]',
      text: 'text-white',
      badge: 'Entertainment',
      defaultPayment: 'Auto-Debit Card',
      icon: ({ className = 'w-4 h-4' }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M4 2h4.5l5.5 15V2H18v20h-4.5L8 7v15H4V2z" />
        </svg>
      )
    };
  }

  // 8. Amazon
  if (d.includes('amazon') || d.includes('prime')) {
    return {
      name: 'Amazon',
      bg: 'bg-[#FF9900]',
      text: 'text-black',
      badge: 'E-Commerce',
      defaultPayment: 'Amazon Pay',
      icon: ({ className = 'w-4 h-4' }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.9 14.7c-1.8 1.4-4.5 2.1-6.8 2.1-3.2 0-6-1.2-8.2-3.2-.2-.2-.2-.5 0-.7.3-.2.6-.2.8 0 2 1.8 4.5 2.8 7.4 2.8 2 0 4.4-.6 6-1.8.3-.2.7-.1.9.2.2.3.1.6-.1.6zm6.8 5.6c-.3.4-.8.5-1.2.2-2.8-2.2-6.8-3.4-10.8-3.4-4.4 0-8.6 1.5-11.8 4.2-.3.3-.8.2-1-.1-.3-.3-.2-.8.1-1 3.5-3 8-4.6 12.8-4.6 4.3 0 8.6 1.3 11.7 3.7.4.3.5.8.2 1z" />
          <path d="M16.5 13.5c1.4-1.2 2.3-3 2.3-5 0-3.6-2.9-6.5-6.5-6.5s-6.5 2.9-6.5 6.5c0 2 0.9 3.8 2.3 5" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      )
    };
  }

  // 9. Flipkart
  if (d.includes('flipkart')) {
    return {
      name: 'Flipkart',
      bg: 'bg-[#2874F0]',
      text: 'text-white',
      badge: 'Shopping',
      defaultPayment: 'Flipkart Axis Card',
      icon: ({ className = 'w-4 h-4' }) => (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="5" width="16" height="15" rx="3" fill="#2874F0" />
          <path d="M12 2C9.5 2 7.5 4 7.5 6.5V8h9V6.5C16.5 4 14.5 2 12 2z" fill="#FFE500" />
          <path d="M9 11h6v2H9z" fill="#FFFFFF" />
        </svg>
      )
    };
  }

  // 10. Starbucks / Coffee / CCD
  if (d.includes('starbucks') || d.includes('coffee') || d.includes('cafe') || d.includes('ccd') || d.includes('third wave')) {
    return {
      name: 'Cafe & Coffee',
      bg: 'bg-[#00704A]',
      text: 'text-white',
      badge: 'Beverages',
      defaultPayment: 'Card / UPI',
      icon: Coffee
    };
  }

  // 11. Blinkit / Zepto / Instamart / BigBasket
  if (d.includes('blinkit') || d.includes('zepto') || d.includes('instamart') || d.includes('grocer') || d.includes('bigbasket')) {
    return {
      name: 'Quick Commerce',
      bg: 'bg-[#F8CB46]',
      text: 'text-black font-bold',
      badge: 'Groceries',
      defaultPayment: 'UPI',
      icon: ShoppingCart
    };
  }

  // 12. BookMyShow / Cinema / Movie / PVR
  if (d.includes('bookmyshow') || d.includes('cinema') || d.includes('movie') || d.includes('pvr') || d.includes('inox')) {
    return {
      name: 'Entertainment',
      bg: 'bg-[#C4242D]',
      text: 'text-white',
      badge: 'Movies & Events',
      defaultPayment: 'BookMyShow Pay',
      icon: Ticket
    };
  }

  // 13. Airtel / Jio / Recharge / Vi
  if (d.includes('airtel') || d.includes('jio') || d.includes('vodafone') || d.includes('recharge') || d.includes('broadband')) {
    return {
      name: 'Telecom',
      bg: 'bg-[#E40000]',
      text: 'text-white',
      badge: 'Mobile & Net',
      defaultPayment: 'Autopay',
      icon: Radio
    };
  }

  // 14. Cult.fit / Gym / Fitness
  if (d.includes('cult') || d.includes('gym') || d.includes('fitness') || d.includes('fit')) {
    return {
      name: 'Fitness',
      bg: 'bg-[#FF3278]',
      text: 'text-white',
      badge: 'Health & Gym',
      defaultPayment: 'Credit Card',
      icon: Dumbbell
    };
  }

  // 15. Electricity / BESCOM / Torrent / Water / Bills
  if (d.includes('electricity') || d.includes('bescom') || d.includes('bill') || d.includes('utility') || c.includes('bills')) {
    return {
      name: 'Utilities',
      bg: 'bg-[#F59E0B]',
      text: 'text-black',
      badge: 'Monthly Utility',
      defaultPayment: 'NetBanking / BBPS',
      icon: Zap
    };
  }

  // 16. Rent / Housing / Maintenance
  if (d.includes('rent') || d.includes('flat') || d.includes('housing') || c.includes('housing')) {
    return {
      name: 'Housing',
      bg: 'bg-[#3B82F6]',
      text: 'text-white',
      badge: 'Rent & Living',
      defaultPayment: 'Bank Transfer',
      icon: Home
    };
  }

  // 17. Salary / Payroll / Employer / Income
  if (d.includes('salary') || d.includes('payroll') || d.includes('employer') || d.includes('bonus') || c.includes('income')) {
    return {
      name: 'Payroll',
      bg: 'bg-[#10B981]',
      text: 'text-black',
      badge: 'Employment',
      defaultPayment: 'Direct Deposit',
      icon: Briefcase
    };
  }

  // 18. Generic Categories Fallbacks
  if (c.includes('food') || c.includes('dining')) {
    return {
      name: 'Food & Dining',
      bg: 'bg-[#FC8019]',
      text: 'text-white',
      badge: 'Food',
      defaultPayment: 'Cash payment',
      icon: Utensils
    };
  }
  if (c.includes('travel') || c.includes('transport')) {
    return {
      name: 'Travel',
      bg: 'bg-[#06B6D4]',
      text: 'text-black',
      badge: 'Transport',
      defaultPayment: 'Card / UPI',
      icon: Car
    };
  }
  if (c.includes('shopping')) {
    return {
      name: 'Shopping',
      bg: 'bg-[#8B5CF6]',
      text: 'text-white',
      badge: 'Shopping',
      defaultPayment: 'UPI / Card',
      icon: ShoppingBag
    };
  }
  if (c.includes('invest') || c.includes('saving')) {
    return {
      name: 'Investment',
      bg: 'bg-[#10B981]',
      text: 'text-black',
      badge: 'Portfolio',
      defaultPayment: 'Auto-SIP',
      icon: PiggyBank
    };
  }
  if (c.includes('health')) {
    return {
      name: 'Healthcare',
      bg: 'bg-[#EF4444]',
      text: 'text-white',
      badge: 'Medical',
      defaultPayment: 'Health Card',
      icon: HeartPulse
    };
  }

  // Default fallback
  return {
    name: 'General',
    bg: 'bg-white/[0.08]',
    text: 'text-white',
    badge: 'Expense',
    defaultPayment: paymentMethod || 'Online payment',
    icon: Receipt
  };
};

/**
 * Reusable Merchant Avatar Component
 */
export const MerchantAvatar = ({ description = '', category = '', size = 'md', className = '' }) => {
  const brand = getMerchantBrand(description, category);
  const Icon = brand.icon;

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base'
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`${sizeClasses[size] || sizeClasses.md} rounded-full ${brand.bg} ${brand.text} flex items-center justify-center flex-shrink-0 shadow-sm ${className}`}>
      <Icon className={iconSizes[size] || iconSizes.md} />
    </div>
  );
};
