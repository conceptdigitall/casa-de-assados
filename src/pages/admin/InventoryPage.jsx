import React, { useState } from 'react';
import { AlertTriangle, Package, Check, Save, History, Plus, Search, Layers } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import Button from '../../components/shared/Button';

export default function InventoryPage() {
    const { products, inventoryLogs, updateProductStock } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [adjModal, setAdjModal] = useState({ open: false, product: null, amount: '', reason: '' });

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.barcode && p.barcode.includes(searchTerm))
    );

    const handleAdjSubmit = (e) => {
        e.preventDefault();
        if (!adjModal.product) return;
        const newStock = adjModal.product.stock + parseFloat(adjModal.amount);
        updateProductStock(adjModal.product.id, newStock, adjModal.reason);
        setAdjModal({ open: false, product: null, amount: '', reason: '' });
    };

    return (
        <div className="space-y-8 pb-10 text-text-primary">
            <header className="flex justify-between items-end mb-10">
                <div className="flex items-center gap-4">
                    <Layers size={32} className="text-brand" />
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-white uppercase tracking-wide">Gestão de Estoque</h1>
                        <p className="text-text-muted font-medium italic mt-1">Controle preciso de insumos e produtos</p>
                    </div>
                </div>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-brand transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar produto ou código..."
                        className="pl-12 pr-4 py-3 bg-surface border border-surface-light rounded-xl focus:border-brand/50 text-white outline-none w-72 transition-all shadow-sm focus:shadow-brand/10"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Products Table */}
                <div className="xl:col-span-2 space-y-4">
                    <div className="bg-surface rounded-2xl shadow-xl border border-surface-light overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#1A1A1A] border-b border-surface-light">
                                    <tr>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted">Produto</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted text-center">Tipo</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted text-center">Atual</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted text-center">Status</th>
                                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-text-muted text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-light/50">
                                    {filteredProducts.map(product => {
                                        const isLow = product.stock <= product.minStock;
                                        return (
                                            <tr key={product.id} className={`group hover:bg-surface-light/20 transition-colors ${isLow ? 'bg-danger/5' : ''}`}>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="h-12 w-12 rounded-xl bg-background overflow-hidden border border-surface-light flex-shrink-0">
                                                            <img src={product.image || 'https://via.placeholder.com/48?text=S/I'} alt="" className="h-full w-full object-cover opacity-80" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-white uppercase text-sm tracking-tight">{product.name}</div>
                                                            <div className="text-[10px] text-text-muted font-mono mt-1">
                                                                Mín: <span className="text-text-secondary">{product.minStock} {product.unit_type === 'kg' ? 'kg' : 'uni'}</span> 
                                                                {product.barcode && <span className="ml-2">| Cód: {product.barcode}</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-background border border-surface-light text-text-secondary px-3 py-1.5 rounded-md">
                                                        {product.unit_type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`font-mono font-black text-xl ${isLow ? 'text-danger' : 'text-white'}`}>
                                                        {product.unit_type === 'kg' ? product.stock.toFixed(3) : product.stock}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    {isLow ? (
                                                        <span className="inline-flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-danger bg-danger/10 border border-danger/20 px-3 py-1.5 rounded-full w-28">
                                                            <AlertTriangle size={12} /> Crítico
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-success bg-success/10 border border-success/20 px-3 py-1.5 rounded-full w-28">
                                                            <Check size={12} /> Normal
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => setAdjModal({ open: true, product, amount: '', reason: '' })}
                                                        className="p-3 bg-background hover:bg-brand hover:text-white border border-surface-light rounded-xl transition-all text-text-secondary group-hover:border-brand/30"
                                                        title="Ajuste Manual"
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {filteredProducts.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-text-muted italic">
                                                Nenhum produto encontrado na busca.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* History Sidebar */}
                <div className="bg-surface rounded-2xl p-6 border border-surface-light shadow-xl h-fit sticky top-8">
                    <h2 className="text-lg font-serif font-bold uppercase tracking-widest mb-6 flex items-center gap-3 text-white border-b border-surface-light pb-4">
                        <History size={20} className="text-brand" /> Histórico
                    </h2>
                    <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {inventoryLogs.slice(0, 20).map(log => {
                            const product = products.find(p => p.id === log.productId) || { name: 'Desconhecido', unit_type: 'unit' };
                            const isSale = log.type === 'sale';
                            const isPositive = log.changeAmount > 0;
                            return (
                                <div key={log.id} className="border-l-2 border-surface-light pl-4 py-1 relative group hover:border-brand/50 transition-colors">
                                    <div className={`absolute -left-[5px] top-2 h-2 w-2 rounded-full ${isSale ? 'bg-text-muted' : (isPositive ? 'bg-success' : 'bg-brand')}`} />
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                                                {new Date(log.createdAt || log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • <span className={isSale ? 'text-text-muted' : 'text-brand-light'}>{log.type === 'sale' ? 'VENDA' : 'AJUSTE'}</span>
                                            </div>
                                            <div className="font-bold text-sm text-white uppercase tracking-tight mt-1 truncate max-w-[150px]" title={product.name}>{product.name}</div>
                                            {log.reason && <div className="text-[10px] text-text-secondary mt-1 italic">{log.reason}</div>}
                                        </div>
                                        <div className={`font-mono font-black text-sm px-2 py-1 rounded bg-background border border-surface-light ${isPositive ? 'text-success' : 'text-brand'}`}>
                                            {isPositive ? '+' : ''}{log.changeAmount.toFixed(product.unit_type === 'kg' ? 3 : 0)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {inventoryLogs.length === 0 && (
                            <p className="text-text-muted italic text-center py-4">Nenhum evento registrado.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Adjustment Modal */}
            {adjModal.open && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-surface rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-surface-light scale-in-center">
                        <div className="bg-[#1A1A1A] p-6 border-b border-surface-light">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-serif font-bold text-white tracking-wide uppercase">Ajuste de Estoque</h3>
                                <div className="h-10 w-10 bg-background rounded-lg border border-surface-light flex items-center justify-center flex-shrink-0">
                                    <img src={adjModal.product?.image || 'https://via.placeholder.com/40'} alt="" className="h-8 w-8 object-cover rounded opacity-80" />
                                </div>
                            </div>
                            <p className="text-text-secondary text-xs mt-2 uppercase font-mono tracking-widest">
                                PRODUTO: <span className="text-brand-light font-bold">{adjModal.product?.name}</span>
                            </p>
                        </div>
                        <form onSubmit={handleAdjSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Quantidade da Mudança</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        step="0.001"
                                        required
                                        placeholder="Ex: -2.5 ou +10"
                                        className="w-full text-2xl font-black font-mono p-4 bg-background border border-surface-light rounded-xl focus:border-brand/50 text-white outline-none transition-colors"
                                        value={adjModal.amount}
                                        onChange={e => setAdjModal({ ...adjModal, amount: e.target.value })}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-black uppercase text-sm">
                                        {adjModal.product?.unit_type}
                                    </div>
                                </div>
                                <p className="text-[10px] text-text-muted mt-2 italic flex items-center gap-1">
                                    <AlertTriangle size={10} className="text-brand" /> Negativo (-) p/ saídas, Positivo (+) p/ entradas.
                                </p>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Motivo / Observação</label>
                                <input
                                    placeholder="Ex: Quebra, Devolução, etc."
                                    className="w-full p-4 bg-background border border-surface-light rounded-xl outline-none focus:border-brand/50 text-white transition-colors"
                                    value={adjModal.reason}
                                    onChange={e => setAdjModal({ ...adjModal, reason: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex gap-4 pt-4 border-t border-surface-light">
                                <Button variant="secondary" className="flex-1 bg-background text-text-primary hover:text-white" onClick={() => setAdjModal({ open: false, product: null, amount: '', reason: '' })}>Cancelar</Button>
                                <Button variant="primary" className="flex-1" type="submit">Confirmar Ajuste</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
