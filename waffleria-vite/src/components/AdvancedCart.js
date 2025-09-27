import React, { useState, useEffect } from 'react';
import {
  FiShoppingCart,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiEdit3,
  FiPercent,
  FiDollarSign,
  FiCreditCard,
  FiSmartphone,
  FiUser,
  FiClock,
  FiMapPin,
  FiHome,
  FiPackage,
  FiTruck,
  FiMessageSquare,
  FiTag,
  FiCopy,
  FiCheck,
  FiX,
  FiDivideCircle,
  FiGrid
} from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { DiscountModal, SplitPaymentModal, CustomerModal } from './CartModals';
import { EnhancedReceiptModal } from './EnhancedReceiptModal';

const AdvancedCart = () => {
  const {
    items,
    customer,
    orderNotes,
    paymentMethod,
    splitPayments,
    globalDiscount,
    globalDiscountType,
    globalDiscountReason,
    tableNumber,
    orderType,
    isProcessingPayment,
    lastSavedOrder,
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
    processPayment,
    getCartSummary,
    formatCurrency
  } = useCart();

  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showSplitPaymentModal, setShowSplitPaymentModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Debug showReceiptModal state changes
  useEffect(() => {
    console.log('🎭 [AdvancedCart] showReceiptModal state changed:', showReceiptModal);
  }, [showReceiptModal]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemNote, setItemNote] = useState('');
  const [discountAmount, setDiscountAmount] = useState('');
  const [discountType, setDiscountType] = useState('amount');
  const [discountReason, setDiscountReason] = useState('');
  const [selectedItemForDiscount, setSelectedItemForDiscount] = useState(null);

  const cartSummary = getCartSummary();

  const paymentMethods = [
    { id: 'efectivo', name: 'Efectivo', icon: FiDollarSign, color: 'from-green-500 to-green-600' },
    { id: 'tarjeta', name: 'Tarjeta', icon: FiCreditCard, color: 'from-blue-500 to-blue-600' },
    { id: 'nequi', name: 'Nequi', icon: FiSmartphone, color: 'from-purple-500 to-purple-600' }
  ];

  const orderTypes = [
    { id: 'dine-in', name: 'Comer Aquí', icon: FiHome, description: 'Mesa en restaurante' },
    { id: 'takeaway', name: 'Para Llevar', icon: FiPackage, description: 'Recoger en tienda' },
    { id: 'delivery', name: 'Domicilio', icon: FiTruck, description: 'Entrega a domicilio' }
  ];

  const handleItemNoteEdit = (item) => {
    setEditingItemId(item.uniqueId);
    setItemNote(item.notes || '');
  };

  const saveItemNote = () => {
    if (editingItemId) {
      updateItemNotes(editingItemId, itemNote);
      setEditingItemId(null);
      setItemNote('');
    }
  };

  const handleItemDiscount = (item) => {
    setSelectedItemForDiscount(item);
    setDiscountAmount(item.discount?.toString() || '');
    setDiscountType(item.discountType || 'amount');
    setShowDiscountModal(true);
  };

  const applyDiscount = () => {
    const amount = parseFloat(discountAmount) || 0;

    if (selectedItemForDiscount) {
      // Apply discount to specific item
      applyItemDiscount(selectedItemForDiscount.uniqueId, amount, discountType);
    } else {
      // Apply global discount
      applyGlobalDiscount(amount, discountType, discountReason);
    }

    setShowDiscountModal(false);
    setSelectedItemForDiscount(null);
    setDiscountAmount('');
    setDiscountReason('');
  };

  const handleGlobalDiscount = () => {
    setSelectedItemForDiscount(null);
    setDiscountAmount(globalDiscount?.toString() || '');
    setDiscountType(globalDiscountType || 'amount');
    setDiscountReason(globalDiscountReason || '');
    setShowDiscountModal(true);
  };

  const handleSplitPayment = () => {
    setShowSplitPaymentModal(true);
  };

  const addPaymentSplit = (method, amount) => {
    addSplitPayment({ method, amount, id: Date.now() });
  };

  const [currentOrder, setCurrentOrder] = useState(null);

  const handleProcessPayment = async () => {
    console.log('🚀 [AdvancedCart] Starting payment process...');

    if (cartSummary.isEmpty) {
      alert('El carrito está vacío');
      return;
    }

    if (!customer.name && orderType === 'dine-in' && !tableNumber) {
      alert('Por favor ingresa el número de mesa o información del cliente');
      return;
    }

    console.log('💳 [AdvancedCart] About to call processPayment...');
    console.log('📊 [AdvancedCart] Current lastSavedOrder:', lastSavedOrder);
    console.log('🎯 [AdvancedCart] Current showReceiptModal state:', showReceiptModal);

    const result = await processPayment({
      paymentMethod,
      splitPayments,
      customer,
      orderType,
      tableNumber
    });

    console.log('✅ [AdvancedCart] Payment result:', result);

    if (result.success) {
      console.log('🎉 [AdvancedCart] Payment successful! Using order from result:', result.order);
      setCurrentOrder(result.order);
      console.log('🔄 [AdvancedCart] About to call setShowReceiptModal(true)...');
      setShowReceiptModal(true);
      console.log('🎯 [AdvancedCart] setShowReceiptModal(true) called with order:', result.order);

      // DON'T clear cart automatically - let user close modal first
      console.log('📝 [AdvancedCart] Cart will be cleared when user closes the receipt modal');
    } else {
      console.log('❌ [AdvancedCart] Payment failed:', result.error);
      alert(`Error al procesar el pago: ${result.error}`);
    }
  };

  if (cartSummary.isEmpty) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700/50">
        <div className="text-center py-8">
          <FiShoppingCart className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-300 mb-2">Carrito Vacío</h3>
          <p className="text-gray-500">Selecciona productos para comenzar</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiShoppingCart className="h-5 w-5 text-amber-400" />
            <h3 className="font-semibold text-white">Carrito ({cartSummary.itemCount})</h3>
          </div>
          <button
            onClick={clearCart}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
            title="Limpiar carrito"
          >
            <FiTrash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Order Type Selector */}
        <div className="mt-4">
          <div className="grid grid-cols-3 gap-2">
            {orderTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setOrderType(type.id)}
                  className={`p-2 rounded-lg text-xs transition-colors ${
                    orderType === type.id
                      ? 'bg-amber-600/50 text-amber-100 border border-amber-500/50'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  <Icon className="h-4 w-4 mx-auto mb-1" />
                  <div className="font-medium">{type.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Table Number for Dine-in */}
        {orderType === 'dine-in' && (
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <FiMapPin className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Número de mesa"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                className="flex-1 bg-gray-700/50 text-white placeholder-gray-400 px-3 py-2 rounded-lg border border-gray-600/50 focus:border-amber-500/50 focus:outline-none text-sm"
              />
            </div>
          </div>
        )}

        {/* Customer Info */}
        <div className="mt-3">
          <button
            onClick={() => setShowCustomerModal(true)}
            className="w-full flex items-center gap-2 p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors text-sm"
          >
            <FiUser className="h-4 w-4 text-gray-400" />
            <span className="text-gray-300">
              {customer.name || 'Agregar cliente'}
            </span>
          </button>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {items.map((item) => (
          <div key={item.uniqueId} className="bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
            {/* Item Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-white text-sm">{item.name}</h4>
                {item.toppings && item.toppings.length > 0 && (
                  <div className="mt-1">
                    <p className="text-xs text-amber-400">
                      + {item.toppings.map(t => t.name).join(', ')}
                    </p>
                  </div>
                )}
                {item.discount > 0 && (
                  <div className="flex items-center gap-1 mt-1">
                    <FiTag className="h-3 w-3 text-green-400" />
                    <span className="text-xs text-green-400">
                      -{item.discountType === 'percentage' ? `${item.discount}%` : formatCurrency(item.discount)}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => removeItem(item.uniqueId)}
                className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
              >
                <FiX className="h-4 w-4" />
              </button>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.uniqueId, item.quantity - 1)}
                  className="p-1 bg-gray-600/50 hover:bg-gray-500/50 rounded transition-colors"
                >
                  <FiMinus className="h-3 w-3 text-white" />
                </button>
                <span className="text-white font-medium px-2">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.uniqueId, item.quantity + 1)}
                  className="p-1 bg-gray-600/50 hover:bg-gray-500/50 rounded transition-colors"
                >
                  <FiPlus className="h-3 w-3 text-white" />
                </button>
              </div>

              <div className="flex items-center gap-1">
                {/* Item Actions */}
                <button
                  onClick={() => handleItemNoteEdit(item)}
                  className={`p-1 rounded transition-colors ${
                    item.notes ? 'text-amber-400 bg-amber-900/20' : 'text-gray-400 hover:text-amber-400'
                  }`}
                  title="Agregar nota"
                >
                  <FiMessageSquare className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleItemDiscount(item)}
                  className={`p-1 rounded transition-colors ${
                    item.discount > 0 ? 'text-green-400 bg-green-900/20' : 'text-gray-400 hover:text-green-400'
                  }`}
                  title="Aplicar descuento"
                >
                  <FiPercent className="h-3 w-3" />
                </button>

                <div className="text-right ml-2">
                  <div className="text-sm font-medium text-white">
                    {formatCurrency((item.totalPrice || item.price) * item.quantity)}
                  </div>
                </div>
              </div>
            </div>

            {/* Item Notes */}
            {editingItemId === item.uniqueId && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={itemNote}
                  onChange={(e) => setItemNote(e.target.value)}
                  placeholder="Nota para el producto..."
                  className="flex-1 bg-gray-600/50 text-white placeholder-gray-400 px-2 py-1 rounded text-xs border border-gray-500/50 focus:border-amber-500/50 focus:outline-none"
                />
                <button
                  onClick={saveItemNote}
                  className="p-1 bg-green-600/50 hover:bg-green-500/50 rounded transition-colors"
                >
                  <FiCheck className="h-3 w-3 text-white" />
                </button>
              </div>
            )}

            {item.notes && editingItemId !== item.uniqueId && (
              <div className="mt-2 p-2 bg-gray-600/30 rounded text-xs text-gray-300 border-l-2 border-amber-500/50">
                {item.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Order Notes */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Notas del pedido
          </label>
          <textarea
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            placeholder="Instrucciones especiales..."
            rows={2}
            className="w-full bg-gray-700/50 text-white placeholder-gray-400 px-3 py-2 rounded-lg border border-gray-600/50 focus:border-amber-500/50 focus:outline-none text-xs resize-none"
          />
        </div>

        {/* Cart Summary */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Subtotal:</span>
            <span className="text-white">{formatCurrency(cartSummary.subtotal)}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">IVA (19%):</span>
            <span className="text-white">{formatCurrency(cartSummary.taxes)}</span>
          </div>

          {cartSummary.globalDiscount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-400">Descuento:</span>
              <span className="text-green-400">-{formatCurrency(cartSummary.globalDiscount)}</span>
            </div>
          )}

          <div className="border-t border-gray-600/50 pt-2">
            <div className="flex justify-between font-semibold">
              <span className="text-white">Total:</span>
              <span className="text-amber-400 text-lg">{formatCurrency(cartSummary.total)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleGlobalDiscount}
              className="flex items-center justify-center gap-2 p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors text-sm text-gray-300"
            >
              <FiPercent className="h-4 w-4" />
              Descuento
            </button>
            <button
              onClick={handleSplitPayment}
              className="flex items-center justify-center gap-2 p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg transition-colors text-sm text-gray-300"
            >
              <FiGrid className="h-4 w-4" />
              Dividir
            </button>
          </div>

          {/* Payment Method Selection */}
          <div className="grid grid-cols-3 gap-2">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-2 rounded-lg text-xs transition-colors ${
                    paymentMethod === method.id
                      ? 'bg-gradient-to-r ' + method.color + ' text-white'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  <Icon className="h-4 w-4 mx-auto mb-1" />
                  <div className="font-medium">{method.name}</div>
                </button>
              );
            })}
          </div>

          {/* Process Payment Button */}
          <button
            onClick={handleProcessPayment}
            disabled={isProcessingPayment || cartSummary.isEmpty}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessingPayment ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Procesando...
              </>
            ) : (
              <>
                <FiCreditCard className="h-4 w-4" />
                Procesar Pago
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modals */}
      <DiscountModal
        isOpen={showDiscountModal}
        onClose={() => setShowDiscountModal(false)}
        onApply={applyDiscount}
        discountAmount={discountAmount}
        setDiscountAmount={setDiscountAmount}
        discountType={discountType}
        setDiscountType={setDiscountType}
        discountReason={discountReason}
        setDiscountReason={setDiscountReason}
        isGlobal={!selectedItemForDiscount}
        itemName={selectedItemForDiscount?.name}
      />

      <SplitPaymentModal
        isOpen={showSplitPaymentModal}
        onClose={() => setShowSplitPaymentModal(false)}
        splitPayments={splitPayments}
        onAddPayment={addPaymentSplit}
        onRemovePayment={removeSplitPayment}
        totalAmount={cartSummary.total}
        formatCurrency={formatCurrency}
      />

      <CustomerModal
        isOpen={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        customer={customer}
        onSave={setCustomerInfo}
      />

      <EnhancedReceiptModal
        isOpen={showReceiptModal}
        onClose={() => {
          console.log('🔒 [AdvancedCart] User closing receipt modal, clearing cart now...');
          setShowReceiptModal(false);
          setCurrentOrder(null);
          clearCart();
        }}
        order={currentOrder || lastSavedOrder}
      />
    </div>
  );
};

export default AdvancedCart;