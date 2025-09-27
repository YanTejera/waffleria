import React, { createContext, useContext, useState, useReducer, useEffect } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const newItem = {
        ...action.payload,
        uniqueId: Date.now() + Math.random(),
        quantity: action.payload.quantity || 1,
        addedAt: new Date(),
        notes: action.payload.notes || '',
        discount: action.payload.discount || 0,
        discountType: action.payload.discountType || 'amount' // 'amount' or 'percentage'
      };
      return {
        ...state,
        items: [...state.items, newItem],
        lastAction: { type: 'ADD', item: newItem }
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.uniqueId !== action.payload),
        lastAction: { type: 'REMOVE', itemId: action.payload }
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.uniqueId === action.payload.uniqueId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        lastAction: { type: 'UPDATE_QUANTITY', ...action.payload }
      };

    case 'UPDATE_ITEM_NOTES':
      return {
        ...state,
        items: state.items.map(item =>
          item.uniqueId === action.payload.uniqueId
            ? { ...item, notes: action.payload.notes }
            : item
        )
      };

    case 'APPLY_DISCOUNT':
      return {
        ...state,
        items: state.items.map(item =>
          item.uniqueId === action.payload.uniqueId
            ? {
                ...item,
                discount: action.payload.discount,
                discountType: action.payload.discountType
              }
            : item
        )
      };

    case 'APPLY_GLOBAL_DISCOUNT':
      return {
        ...state,
        globalDiscount: action.payload.discount,
        globalDiscountType: action.payload.discountType,
        globalDiscountReason: action.payload.reason || ''
      };

    case 'SET_CUSTOMER_INFO':
      return {
        ...state,
        customer: { ...state.customer, ...action.payload }
      };

    case 'SET_ORDER_NOTES':
      return {
        ...state,
        orderNotes: action.payload
      };

    case 'SET_PAYMENT_METHOD':
      return {
        ...state,
        paymentMethod: action.payload
      };

    case 'ADD_SPLIT_PAYMENT':
      return {
        ...state,
        splitPayments: [...state.splitPayments, action.payload]
      };

    case 'REMOVE_SPLIT_PAYMENT':
      return {
        ...state,
        splitPayments: state.splitPayments.filter((_, index) => index !== action.payload)
      };

    case 'SET_TABLE_NUMBER':
      return {
        ...state,
        tableNumber: action.payload
      };

    case 'SET_ORDER_TYPE':
      return {
        ...state,
        orderType: action.payload // 'dine-in', 'takeaway', 'delivery'
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        customer: { name: '', phone: '', email: '' },
        orderNotes: '',
        paymentMethod: 'efectivo',
        splitPayments: [],
        globalDiscount: 0,
        globalDiscountType: 'amount',
        globalDiscountReason: '',
        tableNumber: '',
        orderType: 'dine-in',
        lastAction: null
      };

    case 'SAVE_ORDER':
      const order = {
        id: `ORD-${Date.now()}`,
        items: state.items,
        customer: state.customer,
        orderNotes: state.orderNotes,
        paymentMethod: state.paymentMethod,
        splitPayments: state.splitPayments,
        globalDiscount: state.globalDiscount,
        globalDiscountType: state.globalDiscountType,
        globalDiscountReason: state.globalDiscountReason,
        tableNumber: state.tableNumber,
        orderType: state.orderType,
        subtotal: calculateSubtotal(state.items),
        taxes: calculateTaxes(state.items),
        total: calculateTotal(state.items, state.globalDiscount, state.globalDiscountType),
        createdAt: new Date(),
        status: 'pending'
      };

      return {
        ...state,
        savedOrders: [...state.savedOrders, order],
        lastSavedOrder: order
      };

    default:
      return state;
  }
};

// Helper functions
const calculateSubtotal = (items) => {
  return items.reduce((total, item) => {
    const itemPrice = item.totalPrice || item.price;
    const itemDiscount = item.discountType === 'percentage'
      ? (itemPrice * item.discount / 100)
      : item.discount;
    const itemTotal = (itemPrice - itemDiscount) * item.quantity;
    return total + itemTotal;
  }, 0);
};

const calculateTaxes = (items) => {
  const subtotal = calculateSubtotal(items);
  return subtotal * 0.19; // IVA 19%
};

const calculateTotal = (items, globalDiscount = 0, globalDiscountType = 'amount') => {
  const subtotal = calculateSubtotal(items);
  const taxes = calculateTaxes(items);
  const subtotalWithTax = subtotal + taxes;

  const finalDiscount = globalDiscountType === 'percentage'
    ? (subtotalWithTax * globalDiscount / 100)
    : globalDiscount;

  return Math.max(0, subtotalWithTax - finalDiscount);
};

