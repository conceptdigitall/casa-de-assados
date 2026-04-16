import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CalendarDays, Flame, Plus } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';

const EXTRAS = [
    { name: "Salada à parte", price: "3,00" },
    { name: "Marmita com divisória", price: "5,00" },
    { name: "Ovo Frito", price: "3,00" },
    { name: "Porção de Batata Frita", price: "12,00" }
];

const BEBIDAS_LIST = [
    { id: 'bev-coca-2l', name: "Coca 2 L", price: "18,00", category: 'Bebidas' },
    { id: 'bev-fanta-2l', name: "Fanta 2 L", price: "16,00", category: 'Bebidas' },
    { id: 'bev-guarana-2l', name: "Guaraná 2L", price: "16,00", category: 'Bebidas' },
    { id: 'bev-sprite-2l', name: "Sprite 2 L", price: "16,00", category: 'Bebidas' },
    { id: 'bev-itubaina-2l', name: "Itubaina 2L", price: "12,00", category: 'Bebidas' },
    { id: 'bev-coca-600', name: "Coca 600ml", price: "9,00", category: 'Bebidas' },
    { id: 'bev-fanta-600', name: "Fanta 600ml", price: "9,00", category: 'Bebidas' },
    { id: 'bev-sprite-600', name: "Sprite 600ml", price: "9,00", category: 'Bebidas' },
    { id: 'bev-guarana-600', name: "Guaraná 600ml", price: "9,00", category: 'Bebidas' },
    { id: 'bev-coca-lata', name: "Coca Lata", price: "7,00", category: 'Bebidas' },
    { id: 'bev-fanta-lata', name: "Fanta lata", price: "7,00", category: 'Bebidas' },
    { id: 'bev-guarana-lata', name: "Guaraná lata", price: "7,00", category: 'Bebidas' },
    { id: 'bev-sprite-lata', name: "Sprite lata", price: "7,00", category: 'Bebidas' },
    { id: 'bev-itubaina-lata', name: "Itubaina lata", price: "6,00", category: 'Bebidas' },
    { id: 'bev-suco-uva', name: "Suco Lata UVA", price: "9,00", category: 'Bebidas' },
    { id: 'bev-suco-mara', name: "Suco Lata MARACUJÁ", price: "9,00", category: 'Bebidas' },
    { id: 'bev-suco-manga', name: "Suco Lata MANGA", price: "9,00", category: 'Bebidas' },
    { id: 'bev-suco-pessego', name: "Suco Lata PÊSSEGO", price: "9,00", category: 'Bebidas' }
];

