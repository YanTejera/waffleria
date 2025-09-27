import React, { useState } from 'react';
import {
  FiX,
  FiPercent,
  FiDollarSign,
  FiCreditCard,
  FiSmartphone,
  FiUser,
  FiMail,
  FiPhone,
  FiCheck,
  FiPlus,
  FiTrash2,
  FiGrid,
  FiTag
} from 'react-icons/fi';

// Discount Modal Component
export const DiscountModal = ({
  isOpen,
  onClose,
  onApply,
  discountAmount,
  setDiscountAmount,
  discountType,
  setDiscountType,
  discountReason,
  setDiscountReason,
  isGlobal = false,
  itemName = null
}) => {
  if (!isOpen) return null;

  const handleApply = () => {
    const amount = parseFloat(discountAmount) || 0;
    if (amount < 0) {
      alert('El descuento no puede ser negativo');
      return;
    }
    if (discountType === 'percentage' && amount > 100) {
      alert('El descuento no puede ser mayor al 100%');
      return;
    }
    onApply();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-gray-700/50 w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiTag className="h-5 w-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-white">
                {isGlobal ? 'Descuento General' : `Descuento - ${itemName}`}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Discount Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tipo de descuento
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDiscountType('amount')}
                  className={`p-3 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                    discountType === 'amount'
                      ? 'bg-amber-600/50 border-amber-500/50 text-amber-100'
                      : 'bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  <FiDollarSign className="h-4 w-4" />
                  Monto Fijo
                </button>
                <button
                  onClick={() => setDiscountType('percentage')}
                  className={`p-3 rounded-lg border transition-colors flex items-center justify-center gap-2 ${
                    discountType === 'percentage'
                      ? 'bg-amber-600/50 border-amber-500/50 text-amber-100'
                      : 'bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  <FiPercent className="h-4 w-4" />
                  Porcentaje
                </button>
              </div>
            </div>

            {/* Discount Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {discountType === 'percentage' ? 'Porcentaje (%)' : 'Monto ($)'}
              </label>
              <input
                type="number"
                min="0"
                max={discountType === 'percentage' ? '100' : undefined}
                step={discountType === 'percentage' ? '1' : '100'}
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                className="w-full bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none"
                placeholder="0"
              />
            </div>

            {/* Reason (for global discounts) */}
            {isGlobal && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Motivo del descuento
                </label>
                <input
                  type="text"
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  className="w-full bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none"
                  placeholder="Cliente frecuente, promoción, etc."
                />
              </div>
            )}

            {/* Quick Options */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Opciones rápidas
              </label>
              <div className="grid grid-cols-4 gap-2">
                {discountType === 'percentage' ? (
                  <>
                    <button onClick={() => setDiscountAmount('5')} className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-sm text-gray-300">5%</button>
                    <button onClick={() => setDiscountAmount('10')} className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-sm text-gray-300">10%</button>
                    <button onClick={() => setDiscountAmount('15')} className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-sm text-gray-300">15%</button>
                    <button onClick={() => setDiscountAmount('20')} className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-sm text-gray-300">20%</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => setDiscountAmount('1000')} className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-sm text-gray-300">$1K</button>
                    <button onClick={() => setDiscountAmount('2000')} className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-sm text-gray-300">$2K</button>
                    <button onClick={() => setDiscountAmount('5000')} className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-sm text-gray-300">$5K</button>
                    <button onClick={() => setDiscountAmount('10000')} className="p-2 bg-gray-700/50 hover:bg-gray-600/50 rounded-lg text-sm text-gray-300">$10K</button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700/50 text-gray-300 py-3 rounded-xl border border-gray-600/50 hover:bg-gray-600/50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleApply}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 transition-all"
            >
              Aplicar Descuento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Split Payment Modal Component
export const SplitPaymentModal = ({
  isOpen,
  onClose,
  splitPayments,
  onAddPayment,
  onRemovePayment,
  totalAmount,
  formatCurrency
}) => {
  const [selectedMethod, setSelectedMethod] = useState('efectivo');
  const [amount, setAmount] = useState('');

  const paymentMethods = [
    { id: 'efectivo', name: 'Efectivo', icon: FiDollarSign },
    { id: 'tarjeta', name: 'Tarjeta', icon: FiCreditCard },
    { id: 'nequi', name: 'Nequi', icon: FiSmartphone }
  ];

  if (!isOpen) return null;

  const totalPaid = splitPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const remaining = totalAmount - totalPaid;

  const handleAddPayment = () => {
    const paymentAmount = parseFloat(amount) || 0;
    if (paymentAmount <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }
    if (paymentAmount > remaining) {
      alert('El monto no puede ser mayor al restante');
      return;
    }

    onAddPayment(selectedMethod, paymentAmount);
    setAmount('');
  };

  const fillRemaining = () => {
    setAmount(remaining.toString());
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-gray-700/50 w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiGrid className="h-5 w-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-white">Pago Dividido</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-700/30 rounded-lg p-4 mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Total:</span>
              <span className="text-white font-medium">{formatCurrency(totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Pagado:</span>
              <span className="text-green-400 font-medium">{formatCurrency(totalPaid)}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-600/50 pt-2">
              <span className="text-gray-400">Restante:</span>
              <span className="text-amber-400 font-bold">{formatCurrency(remaining)}</span>
            </div>
          </div>

          {/* Existing Split Payments */}
          {splitPayments.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Pagos agregados:</h4>
              <div className="space-y-2">
                {splitPayments.map((payment, index) => {
                  const method = paymentMethods.find(m => m.id === payment.method);
                  const Icon = method?.icon || FiDollarSign;
                  return (
                    <div key={index} className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-gray-400" />
                        <span className="text-white text-sm">{method?.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{formatCurrency(payment.amount)}</span>
                        <button
                          onClick={() => onRemovePayment(index)}
                          className="p-1 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                        >
                          <FiTrash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add New Payment */}
          {remaining > 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Método de pago
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <button
                        key={method.id}
                        onClick={() => setSelectedMethod(method.id)}
                        className={`p-3 rounded-lg border transition-colors flex flex-col items-center gap-1 ${
                          selectedMethod === method.id
                            ? 'bg-amber-600/50 border-amber-500/50 text-amber-100'
                            : 'bg-gray-700/50 border-gray-600/50 text-gray-300 hover:bg-gray-600/50'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-xs">{method.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Monto
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0"
                    max={remaining}
                    step="100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none"
                    placeholder="0"
                  />
                  <button
                    onClick={fillRemaining}
                    className="px-4 py-3 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl border border-gray-600/50 text-gray-300 text-sm transition-colors"
                  >
                    Todo
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddPayment}
                disabled={!amount || parseFloat(amount) <= 0}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <FiPlus className="h-4 w-4" />
                Agregar Pago
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700/50 text-gray-300 py-3 rounded-xl border border-gray-600/50 hover:bg-gray-600/50 transition-colors"
            >
              {remaining > 0 ? 'Cancelar' : 'Cerrar'}
            </button>
            {remaining === 0 && (
              <button
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 transition-all flex items-center justify-center gap-2"
              >
                <FiCheck className="h-4 w-4" />
                Confirmar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Customer Modal Component
export const CustomerModal = ({
  isOpen,
  onClose,
  customer,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || ''
  });

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('El nombre es requerido');
      return;
    }
    onSave(formData);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/95 backdrop-blur-sm rounded-2xl border border-gray-700/50 w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <FiUser className="h-5 w-5 text-amber-400" />
              <h3 className="text-lg font-semibold text-white">Información del Cliente</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full bg-gray-700/50 text-white placeholder-gray-400 px-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none"
                placeholder="Nombre del cliente"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Teléfono
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full bg-gray-700/50 text-white placeholder-gray-400 pl-10 pr-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none"
                  placeholder="+57 300 123 4567"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full bg-gray-700/50 text-white placeholder-gray-400 pl-10 pr-4 py-3 rounded-xl border border-gray-600/50 focus:border-amber-500/50 focus:outline-none"
                  placeholder="cliente@email.com"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-700/50 text-gray-300 py-3 rounded-xl border border-gray-600/50 hover:bg-gray-600/50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-xl font-bold hover:from-amber-600 hover:to-orange-700 transition-all"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};