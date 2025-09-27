import React, { forwardRef } from 'react';
import { FiPrinter, FiDownload, FiShare2 } from 'react-icons/fi';

const Receipt = forwardRef(({ order, onPrint, onDownload, onShare }, ref) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDateTime = (date) => {
    return new Date(date).toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!order) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
        <div className="text-center text-gray-500">
          No hay información de pedido disponible
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white max-w-md mx-auto">
      {/* Print Actions - Only show when not printing */}
      <div className="no-print mb-4 flex gap-2">
        <button
          onClick={onPrint}
          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <FiPrinter className="h-4 w-4" />
          Imprimir
        </button>
        <button
          onClick={onDownload}
          className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <FiDownload className="h-4 w-4" />
          Descargar
        </button>
        <button
          onClick={onShare}
          className="flex-1 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
        >
          <FiShare2 className="h-4 w-4" />
          Compartir
        </button>
      </div>

      {/* Receipt Content */}
      <div
        ref={ref}
        className="bg-white p-6 border border-gray-200 font-mono text-sm"
        style={{ width: '302px' }} // Standard thermal printer width
      >
        {/* Header */}
        <div className="text-center mb-4">
          <div className="text-2xl mb-2">🧇</div>
          <h1 className="text-lg font-bold">LA WAFFLERIA</h1>
          <p className="text-xs">Sistema POS Avanzado</p>
          <p className="text-xs">Carrera 10 #15-25</p>
          <p className="text-xs">Bogotá, Colombia</p>
          <p className="text-xs">Tel: +57 1 234 5678</p>
          <p className="text-xs">NIT: 900123456-7</p>
        </div>

        <div className="border-t border-dashed border-gray-400 my-3"></div>

        {/* Order Info */}
        <div className="mb-4">
          <div className="flex justify-between text-xs">
            <span>PEDIDO:</span>
            <span className="font-bold">{order.id}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span>FECHA:</span>
            <span>{formatDateTime(order.createdAt)}</span>
          </div>
          {order.tableNumber && (
            <div className="flex justify-between text-xs">
              <span>MESA:</span>
              <span>{order.tableNumber}</span>
            </div>
          )}
          <div className="flex justify-between text-xs">
            <span>TIPO:</span>
            <span>
              {order.orderType === 'dine-in' ? 'COMER AQUÍ' :
               order.orderType === 'takeaway' ? 'PARA LLEVAR' : 'DOMICILIO'}
            </span>
          </div>
          {order.customer?.name && (
            <div className="flex justify-between text-xs">
              <span>CLIENTE:</span>
              <span>{order.customer.name}</span>
            </div>
          )}
        </div>

        <div className="border-t border-dashed border-gray-400 my-3"></div>

        {/* Items */}
        <div className="mb-4">
          {order.items.map((item, index) => {
            const itemPrice = item.totalPrice || item.price;
            const itemDiscount = item.discountType === 'percentage'
              ? (itemPrice * item.discount / 100)
              : item.discount || 0;
            const itemTotal = (itemPrice - itemDiscount) * item.quantity;

            return (
              <div key={index} className="mb-3">
                <div className="flex justify-between">
                  <span className="text-xs font-medium">{item.name}</span>
                  <span className="text-xs">{formatCurrency(itemTotal)}</span>
                </div>

                <div className="text-xs text-gray-600 ml-2">
                  {item.quantity} x {formatCurrency(itemPrice)}
                  {itemDiscount > 0 && (
                    <span className="text-green-600">
                      {' '}(Desc: -{formatCurrency(itemDiscount)})
                    </span>
                  )}
                </div>

                {item.toppings && item.toppings.length > 0 && (
                  <div className="text-xs text-gray-600 ml-4">
                    + {item.toppings.map(t => t.name).join(', ')}
                  </div>
                )}

                {item.notes && (
                  <div className="text-xs text-gray-600 ml-4">
                    Nota: {item.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="border-t border-dashed border-gray-400 my-3"></div>

        {/* Order Notes */}
        {order.orderNotes && (
          <>
            <div className="mb-3">
              <div className="text-xs font-medium">NOTAS DEL PEDIDO:</div>
              <div className="text-xs text-gray-600">{order.orderNotes}</div>
            </div>
            <div className="border-t border-dashed border-gray-400 my-3"></div>
          </>
        )}

        {/* Totals */}
        <div className="mb-4">
          <div className="flex justify-between text-xs">
            <span>SUBTOTAL:</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>

          <div className="flex justify-between text-xs">
            <span>IVA (19%):</span>
            <span>{formatCurrency(order.taxes)}</span>
          </div>

          {order.globalDiscount > 0 && (
            <>
              <div className="flex justify-between text-xs text-green-600">
                <span>DESCUENTO:</span>
                <span>-{formatCurrency(order.globalDiscount)}</span>
              </div>
              {order.globalDiscountReason && (
                <div className="text-xs text-gray-600 text-center">
                  ({order.globalDiscountReason})
                </div>
              )}
            </>
          )}

          <div className="border-t border-gray-400 my-2"></div>

          <div className="flex justify-between text-sm font-bold">
            <span>TOTAL:</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-400 my-3"></div>

        {/* Payment Info */}
        <div className="mb-4">
          <div className="text-xs font-medium mb-2">PAGO:</div>

          {order.splitPayments && order.splitPayments.length > 0 ? (
            // Split payments
            order.splitPayments.map((payment, index) => (
              <div key={index} className="flex justify-between text-xs">
                <span>
                  {payment.method === 'efectivo' ? 'EFECTIVO' :
                   payment.method === 'tarjeta' ? 'TARJETA' :
                   payment.method === 'nequi' ? 'NEQUI' : payment.method.toUpperCase()}
                </span>
                <span>{formatCurrency(payment.amount)}</span>
              </div>
            ))
          ) : (
            // Single payment
            <div className="flex justify-between text-xs">
              <span>
                {order.paymentMethod === 'efectivo' ? 'EFECTIVO' :
                 order.paymentMethod === 'tarjeta' ? 'TARJETA' :
                 order.paymentMethod === 'nequi' ? 'NEQUI' : order.paymentMethod?.toUpperCase()}
              </span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          )}

          {order.paymentMethod === 'efectivo' && (
            <>
              <div className="flex justify-between text-xs mt-1">
                <span>CAMBIO:</span>
                <span>{formatCurrency(0)}</span>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-dashed border-gray-400 my-3"></div>

        {/* Footer */}
        <div className="text-center text-xs space-y-1">
          <p>¡GRACIAS POR SU VISITA!</p>
          <p>Vuelva pronto</p>
          <p className="mt-2">★★★★★</p>
          <p>Síguenos en redes sociales</p>
          <p>@LaWaffleria</p>

          <div className="mt-3 text-xs">
            <p>Software POS by Claude Code</p>
            <p>Soporte: soporte@waffleria.com</p>
          </div>
        </div>

        {/* QR Code Placeholder */}
        <div className="text-center mt-4">
          <div className="inline-block w-16 h-16 border border-gray-300 flex items-center justify-center text-xs">
            QR
          </div>
          <p className="text-xs mt-1">Encuesta de satisfacción</p>
        </div>
      </div>
    </div>
  );
});

Receipt.displayName = 'Receipt';

// Receipt Modal Component
export const ReceiptModal = ({ isOpen, onClose, order }) => {
  const receiptRef = React.useRef();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create a simple download of the receipt content
    const receiptContent = receiptRef.current?.innerText || '';
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recibo-${order?.id || 'pedido'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Recibo La Waffleria - ${order?.id}`,
          text: `Recibo de compra - Total: ${order?.total ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(order.total) : 'N/A'}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const receiptContent = receiptRef.current?.innerText || '';
      navigator.clipboard.writeText(receiptContent).then(() => {
        alert('Recibo copiado al portapapeles');
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Recibo de Venta</h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <Receipt
          ref={receiptRef}
          order={order}
          onPrint={handlePrint}
          onDownload={handleDownload}
          onShare={handleShare}
        />

        <div className="mt-4 pt-4 border-t">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }

          body * {
            visibility: hidden;
          }

          #receipt-content, #receipt-content * {
            visibility: visible;
          }

          #receipt-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

          @page {
            size: 80mm auto;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Receipt;