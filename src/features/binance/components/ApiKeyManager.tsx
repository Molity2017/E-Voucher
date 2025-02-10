import { useState, useEffect } from 'react';

interface SavedKey {
    name: string;
    apiKey: string;
    secretKey: string;
}

export const ApiKeyManager = ({ onKeysSubmit }: { onKeysSubmit: (apiKey: string, secretKey: string) => void }) => {
    const [keys, setKeys] = useState({ name: '', apiKey: '', secretKey: '' });
    const [savedKeys, setSavedKeys] = useState<SavedKey[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('binanceKeys');
        if (saved) setSavedKeys(JSON.parse(saved));
    }, []);

    const handleSave = () => {
        if (!keys.name || !keys.apiKey || !keys.secretKey) return;
        const updated = [...savedKeys, keys];
        localStorage.setItem('binanceKeys', JSON.stringify(updated));
        setSavedKeys(updated);
        setKeys({ name: '', apiKey: '', secretKey: '' });
    };

    const handleClear = () => {
        setKeys({ name: '', apiKey: '', secretKey: '' });
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm border" dir="rtl">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">إعدادات مفاتيح Binance API</h2>
                {savedKeys.length > 0 && (
                    <select 
                        className="p-2 border rounded-md bg-gray-50 hover:bg-white transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        onChange={e => {
                            const selected = savedKeys.find(k => k.name === e.target.value);
                            if (selected) setKeys(selected);
                        }}
                        value={keys.name}
                    >
                        <option value="">المفاتيح المحفوظة</option>
                        {savedKeys.map(key => (
                            <option key={key.name} value={key.name}>{key.name}</option>
                        ))}
                    </select>
                )}
            </div>
            <div className="flex items-center gap-3">
                <div className="flex-1">
                    <input
                        placeholder="اسم المفتاح"
                        value={keys.name}
                        onChange={e => setKeys({ ...keys, name: e.target.value })}
                        className="w-full p-2 border rounded-md bg-gray-50 hover:bg-white transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                </div>
                <div className="flex-1">
                    <input
                        placeholder="API Key"
                        value={keys.apiKey}
                        onChange={e => setKeys({ ...keys, apiKey: e.target.value })}
                        className="w-full p-2 border rounded-md font-mono text-sm bg-gray-50 hover:bg-white transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        dir="ltr"
                    />
                </div>
                <div className="flex-1">
                    <input
                        type="password"
                        placeholder="Secret Key"
                        value={keys.secretKey}
                        onChange={e => setKeys({ ...keys, secretKey: e.target.value })}
                        className="w-full p-2 border rounded-md font-mono text-sm bg-gray-50 hover:bg-white transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        dir="ltr"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleClear}
                        className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 outline-none"
                    >
                        مسح
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors focus:ring-2 focus:ring-green-500 focus:ring-offset-2 outline-none"
                    >
                        حفظ
                    </button>
                    <button
                        onClick={() => onKeysSubmit(keys.apiKey, keys.secretKey)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 outline-none"
                    >
                        اتصال
                    </button>
                </div>
            </div>
        </div>
    );
};
