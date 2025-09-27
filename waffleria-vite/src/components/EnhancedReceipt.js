import React, { forwardRef, useState, useEffect } from 'react';
import { FiPrinter, FiDownload, FiShare2, FiMail, FiSquare, FiImage } from 'react-icons/fi';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const EnhancedReceipt = forwardRef(({ order, onPrint, onDownload, onShare, onWhatsAppShare }, ref) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // Generate QR code for satisfaction survey
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const surveyUrl = `https://forms.gle/survey?order=${order?.id}&total=${order?.total}`;
        const qrDataUrl = await QRCode.toDataURL(surveyUrl, {
          width: 64,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeDataUrl(qrDataUrl);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    if (order?.id) {
      generateQRCode();
    }
  }, [order?.id, order?.total]);

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
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const generateInvoiceNumber = (orderId) => {
    const prefix = 'WF';
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const orderNumber = String(orderId).padStart(4, '0');
    return `${prefix}-${date}-${orderNumber}`;
  };

  const calculateChange = (order) => {
    if (order.paymentMethod === 'efectivo' && order.amountReceived) {
      return Math.max(0, order.amountReceived - order.total);
    }
    return 0;
  };

  const getCurrentCashier = () => {
    // Get current user from localStorage or context
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user.name || 'Sistema';
  };

  const getPaymentAccountInfo = (paymentMethod) => {
    const paymentAccounts = {
      'nequi': {
        title: 'INFORMACIÓN NEQUI',
        accounts: [
          { label: 'Número Nequi', value: '+57 300 123 4567', name: 'La Waffleria SAS' },
          { label: 'Nombre', value: 'LA WAFFLERIA SAS', type: 'business' }
        ]
      },
      'daviplata': {
        title: 'INFORMACIÓN DAVIPLATA',
        accounts: [
          { label: 'Número DaviPlata', value: '+57 300 987 6543', name: 'La Waffleria SAS' },
          { label: 'Nombre', value: 'LA WAFFLERIA SAS', type: 'business' }
        ]
      },
      'pse': {
        title: 'INFORMACIÓN TRANSFERENCIA PSE',
        accounts: [
          { label: 'Banco', value: 'Bancolombia', type: 'bank' },
          { label: 'Cuenta Ahorros', value: '123-456789-01', type: 'account' },
          { label: 'NIT', value: '900.123.456-7', type: 'id' },
          { label: 'Nombre', value: 'LA WAFFLERIA SAS', type: 'business' }
        ]
      },
      'transferencia': {
        title: 'INFORMACIÓN TRANSFERENCIA BANCARIA',
        accounts: [
          { label: 'Banco', value: 'Bancolombia', type: 'bank' },
          { label: 'Cuenta Ahorros', value: '123-456789-01', type: 'account' },
          { label: 'Cuenta Corriente', value: '123-987654-32', type: 'account' },
          { label: 'NIT', value: '900.123.456-7', type: 'id' },
          { label: 'Nombre', value: 'LA WAFFLERIA SAS', type: 'business' }
        ]
      }
    };

    return paymentAccounts[paymentMethod?.toLowerCase()] || null;
  };

  const handleDownloadPDF = async () => {
    if (!ref.current) return;

    setIsGeneratingPDF(true);
    try {
      const canvas = await html2canvas(ref.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [80, 200] // Thermal printer format
      });

      const imgWidth = 80;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`recibo-${order?.id || 'pedido'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to regular download
      onDownload();
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleEmailReceipt = async () => {
    if (!order.customer?.email) {
      alert('No hay email del cliente disponible');
      return;
    }

    try {
      // Here you would integrate with your email service
      const receiptData = {
        to: order.customer.email,
        subject: `Recibo La Waffleria - Pedido ${order.id}`,
        orderId: order.id,
        total: order.total,
        customerName: order.customer.name
      };

      // Simulate email sending
      console.log('Sending email receipt:', receiptData);
      alert(`Recibo enviado a ${order.customer.email}`);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error al enviar el recibo por email');
    }
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

  const invoiceNumber = generateInvoiceNumber(order.id);
  const change = calculateChange(order);
  const cashier = getCurrentCashier();
  const paymentAccountInfo = getPaymentAccountInfo(order.paymentMethod);

  return (
    <div className="bg-white max-w-md mx-auto">
      {/* Enhanced Action Buttons */}
      <div className="no-print mb-4 grid grid-cols-2 gap-2">
        <button
          onClick={onPrint}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <FiPrinter className="h-4 w-4" />
          Imprimir
        </button>
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          <FiDownload className="h-4 w-4" />
          {isGeneratingPDF ? 'Generando...' : 'PDF'}
        </button>
        <button
          onClick={onWhatsAppShare}
          className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <span className="text-lg">📱</span>
          WhatsApp
        </button>
        <button
          onClick={onShare}
          className="bg-amber-600 text-white px-3 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <FiShare2 className="h-4 w-4" />
          Compartir Imagen
        </button>
      </div>

      {/* Enhanced Receipt Content */}
      <div
        ref={ref}
        className="bg-white p-6 border border-gray-200 font-mono text-sm text-black"
        style={{ width: '302px' }}
        id="receipt-content"
      >
        {/* Enhanced Header with Logo Space */}
        <div className="text-center mb-4">
          {/* Logo placeholder - replace with actual logo */}
          <div className="mb-3 flex justify-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center border-2 border-amber-300">
              <span className="text-2xl">🧇</span>
            </div>
          </div>

          <h1 className="text-lg font-bold mb-1 text-black">LA WAFFLERIA</h1>
          <p className="text-xs text-gray-600">Sistema POS Avanzado</p>
          <p className="text-xs text-black">Carrera 10 #15-25</p>
          <p className="text-xs text-black">Bogotá, Colombia</p>
          <p className="text-xs text-black">Tel: +57 1 234 5678</p>
          <p className="text-xs text-black">NIT: 900123456-7</p>
          <p className="text-xs text-black">Régimen Común</p>
        </div>

        <div className="border-t-2 border-double border-gray-400 my-3"></div>

        {/* Enhanced Order Info */}
        <div className="mb-4">
          <div className="text-center mb-2">
            <p className="font-bold text-sm text-black">FACTURA DE VENTA</p>
            <p className="text-xs text-black">No. {invoiceNumber}</p>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-black">
              <span>PEDIDO:</span>
              <span className="font-bold">#{order.id}</span>
            </div>
            <div className="flex justify-between text-xs text-black">
              <span>FECHA:</span>
              <span>{formatDateTime(order.createdAt)}</span>
            </div>
            <div className="flex justify-between text-xs text-black">
              <span>CAJERO:</span>
              <span>{cashier}</span>
            </div>
            {order.tableNumber && (
              <div className="flex justify-between text-xs text-black">
                <span>MESA:</span>
                <span>{order.tableNumber}</span>
              </div>
            )}
            <div className="flex justify-between text-xs text-black">
              <span>TIPO:</span>
              <span>
                {order.orderType === 'dine-in' ? 'COMER AQUÍ' :
                 order.orderType === 'takeaway' ? 'PARA LLEVAR' : 'DOMICILIO'}
              </span>
            </div>
            {order.customer?.name && (
              <>
                <div className="flex justify-between text-xs text-black">
                  <span>CLIENTE:</span>
                  <span>{order.customer.name}</span>
                </div>
                {order.customer.phone && (
                  <div className="flex justify-between text-xs text-black">
                    <span>TELÉFONO:</span>
                    <span>{order.customer.phone}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div className="border-t border-dashed border-gray-400 my-3"></div>

        {/* Enhanced Items Section */}
        <div className="mb-4">
          <div className="flex justify-between text-xs font-bold mb-2 border-b border-gray-300 pb-1 text-black">
            <span>PRODUCTO</span>
            <span>TOTAL</span>
          </div>

          {order.items.map((item, index) => {
            const itemPrice = item.totalPrice || item.price;
            const itemDiscount = item.discountType === 'percentage'
              ? (itemPrice * item.discount / 100)
              : item.discount || 0;
            const itemTotal = (itemPrice - itemDiscount) * item.quantity;

            return (
              <div key={index} className="mb-3 border-b border-gray-100 pb-2">
                <div className="flex justify-between">
                  <span className="text-xs font-medium flex-1 pr-2 text-black">{item.name}</span>
                  <span className="text-xs font-bold text-black">{formatCurrency(itemTotal)}</span>
                </div>

                <div className="text-xs text-gray-600 ml-2 mt-1">
                  {item.quantity} x {formatCurrency(itemPrice)}
                  {itemDiscount > 0 && (
                    <span className="text-green-600 ml-2">
                      (Desc: -{formatCurrency(itemDiscount)})
                    </span>
                  )}
                </div>

                {item.toppings && item.toppings.length > 0 && (
                  <div className="text-xs text-gray-600 ml-4 mt-1">
                    + {item.toppings.map(t => t.name).join(', ')}
                  </div>
                )}

                {item.notes && (
                  <div className="text-xs text-gray-600 ml-4 mt-1 italic">
                    "{item.notes}"
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
              <div className="text-xs font-medium text-black">NOTAS DEL PEDIDO:</div>
              <div className="text-xs text-gray-600 italic bg-gray-50 p-2 rounded">
                "{order.orderNotes}"
              </div>
            </div>
            <div className="border-t border-dashed border-gray-400 my-3"></div>
          </>
        )}

        {/* Enhanced Totals */}
        <div className="mb-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-black">
              <span>SUBTOTAL:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>

            <div className="flex justify-between text-xs text-black">
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
                  <div className="text-xs text-gray-600 text-center italic">
                    ({order.globalDiscountReason})
                  </div>
                )}
              </>
            )}
          </div>

          <div className="border-t-2 border-double border-gray-400 my-2"></div>

          <div className="flex justify-between text-base font-bold text-black">
            <span>TOTAL:</span>
            <span>{formatCurrency(order.total)}</span>
          </div>
        </div>

        <div className="border-t border-dashed border-gray-400 my-3"></div>

        {/* Enhanced Payment Info */}
        <div className="mb-4">
          <div className="text-xs font-medium mb-2 text-black">INFORMACIÓN DE PAGO:</div>

          {order.splitPayments && order.splitPayments.length > 0 ? (
            // Split payments
            <div className="space-y-1">
              {order.splitPayments.map((payment, index) => (
                <div key={index} className="flex justify-between text-xs text-black">
                  <span>
                    {payment.method === 'efectivo' ? 'EFECTIVO' :
                     payment.method === 'tarjeta' ? 'TARJETA' :
                     payment.method === 'nequi' ? 'NEQUI' : payment.method.toUpperCase()}
                  </span>
                  <span>{formatCurrency(payment.amount)}</span>
                </div>
              ))}
            </div>
          ) : (
            // Single payment
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-black">
                <span>MÉTODO:</span>
                <span>
                  {order.paymentMethod === 'efectivo' ? 'EFECTIVO' :
                   order.paymentMethod === 'tarjeta' ? 'TARJETA' :
                   order.paymentMethod === 'nequi' ? 'NEQUI' : order.paymentMethod?.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-xs text-black">
                <span>TOTAL PAGADO:</span>
                <span>{formatCurrency(order.total)}</span>
              </div>
            </div>
          )}

          {order.paymentMethod === 'efectivo' && (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs text-black">
                <span>RECIBIDO:</span>
                <span>{formatCurrency(order.amountReceived || order.total)}</span>
              </div>
              <div className="flex justify-between text-xs text-black">
                <span>CAMBIO:</span>
                <span className="font-bold">{formatCurrency(change)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Payment Account Information */}
        {paymentAccountInfo && (
          <>
            <div className="border-t border-dashed border-gray-400 my-3"></div>
            <div className="mb-4">
              <div className="text-xs font-medium mb-2 text-black text-center bg-gray-100 p-2 rounded">
                {paymentAccountInfo.title}
              </div>
              <div className="space-y-1 bg-gray-50 p-3 rounded">
                {paymentAccountInfo.accounts.map((account, index) => (
                  <div key={index} className="flex justify-between text-xs text-black">
                    <span className="font-medium">{account.label}:</span>
                    <span className="font-mono font-bold">{account.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs text-blue-600 font-medium">
                  📱 Envía tu comprobante de pago al WhatsApp
                </p>
                <p className="text-xs text-blue-600 font-mono">
                  +57 300 123 4567
                </p>
              </div>
            </div>
          </>
        )}

        <div className="border-t border-dashed border-gray-400 my-3"></div>

        {/* Enhanced Footer */}
        <div className="text-center text-xs space-y-2 text-black">
          <div className="mb-3">
            <p className="font-bold text-black">¡GRACIAS POR SU VISITA!</p>
            <p className="text-black">Vuelva pronto</p>
            <div className="flex justify-center items-center gap-1 mt-1">
              <span className="text-black">★★★★★</span>
            </div>
          </div>

          <div className="bg-gray-50 p-2 rounded">
            <p className="font-medium text-black">Síguenos en redes sociales</p>
            <p className="text-black">@LaWaffleria</p>
            <p className="text-black">Instagram | Facebook | TikTok</p>
          </div>

          <div className="text-xs space-y-1">
            <p className="text-black">Este documento es su comprobante de compra</p>
            <p className="text-black">Conservar para cambios y garantías</p>
            <p className="font-bold text-black">Software POS by Claude Code</p>
            <p className="text-black">Soporte: soporte@waffleria.com</p>
          </div>
        </div>

        {/* Enhanced QR Code with real generation */}
        <div className="text-center mt-4">
          {qrCodeDataUrl ? (
            <div>
              <img
                src={qrCodeDataUrl}
                alt="QR Code Encuesta"
                className="mx-auto mb-2"
                style={{ width: '64px', height: '64px' }}
              />
              <p className="text-xs text-black">Escaneá para calificar tu experiencia</p>
              <p className="text-xs text-gray-500">Tu opinión nos importa</p>
            </div>
          ) : (
            <div className="inline-block w-16 h-16 border border-gray-300 flex items-center justify-center text-xs">
              <FiSquare />
            </div>
          )}
        </div>

        {/* Barcode for internal tracking */}
        <div className="text-center mt-3 border-t border-dashed border-gray-300 pt-2">
          <div className="font-mono text-xs tracking-widest text-black">
            ||||| |||| || ||||| || ||||
          </div>
          <p className="text-xs text-gray-500 mt-1">{invoiceNumber}</p>
        </div>
      </div>
    </div>
  );
});

EnhancedReceipt.displayName = 'EnhancedReceipt';

export default EnhancedReceipt;