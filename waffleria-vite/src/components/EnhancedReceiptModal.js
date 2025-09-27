import React from 'react';
import { FiX, FiSettings, FiStar } from 'react-icons/fi';
import EnhancedReceipt from './EnhancedReceipt';

export const EnhancedReceiptModal = ({ isOpen, onClose, order }) => {
  const receiptRef = React.useRef();

  // FORCE UPDATE TEST - Should appear in console
  console.log('🔥 [FORCE UPDATE TEST] EnhancedReceiptModal loaded at:', new Date().toLocaleTimeString());

  // Debug logs
  React.useEffect(() => {
    console.log('🧾 [EnhancedReceiptModal] Props changed:', {
      isOpen,
      hasOrder: !!order,
      orderId: order?.id
    });

    if (isOpen) {
      console.log('🎪 [EnhancedReceiptModal] Modal should be VISIBLE now!');
      console.log('📋 [EnhancedReceiptModal] Order data:', order);
    } else {
      console.log('🚫 [EnhancedReceiptModal] Modal should be HIDDEN - WHY?');
      console.trace('🔍 Stack trace for modal hide:');
    }
  }, [isOpen, order]);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const receiptElement = receiptRef.current;

    if (receiptElement && printWindow) {
      const receiptHTML = receiptElement.outerHTML;

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Recibo - Pedido ${order?.id}</title>
            <style>
              @media print {
                body { margin: 0; padding: 0; }
                .no-print { display: none !important; }
                @page {
                  size: 80mm auto;
                  margin: 5mm;
                }
              }
              body {
                font-family: 'Courier New', monospace;
                font-size: 12px;
                line-height: 1.4;
              }
            </style>
          </head>
          <body>
            ${receiptHTML}
          </body>
        </html>
      `);

      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  const handleDownload = () => {
    // This will be handled by the EnhancedReceipt component
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
    if (!receiptRef.current) return;

    try {
      // Import html2canvas dynamically
      const html2canvas = (await import('html2canvas')).default;

      // Generate canvas from receipt
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: receiptRef.current.offsetWidth,
        height: receiptRef.current.offsetHeight
      });

      // Convert to blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          throw new Error('Failed to generate image');
        }

        const file = new File([blob], `recibo-${order?.id || 'pedido'}.png`, {
          type: 'image/png'
        });

        // Try to share image if supported
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: `Recibo La Waffleria - ${order?.id}`,
              text: `Recibo de compra - Total: ${order?.total ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(order.total) : 'N/A'}`,
              files: [file]
            });
            return;
          } catch (shareError) {
            console.log('Error sharing image:', shareError);
          }
        }

        // Fallback: Download image
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recibo-${order?.id || 'pedido'}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('Imagen del recibo descargada. Puedes compartirla desde tu galería.');

      }, 'image/png', 0.95);

    } catch (error) {
      console.error('Error generating receipt image:', error);

      // Final fallback: copy text to clipboard
      const receiptContent = receiptRef.current?.innerText || '';
      try {
        await navigator.clipboard.writeText(receiptContent);
        alert('Recibo copiado al portapapeles como texto');
      } catch (clipboardError) {
        alert('No se pudo generar la imagen ni copiar al portapapeles');
      }
    }
  };

  const handleWhatsAppShare = async () => {
    if (!order) return;

    // Format receipt as WhatsApp message
    const formatCurrency = (amount) => new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);

    const formatDateTime = (date) => new Date(date).toLocaleString('es-CO', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });

    const whatsappMessage = `🧇 *LA WAFFLERIA*
📋 *Recibo de Compra*

📝 *Pedido:* ${order.id}
📅 *Fecha:* ${formatDateTime(order.createdAt)}
${order.tableNumber ? `🪑 *Mesa:* ${order.tableNumber}\n` : ''}
${order.customer?.name ? `👤 *Cliente:* ${order.customer.name}\n` : ''}

🛍️ *PRODUCTOS:*
${order.items.map(item => {
  const itemPrice = item.totalPrice || item.price;
  const itemTotal = itemPrice * item.quantity;
  return `• ${item.name}\n  ${item.quantity} x ${formatCurrency(itemPrice)} = ${formatCurrency(itemTotal)}`;
}).join('\n')}

💰 *RESUMEN:*
Subtotal: ${formatCurrency(order.subtotal)}
IVA (19%): ${formatCurrency(order.taxes)}
${order.globalDiscount > 0 ? `Descuento: -${formatCurrency(order.globalDiscount)}\n` : ''}*TOTAL: ${formatCurrency(order.total)}*

💳 *Pago:* ${order.paymentMethod === 'efectivo' ? 'Efectivo' : order.paymentMethod === 'tarjeta' ? 'Tarjeta' : order.paymentMethod}

${getPaymentAccountText(order.paymentMethod)}

¡Gracias por tu visita! 🙏
_La Waffleria - Sistema POS_`;

    function getPaymentAccountText(paymentMethod) {
      const paymentAccounts = {
        'nequi': `💳 *DATOS PARA PAGO NEQUI:*
📱 Número: +57 300 123 4567
👤 Nombre: LA WAFFLERIA SAS

📲 Envía tu comprobante al WhatsApp +57 300 123 4567`,
        'daviplata': `💳 *DATOS PARA PAGO DAVIPLATA:*
📱 Número: +57 300 987 6543
👤 Nombre: LA WAFFLERIA SAS

📲 Envía tu comprobante al WhatsApp +57 300 123 4567`,
        'pse': `💳 *DATOS PARA TRANSFERENCIA PSE:*
🏦 Banco: Bancolombia
💰 Cuenta Ahorros: 123-456789-01
🆔 NIT: 900.123.456-7
👤 Nombre: LA WAFFLERIA SAS

📲 Envía tu comprobante al WhatsApp +57 300 123 4567`,
        'transferencia': `💳 *DATOS PARA TRANSFERENCIA:*
🏦 Banco: Bancolombia
💰 Cuenta Ahorros: 123-456789-01
💰 Cuenta Corriente: 123-987654-32
🆔 NIT: 900.123.456-7
👤 Nombre: LA WAFFLERIA SAS

📲 Envía tu comprobante al WhatsApp +57 300 123 4567`
      };

      return paymentAccounts[paymentMethod?.toLowerCase()] || '';
    }

    try {
      // Try to copy to clipboard first
      await navigator.clipboard.writeText(whatsappMessage);

      // Open WhatsApp with the message
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');

    } catch (error) {
      console.error('Error sharing to WhatsApp:', error);
      alert('No se pudo preparar el mensaje para WhatsApp');
    }
  };

  console.log('🔍 [EnhancedReceiptModal] Render check - isOpen:', isOpen, 'order:', !!order);

  if (!isOpen) {
    console.log('❌ [EnhancedReceiptModal] Returning null because isOpen is false');
    return null;
  }

  console.log('✅ [EnhancedReceiptModal] Rendering modal!');

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
         style={{ zIndex: 100 }}>
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[95vh] overflow-hidden shadow-2xl">
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <FiStar className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Recibo Generado</h3>
                <p className="text-amber-100 text-sm">Pedido #{order?.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Receipt Content Area */}
        <div className="p-4 overflow-auto max-h-[70vh]">
          {!order ? (
            <div className="text-center p-8">
              <p className="text-gray-500 mb-2">❌ No hay datos de orden</p>
              <p className="text-xs text-gray-400">order is: {JSON.stringify(order)}</p>
            </div>
          ) : (
            <div>
              <div className="text-center p-2 bg-green-100 mb-4">
                <p className="text-green-800 text-sm">✅ Orden encontrada: {order.id}</p>
                <p className="text-xs text-gray-600">Items: {order.items?.length || 0}</p>
              </div>
              <EnhancedReceipt
                ref={receiptRef}
                order={order}
                onPrint={handlePrint}
                onDownload={handleDownload}
                onShare={handleShare}
                onWhatsAppShare={handleWhatsAppShare}
              />
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="border-t bg-gray-50 p-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onClose}
              className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                handlePrint();
                setTimeout(onClose, 1000); // Close modal after printing
              }}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <FiSettings className="h-4 w-4" />
              Imprimir y Cerrar
            </button>
          </div>

          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              Recibo generado automáticamente • {new Date().toLocaleDateString('es-CO')}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};