export default function DailyMenu() {
    const { dailyMenus } = useStore();
    const { addToCart, setIsCartOpen } = useCart();
    const today = new Date().getDay();
    const activeDayKey = dailyMenus?.[today] ? today : 2; // se for segunda cai pra terça
    const todayMenu = dailyMenus?.[activeDayKey] || null;
    
    const [showAll, setShowAll] = useState(false);
    const [selectedTab, setSelectedTab] = useState(activeDayKey);

    if (!dailyMenus || !todayMenu) return null;

    const handleAddItem = (item, type = 'Marmita do Dia') => {
        let numericPrice = item.price;
        if (typeof numericPrice === 'string') {
            numericPrice = parseFloat(numericPrice.replace('.', '').replace(',', '.'));
        }

        const productPayload = {
            id: item.id || `daily-${item.name.toLowerCase().replace(/\s+/g, '-')}`,
            name: item.name,
            price: numericPrice,
            stock: 99,
            image: item.image || '/images/fallback.png',
            category: type,
            description: `Opção: ${type}`
        };
        addToCart(productPayload, 1, '');
        setIsCartOpen(true);
    };

    const renderMenuItems = (items, categoryLabel = 'Marmita do Dia') => (
        <ul className="space-y-3">
            {items.map((item, idx) => (
                <motion.li 
                    key={idx} 
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddItem(item, categoryLabel)}
                    className="flex justify-between items-center border border-surface-light bg-surface/20 p-4 rounded-xl cursor-pointer hover:bg-surface-light/20 hover:border-brand/40 transition-all group"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-surface-light/50 text-text-muted group-hover:bg-brand/20 group-hover:text-brand p-1.5 rounded-full transition-colors">
                            <Plus size={16} />
                        </div>
                        <span className="text-white md:text-lg font-medium">{item.name}</span>
                    </div>
                    <span className="text-brand font-bold whitespace-nowrap pl-4">R$ {item.price}</span>
                </motion.li>
            ))}
        </ul>
    );

    const renderMenuDay = (menuData) => {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-4xl mx-auto px-6 py-8 bg-surface/30 border border-surface-light backdrop-blur-md rounded-sm"
            >
                <div className="text-center mb-10">
                    <h3 className="font-serif text-4xl text-brand font-bold uppercase tracking-widest">{menuData.name}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Tradicionais */}
                    {menuData.tradicionais && (
                        <div>
                            <h4 className="text-text-muted text-sm tracking-[0.2em] uppercase mb-6 flex items-center gap-2">
                                <Flame size={16} className="text-brand" /> Marmitas Tradicionais
                            </h4>
                            {renderMenuItems(menuData.tradicionais, 'Marmitas Tradicionais')}
                        </div>
                    )}

                    {/* Especiais / Marmitas */}
                    {(menuData.especiais || menuData.marmitas) && (
                        <div>
                            <h4 className="text-text-muted text-sm tracking-[0.2em] uppercase mb-6 flex items-center gap-2">
                                <Flame size={16} className="text-brand" /> {menuData.marmitas ? 'Marmitas' : 'Marmitas Especiais'}
                            </h4>
                            {renderMenuItems(menuData.especiais || menuData.marmitas, menuData.marmitas ? 'Marmitas' : 'Marmitas Especiais')}
                        </div>
                    )}
                </div>

                {/* Carnes Assadas e Acompanhamentos */}
                {(menuData.carnesAssadas || menuData.acompanhamentos) && (
                    <div className="mt-12 pt-8 border-t border-surface-light/30">
                        {menuData.carnesAssadas && (
                            <div className="text-center mb-8">
                                <h4 className="text-text-muted text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-2 mb-2">
                                    <Flame size={16} className="text-brand"/> Carnes Assadas R$ {menuData.precoKg} O KG
                                </h4>
                                <p className="text-white text-lg">{menuData.carnesAssadas}</p>
                            </div>
                        )}
                        {menuData.frangoAssado && (
                            <div className="text-center mb-8">
                                <h4 className="text-white text-xl font-bold uppercase tracking-widest">
                                    FRANGO ASSADO <span className="text-brand">R$ {menuData.frangoAssado}</span>
                                </h4>
                            </div>
                        )}
                        {menuData.acompanhamentos && (
                            <div className="max-w-md mx-auto">
                                <h4 className="text-text-muted text-sm tracking-[0.2em] uppercase mb-6 text-center">Acompanhamentos</h4>
                                {renderMenuItems(menuData.acompanhamentos, 'Acompanhamentos')}
                            </div>
                        )}
                    </div>
                )}

                {/* Extras Shared */}
                <div className="mt-12 pt-8 border-t border-surface-light/30 flex flex-col md:flex-row flex-wrap justify-center gap-6 text-center">
                    {EXTRAS.map((extra, idx) => (
                        <motion.div 
                            key={idx} 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAddItem(extra, 'Extras')}
                            className="bg-surface/20 border border-surface-light hover:border-brand/50 hover:bg-surface/40 px-4 py-2 rounded-full cursor-pointer flex items-center gap-2 transition-colors group"
                        >
                            <Plus size={14} className="text-brand opacity-60 group-hover:opacity-100" />
                            <span className="text-text-secondary uppercase tracking-wider text-xs">{extra.name}</span>
                            <span className="text-brand font-bold text-sm bg-brand/10 px-2 py-0.5 rounded-full">R$ {extra.price}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        );
    };

    return (
        <section id="daily-menu" className="py-24 bg-background relative overflow-hidden">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                <p className="text-brand text-xs tracking-[0.3em] uppercase mb-4">Cardápio do Dia</p>
                <h2 className="font-serif text-4xl md:text-5xl text-white font-bold mb-4">Hoje na Brasa</h2>
                <p className="text-text-muted max-w-2xl mx-auto">Confira as opções exclusivas de marmitas e assados que separamos para hoje. O tempero certo e o preparo ideal.</p>
            </div>

            {/* Today Menu */}
            {!showAll && (
                <div className="mb-12">
                     {renderMenuDay(todayMenu)}
                </div>
            )}

            {/* All Menus */}
            <AnimatePresence>
                {showAll && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-12 w-full max-w-5xl mx-auto"
                    >
                        {/* Tabs */}
                        <div className="flex flex-wrap justify-center gap-2 mb-8 px-4">
                            {[2, 3, 4, 5, 6, 0].map(dayKey => (
                                <button
                                    key={dayKey}
                                    onClick={() => setSelectedTab(dayKey)}
                                    className={`px-4 py-2 text-xs uppercase tracking-widest font-bold transition-colors ${
                                        selectedTab === dayKey 
                                        ? 'bg-brand text-background' 
                                        : 'bg-surface border border-surface-light text-text-muted hover:text-white'
                                    }`}
                                >
                                    {dailyMenus[dayKey].name}
                                </button>
                            ))}
                            <button
                                onClick={() => setSelectedTab('bebidas')}
                                className={`px-4 py-2 text-xs uppercase tracking-widest font-bold transition-colors flex items-center gap-2 ${
                                    selectedTab === 'bebidas' 
                                    ? 'bg-brand text-background' 
                                    : 'bg-surface border border-surface-light text-text-muted hover:text-white'
                                }`}
                            >
                                🥤 BEBIDAS
                            </button>
                        </div>
                        {selectedTab === 'bebidas' ? (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-4xl mx-auto px-6 py-8 bg-surface/30 border border-surface-light backdrop-blur-md rounded-sm"
                            >
                                <div className="text-center mb-8">
                                    <h3 className="font-serif text-4xl text-brand font-bold uppercase tracking-widest italic flex items-center justify-center gap-3">
                                        Nossas Bebidas
                                    </h3>
                                </div>
                                <div className="max-h-[460px] overflow-y-auto pr-2 overflow-x-hidden" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--color-brand) var(--color-surface-light)' }}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-0">
                                        {renderMenuItems(BEBIDAS_LIST.slice(0, Math.ceil(BEBIDAS_LIST.length / 2)), 'Bebidas')}
                                        {renderMenuItems(BEBIDAS_LIST.slice(Math.ceil(BEBIDAS_LIST.length / 2)), 'Bebidas')}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            renderMenuDay(dailyMenus[selectedTab])
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <div className="text-center">
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="inline-flex items-center gap-2 text-text-muted hover:text-brand border-b border-text-muted hover:border-brand pb-1 transition-all uppercase tracking-widest text-xs font-bold"
                >
                    <CalendarDays size={16} />
                    {showAll ? 'Ocultar Cardápio Completo' : 'Ver Todo Cardápio'}
                    <ChevronDown size={16} className={`transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} />
                </button>
            </div>
        </section>
    );
}
