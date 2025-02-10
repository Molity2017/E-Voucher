import { useState } from 'react';
import { BinanceService } from '../services/binanceService';
import { BinanceOrder } from '../types/orders';
import { ApiKeyManager } from './ApiKeyManager';

export const BinanceTab = () => {
    const [orders, setOrders] = useState<BinanceOrder[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [, setBinanceService] = useState<BinanceService | null>(null);

    const handleKeysSubmit = async (apiKey: string, secretKey: string) => {
        try {
            setLoading(true);
            setError(null);
            const service = new BinanceService(apiKey, secretKey);
            const fetchedOrders = await service.getP2POrders();
            setOrders(fetchedOrders);
            setBinanceService(service);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <ApiKeyManager onKeysSubmit={handleKeysSubmit} />
            
            {error && (
                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="text-center p-4">جاري التحميل...</div>
            ) : orders.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border">
                    {/* عرض الأوردرات */}
                    <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-4 text-right">رقم الأوردر</th>
                                    <th className="p-4 text-right">النوع</th>
                                    <th className="p-4 text-right">المبلغ (جنيه)</th>
                                    <th className="p-4 text-right">الكمية (USDT)</th>
                                    <th className="p-4 text-right">اليوزد الفعلي</th>
                                    <th className="p-4 text-right">السعر</th>
                                    <th className="p-4 text-right">الرسوم (USDT)</th>
                                    <th className="p-4 text-right">الحالة</th>
                                    <th className="p-4 text-right">التاريخ</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr 
                                        key={order.orderId}
                                        className={
                                            order.status === 'CANCELLED' ? 'bg-white' :
                                            order.type === 'BUY' ? 'bg-green-50' : 'bg-red-50'
                                        }
                                    >
                                        <td className="p-4">
                                            <span 
                                                className="cursor-pointer hover:text-blue-500"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(order.orderId);
                                                    // اختياري: يمكن إضافة إشعار هنا لإخبار المستخدم أنه تم النسخ
                                                }}
                                                title="انقر للنسخ"
                                            >
                                                ...{order.orderId.slice(-5)}
                                            </span>
                                        </td>
                                        <td className="p-4">{order.type === 'BUY' ? 'شراء' : 'بيع'}</td>
                                        <td className="p-4">{order.fiatAmount.toFixed(2)}</td>
                                        <td className="p-4">{order.cryptoAmount.toFixed(2)}</td>
                                        <td className="p-4">{order.actualUsdt.toFixed(2)}</td>
                                        <td className="p-4">{order.price.toFixed(2)}</td>
                                        <td className="p-4">
                                            {order.fee === 0 ? `0.05 🔄` : order.fee.toFixed(2)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={
                                                order.status === 'COMPLETED' ? 'text-green-500' :
                                                order.status === 'CANCELLED' ? 'text-red-500' : 'text-gray-500'
                                            }>
                                                {order.status === 'COMPLETED' ? '✅' :
                                                 order.status === 'CANCELLED' ? '❌' : '⏳'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {new Date(order.createTime).toLocaleString('ar-EG')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-4 text-sm text-gray-600 space-y-1 p-4 bg-gray-50 rounded">
                            <p className="font-bold mb-2">دليل الألوان والعلامات:</p>
                            <p><span className="inline-block w-4 h-4 bg-green-50 border border-green-200"></span> خلفية خضراء: أوردر شراء</p>
                            <p><span className="inline-block w-4 h-4 bg-red-50 border border-red-200"></span> خلفية حمراء: أوردر بيع</p>
                            <p><span className="inline-block w-4 h-4 bg-white border"></span> بدون خلفية: أوردر ملغي</p>
                            <p>🔄 علامة بجانب الرسوم: Taker order (رسوم 0.05)</p>
                            <p>بدون علامة: Maker order</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
