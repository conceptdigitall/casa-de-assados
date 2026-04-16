import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import Button from '../../components/shared/Button';
import { Bike, Plus, Trash2, DollarSign, FileText, MapPin, User, Activity } from 'lucide-react';

export default function CouriersPage() {
    const { couriers, deliveryFees, orders, addCourier, removeCourier, addDeliveryFee, removeDeliveryFee } = useStore();
    const [activeTab, setActiveTab] = useState('couriers'); // couriers, fees, report

    // Local state for forms
    const [newCourierName, setNewCourierName] = useState('');
    const [newFeeName, setNewFeeName] = useState('');
    const [newFeePrice, setNewFeePrice] = useState('');

    const handleAddCourier = (e) => {
        e.preventDefault();
        addCourier(newCourierName);
        setNewCourierName('');
    };

    const handleAddFee = (e) => {
        e.preventDefault();
        addDeliveryFee(newFeeName, newFeePrice);
        setNewFeeName('');
        setNewFeePrice('');
    };

    // Calculate Report Data
    const getReportData = () => {
        return couriers.map(courier => {
            const courierOrders = orders.filter(o => o.courierId === courier.id);
            const totalDeliveries = courierOrders.length;
            const totalEarnings = courierOrders.reduce((acc, o) => acc + (o.deliveryFee || 0), 0);

            // Collect unique zones
            const zones = [...new Set(courierOrders.map(o => o.deliveryZone).filter(Boolean))];

            return { ...courier, totalDeliveries, totalEarnings, zones };
        });
    };

    return (
        <div className="pb-10 text-text-primary animate-in fade-in duration-500">
            <header className="flex flex-col gap-6 mb-10 border-b border-surface-light pb-6">
                <div className="flex items-center gap-4">
                    <Bike size={32} className="text-brand" />
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-white uppercase tracking-wide">Gestão de Entregas</h1>
                        <p className="text-text-muted font-medium italic mt-1">Gerencie motoboys, áreas de entrega e relatórios</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-4 md:gap-6 mt-4">
                    <button
                        onClick={() => setActiveTab('couriers')}
                        className={`pb-4 px-2 font-black text-xs tracking-widest uppercase transition-all border-b-2
                            ${activeTab === 'couriers' ? 'border-brand text-brand' : 'border-transparent text-text-muted hover:text-white'}
                        `}
                    >
                        Motoboys
                    </button>
                    <button
                        onClick={() => setActiveTab('fees')}
                        className={`pb-4 px-2 font-black text-xs tracking-widest uppercase transition-all border-b-2
                            ${activeTab === 'fees' ? 'border-brand text-brand' : 'border-transparent text-text-muted hover:text-white'}
                        `}
                    >
                        Bairros & Taxas
                    </button>
                    <button
                        onClick={() => setActiveTab('report')}
                        className={`pb-4 px-2 font-black text-xs tracking-widest uppercase transition-all border-b-2
                            ${activeTab === 'report' ? 'border-brand text-brand' : 'border-transparent text-text-muted hover:text-white'}
                        `}
                    >
                        Relatório Diário
                    </button>
                </div>
            </header>

            {/* Content */}
            <div className="bg-surface rounded-2xl border border-surface-light overflow-hidden shadow-xl">
                {/* 1. Motoboys Tab */}
                {activeTab === 'couriers' && (
                    <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="mb-8 p-6 bg-background rounded-2xl border border-surface-light flex flex-col md:flex-row gap-6 items-end">
                            <div className="flex-1 w-full">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Cadastrar Novo Motoboy</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Nome do Motoboy..."
                                        value={newCourierName}
                                        onChange={(e) => setNewCourierName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-[#1A1A1A] border-2 border-surface-light rounded-xl text-white focus:outline-none focus:border-brand/50 transition-colors placeholder:text-text-muted/50"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && newCourierName) {
                                                handleAddCourier(e);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                            <Button 
                                variant="primary" 
                                onClick={handleAddCourier} 
                                disabled={!newCourierName}
                                className="h-[60px] px-8 bg-brand hover:bg-brand-light text-white shadow-lg shadow-brand/20 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto justify-center"
                            >
                                <Plus size={20} className="mr-2" /> Adicionar
                            </Button>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-black uppercase text-text-muted tracking-widest mb-4">Motoboys Ativos ({couriers.length})</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {couriers.map(courier => (
                                    <div key={courier.id} className="p-5 bg-background border border-surface-light rounded-2xl flex justify-between items-center group transition-all hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-brand/10 text-brand rounded-full flex items-center justify-center">
                                                <Bike size={18} />
                                            </div>
                                            <span className="font-bold text-white uppercase tracking-tight">{courier.name}</span>
                                        </div>
                                        <button
                                            onClick={() => removeCourier(courier.id)}
                                            className="h-10 w-10 border border-surface-light rounded-xl flex items-center justify-center text-text-muted hover:text-danger hover:border-danger hover:bg-danger/10 transition-colors"
                                            title="Remover Motoboy"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                                {couriers.length === 0 && (
                                    <div className="col-span-full p-8 border border-dashed border-surface-light rounded-2xl text-center text-text-muted italic flex flex-col items-center gap-2">
                                        <User size={24} className="text-surface-light" />
                                        Nenhum motoboy cadastrado no sistema.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Fees Tab */}
                {activeTab === 'fees' && (
                    <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="mb-8 p-6 bg-background rounded-2xl border border-surface-light flex flex-col md:flex-row gap-6 items-end">
                            <div className="flex-[2] w-full">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Bairro / Região</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Ex: Jardim Casqueiro..."
                                        value={newFeeName}
                                        onChange={(e) => setNewFeeName(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 bg-[#1A1A1A] border-2 border-surface-light rounded-xl text-white focus:outline-none focus:border-brand/50 transition-colors placeholder:text-text-muted/50"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 w-full">
                                <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Valor da Taxa (R$)</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-black">R$</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={newFeePrice}
                                        onChange={(e) => setNewFeePrice(e.target.value)}
                                        step="0.50"
                                        min="0"
                                        className="w-full pl-12 pr-4 py-4 bg-[#1A1A1A] border-2 border-surface-light rounded-xl text-white font-mono focus:outline-none focus:border-brand/50 transition-colors placeholder:text-text-muted/50"
                                    />
                                </div>
                            </div>
                            <Button 
                                variant="primary" 
                                onClick={handleAddFee}
                                disabled={!newFeeName || !newFeePrice}
                                className="h-[60px] px-8 bg-brand hover:bg-brand-light text-white shadow-lg shadow-brand/20 disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto justify-center"
                            >
                                <Plus size={20} className="mr-2" /> Adicionar Taxa
                            </Button>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-black uppercase text-text-muted tracking-widest mb-4">Zonas de Entrega Configuradas ({deliveryFees.length})</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {deliveryFees.map(fee => (
                                    <div key={fee.id} className="p-5 bg-background border border-surface-light rounded-2xl flex justify-between items-center group transition-all hover:border-brand/30">
                                        <div className="flex items-center gap-3">
                                            <MapPin size={18} className="text-text-muted group-hover:text-brand transition-colors" />
                                            <span className="font-bold text-white">{fee.name}</span>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="text-brand font-mono font-black text-xl">
                                                <span className="text-sm mr-1">R$</span>{parseFloat(fee.price).toFixed(2)}
                                            </span>
                                            <button
                                                onClick={() => removeDeliveryFee(fee.id)}
                                                className="h-10 w-10 border border-surface-light rounded-xl flex items-center justify-center text-text-muted hover:text-danger hover:border-danger hover:bg-danger/10 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {deliveryFees.length === 0 && (
                                    <div className="col-span-full p-8 border border-dashed border-surface-light rounded-2xl text-center text-text-muted italic flex flex-col items-center gap-2">
                                        <MapPin size={24} className="text-surface-light" />
                                        Nenhuma taxa configurada. O sistema exibirá "Balcão" ou isento.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Report Tab */}
                {activeTab === 'report' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="p-6 bg-background border-b border-surface-light flex items-center gap-3">
                            <Activity className="text-brand" size={24} />
                            <div>
                                <h3 className="text-white font-bold uppercase tracking-tight">Desempenho Diário</h3>
                                <p className="text-text-secondary text-xs italic">Acompanhe as entregas realizadas por cada motoboy</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto min-h-[300px]">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#1A1A1A]">
                                    <tr className="border-b border-surface-light">
                                        <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-text-muted font-black w-1/4">Motoboy</th>
                                        <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-text-muted font-black">Locais de Entrega Atendidos</th>
                                        <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-text-muted font-black text-center">Volume</th>
                                        <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-text-muted font-black text-right">Total Acumulado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-light/50">
                                    {getReportData().map(data => (
                                        <tr key={data.id} className="hover:bg-surface-light/20 transition-colors group">
                                            <td className="px-8 py-6 font-bold text-white uppercase tracking-tight flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-surface-light flex items-center justify-center text-xs">
                                                    {data.name.substring(0,2)}
                                                </div>
                                                {data.name}
                                            </td>
                                            <td className="px-8 py-6">
                                                {data.zones.length > 0 ? (
                                                    <div className="flex flex-wrap gap-2">
                                                        {data.zones.map((zone, idx) => (
                                                            <span key={idx} className="bg-background text-text-secondary px-3 py-1.5 rounded-lg text-[10px] uppercase font-bold tracking-wider border border-surface-light">
                                                                {zone}
                                                            </span>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-text-muted italic text-sm">Sem entregas registradas</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="inline-block bg-brand/10 text-brand px-4 py-1.5 rounded-full text-xs font-black border border-brand/20">
                                                    {data.totalDeliveries} <span className="font-normal text-[10px]">entregas</span>
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="font-mono font-black text-white text-xl group-hover:text-brand-light transition-colors">
                                                    <span className="text-text-muted text-sm mr-1">R$</span>
                                                    {data.totalEarnings.toFixed(2)}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {couriers.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-8 py-12 text-center text-text-muted italic flex-col items-center gap-3">
                                                <FileText size={32} className="mx-auto mb-3 text-surface-light" />
                                                Não há dados para gerar o relatório atual.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