const initialState = {
  items: [],
  customer: { name: '', phone: '', email: '' },
  orderNotes: '',
  paymentMethod: 'efectivo',
  splitPayments: [],
  globalDiscount: 0,
  globalDiscountType: 'amount',
  globalDiscountReason: '',
  tableNumber: '',
  orderType: 'dine-in',
  savedOrders: [],
  lastSavedOrder: null,
  lastAction: null
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('waffleria_cart', JSON.stringify(state));
  }, [state]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('waffleria_cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Only restore if there are items and it's recent (less than 24 hours)
        if (parsedCart.items?.length > 0) {
          const lastItemTime = new Date(parsedCart.items[parsedCart.items.length - 1]?.addedAt);
          const hoursSinceLastItem = (Date.now() - lastItemTime.getTime()) / (1000 * 60 * 60);

          if (hoursSinceLastItem < 24) {
            Object.keys(parsedCart).forEach(key => {
              if (key !== 'lastAction') {
                dispatch({ type: 'RESTORE_STATE', payload: { [key]: parsedCart[key] } });
              }
            });
          }
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  const addItem = (product, options = {}) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        ...product,
        ...options,
        totalPrice: product.price + (options.toppings?.reduce((sum, t) => sum + t.price, 0) || 0)
      }
    });
  };

  const removeItem = (uniqueId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: uniqueId });
  };

  const updateQuantity = (uniqueId, quantity) => {
    if (quantity <= 0) {
      removeItem(uniqueId);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { uniqueId, quantity } });
    }
  };

  const updateItemNotes = (uniqueId, notes) => {
    dispatch({ type: 'UPDATE_ITEM_NOTES', payload: { uniqueId, notes } });
  };

  const applyItemDiscount = (uniqueId, discount, discountType = 'amount') => {
    dispatch({
      type: 'APPLY_DISCOUNT',
      payload: { uniqueId, discount, discountType }
    });
  };

  const applyGlobalDiscount = (discount, discountType = 'amount', reason = '') => {
    dispatch({
      type: 'APPLY_GLOBAL_DISCOUNT',
      payload: { discount, discountType, reason }
    });
  };

  const setCustomerInfo = (customerInfo) => {
    dispatch({ type: 'SET_CUSTOMER_INFO', payload: customerInfo });
  };

  const setOrderNotes = (notes) => {
    dispatch({ type: 'SET_ORDER_NOTES', payload: notes });
  };

  const setPaymentMethod = (method) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', payload: method });
  };

  const addSplitPayment = (payment) => {
    dispatch({ type: 'ADD_SPLIT_PAYMENT', payload: payment });
  };

  const removeSplitPayment = (index) => {
    dispatch({ type: 'REMOVE_SPLIT_PAYMENT', payload: index });
  };

  const setTableNumber = (tableNumber) => {
    dispatch({ type: 'SET_TABLE_NUMBER', payload: tableNumber });
  };

  const setOrderType = (orderType) => {
    dispatch({ type: 'SET_ORDER_TYPE', payload: orderType });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const saveOrder = () => {
    dispatch({ type: 'SAVE_ORDER' });
  };

  const processPayment = async (paymentDetails) => {
    console.log('💰 [CartContext] processPayment called with:', paymentDetails);
    console.log('🛒 [CartContext] Current state before payment:', {
      itemCount: state.items.length,
      lastSavedOrder: state.lastSavedOrder,
      savedOrdersCount: state.savedOrders.length
    });

    setIsProcessingPayment(true);
    try {
      // Simulate payment processing
      console.log('⏳ [CartContext] Simulating payment processing...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create order object manually (same logic as SAVE_ORDER reducer)
      console.log('💾 [CartContext] Creating order object...');
      const orderToSave = {
        id: `ORD-${Date.now()}`,
        items: state.items,
        customer: state.customer,
        orderNotes: state.orderNotes,
        paymentMethod: state.paymentMethod,
        splitPayments: state.splitPayments,
        globalDiscount: state.globalDiscount,
        globalDiscountType: state.globalDiscountType,
        globalDiscountReason: state.globalDiscountReason,
        tableNumber: state.tableNumber,
        orderType: state.orderType,
        subtotal: calculateSubtotal(state.items),
        taxes: calculateTaxes(state.items),
        total: calculateTotal(state.items, state.globalDiscount, state.globalDiscountType),
        createdAt: new Date(),
        status: 'pending'
      };

      console.log('📦 [CartContext] Order object created:', orderToSave);

      // Save order using dispatch
      dispatch({ type: 'SAVE_ORDER' });

      console.log('✅ [CartContext] Payment process completed successfully');

      setIsProcessingPayment(false);

      // Return order immediately, clear cart will be handled by the UI after modal is shown
      return { success: true, orderId: orderToSave.id, order: orderToSave };
    } catch (error) {
      console.log('❌ [CartContext] Payment process failed:', error);
      setIsProcessingPayment(false);
      return { success: false, error: error.message };
    }
  };

  const getCartSummary = () => {
    const subtotal = calculateSubtotal(state.items);
    const taxes = calculateTaxes(state.items);
    const total = calculateTotal(state.items, state.globalDiscount, state.globalDiscountType);

    return {
      itemCount: state.items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      taxes,
      globalDiscount: state.globalDiscountType === 'percentage'
        ? ((subtotal + taxes) * state.globalDiscount / 100)
        : state.globalDiscount,
      total,
      isEmpty: state.items.length === 0
    };
  };

  const value = {
    // State
    ...state,
    isProcessingPayment,

    // Actions
    addItem,
    removeItem,
    updateQuantity,
    updateItemNotes,
    applyItemDiscount,
    applyGlobalDiscount,
    setCustomerInfo,
    setOrderNotes,
    setPaymentMethod,
    addSplitPayment,
    removeSplitPayment,
    setTableNumber,
    setOrderType,
    clearCart,
    saveOrder,
    processPayment,

    // Computed values
    getCartSummary,

    // Utilities
    formatCurrency: (amount) => new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount)
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;