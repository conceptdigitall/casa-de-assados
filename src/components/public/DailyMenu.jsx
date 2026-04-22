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

const getImageForDish = (item, categoryLabel = '') => {
    if (item.image && item.image !== '/images/fallback.png') return item.image;
    const name = (item.name || '').toLowerCase();
    
    if (name.includes('parmegiana')) return '/images/parmegiana.png';
    if (name.includes('feijoada')) return '/images/feijoada.png';
    if (name.includes('tilápia') || name.includes('tilapia')) return '/images/tilapia.png';
    if (name.includes('bisteca')) return '/images/bisteca.png';
    if (name.includes('omelete')) return '/images/omelete.png';
    if (name.includes('frango assado') || name.includes('frango')) return '/images/frango_assado.png';
    
    const cat = categoryLabel.toLowerCase();
    if (cat.includes('bebida')) return '/images/fallback.png';
    if (cat.includes('assada')) return '/images/carne_assada.png';
    if (cat.includes('especiais') || cat.includes('premium')) return '/images/marmita_premium.png';
    
    return '/images/marmita_tradicional.png';
};

export default function DailyMenu() {
    const { dailyMenus, products } = useStore();
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

        // Tenta encontrar o produto real no banco de dados para pegar o UUID correto
        const dbProduct = products?.find(p => p.name.toLowerCase().includes(item.name.toLowerCase()));
        const productId = dbProduct ? dbProduct.id : `daily-${item.name.toLowerCase().replace(/\s+/g, '-')}`;

        const productPayload = {
            id: productId,
            name: item.name,
            price: numericPrice,
            stock: dbProduct ? dbProduct.stock : 99,
            image: getImageForDish(item, type),
            category: type,
            description: `Opção: ${type}`
        };
        addToCart(productPayload, '');
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

    const renderInteractiveCards = (items, categoryLabel = 'Opções') => (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item, idx) => (
                <motion.li 
                    key={idx} 
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAddItem(item, categoryLabel)}
                    className="flex flex-col border border-surface-light bg-surface/20 rounded-xl overflow-hidden cursor-pointer hover:border-brand/50 transition-all group list-none shadow-lg shadow-black/20"
                >
                    <div className="relative h-36 w-full overflow-hidden bg-background">
                        <img 
                            src={getImageForDish(item, categoryLabel)} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-90" />
                        <div className="absolute bottom-2 right-2 bg-brand text-background p-1.5 rounded-full shadow-lg shadow-black/50 transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <Plus size={16} strokeWidth={3} />
                        </div>
                    </div>
                    <div className="p-4 flex flex-col pt-1">
                        <span className="text-white font-medium line-clamp-2 md:text-lg min-h-[3rem] items-center flex">{item.name}</span>
                        <span className="text-brand font-bold mt-1 text-lg">R$ {item.price}</span>
                    </div>
                </motion.li>
            ))}
        </div>
    );

    const renderPremiumBento = (items, categoryLabel = 'Especiais') => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item, idx) => {
                const isFeatured = idx === 0 && items.length % 2 !== 0; 
                return (
                    <motion.div 
                        key={idx} 
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.985 }}
                        onClick={() => handleAddItem(item, categoryLabel)}
                        className={`relative border border-surface-light rounded-2xl overflow-hidden cursor-pointer hover:border-brand/60 transition-all group list-none shadow-2xl shadow-black/40 ${isFeatured ? 'md:col-span-2 aspect-[16/7]' : 'aspect-square md:aspect-[4/3]'} `}
                    >
                        <img 
                            src={getImageForDish(item, categoryLabel)} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/10" />
                        
                        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                            <span className="text-brand text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mb-2">{categoryLabel}</span>
                            <h4 className="text-white text-2xl md:text-3xl font-bold font-serif mb-3 leading-tight group-hover:text-brand transition-colors drop-shadow-md">{item.name}</h4>
                            <div className="flex justify-between items-center mt-auto md:mt-4">
                                <span className="text-white font-bold text-lg md:text-xl px-4 py-1.5 bg-surface/40 backdrop-blur-md rounded-xl border border-surface-light/50">R$ {item.price}</span>
                                <div className="bg-brand text-background p-2.5 rounded-full shadow-[0_0_20px_rgba(209,103,42,0.5)] transform scale-90 group-hover:scale-100 transition-transform">
                                    <Plus size={24} strokeWidth={3} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );

    const renderMenuDay = (menuData) => {
        return (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-5xl mx-auto px-6 py-10 bg-surface/20 border border-surface-light backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/50"
            >
                <div className="text-center mb-12">
                    <h3 className="font-serif text-4xl md:text-5xl text-brand font-bold uppercase tracking-widest bg-gradient-to-r from-brand via-orange-400 to-brand bg-clip-text text-transparent flex items-center justify-center gap-4">
                        <Flame size={32} className="text-brand hidden md:block" /> {menuData.name} <Flame size={32} className="text-brand hidden md:block" />
                    </h3>
                </div>

                <div className="flex flex-col gap-16">
                    {/* Especiais / Marmitas Premium */}
                    {(menuData.especiais || menuData.marmitas) && (
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px bg-surface-light/50 flex-1" />
                                <h4 className="text-white text-lg tracking-[0.1em] uppercase font-bold flex items-center gap-2">
                                    <Flame size={20} className="text-brand" /> {menuData.marmitas ? 'Marmitas Em Destaque' : 'Seleção Premium'}
                                </h4>
                                <div className="h-px bg-surface-light/50 flex-1" />
                            </div>
                            {renderPremiumBento(menuData.especiais || menuData.marmitas, menuData.marmitas ? 'Marmitas Premium' : 'Marmitas Especiais')}
                        </div>
                    )}

                    {/* Tradicionais */}
                    {menuData.tradicionais && (
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-px bg-surface-light/50 flex-1" />
                                <h4 className="text-text-muted text-sm md:text-base tracking-[0.1em] uppercase font-bold text-center">O Clássico do Dia a Dia</h4>
                                <div className="h-px bg-surface-light/50 flex-1" />
                            </div>
                            {renderInteractiveCards(menuData.tradicionais, 'Marmitas Tradicionais')}
                        </div>
                    )}
                </div>

                {/* Carnes Assadas e Acompanhamentos */}
                {(menuData.carnesAssadas || menuData.acompanhamentos) && (
                    <div className="mt-16">
                        {menuData.carnesAssadas && (
                            <div className="mb-16">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-px bg-surface-light/50 flex-1" />
                                    <h4 className="text-brand text-lg md:text-xl tracking-[0.1em] uppercase font-bold font-serif flex items-center gap-2">
                                        <Flame size={20} /> Carnes Na Brasa (R$ {menuData.precoKg} o KG)
                                    </h4>
                                    <div className="h-px bg-surface-light/50 flex-1" />
                                </div>
                                <motion.div 
                                    className="relative border border-brand/30 rounded-2xl overflow-hidden cursor-auto aspect-[16/6] md:aspect-[21/6] shadow-2xl shadow-brand/10"
                                >
                                    <img 
                                        src="/images/carne_assada.png"
                                        alt="Carnes Assadas" 
                                        className="w-full h-full object-cover opacity-60"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                                    <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-center text-center items-center">
                                         <p className="text-white text-xl md:text-4xl font-serif font-bold uppercase tracking-wide max-w-3xl leading-snug drop-shadow-xl">{menuData.carnesAssadas}</p>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {menuData.frangoAssado && (
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center justify-center bg-brand/5 border border-brand/40 px-8 py-5 rounded-2xl shadow-[0_0_30px_rgba(209,103,42,0.15)]">
                                    <h4 className="flex items-center gap-4 text-white text-xl md:text-2xl font-bold uppercase tracking-widest font-serif">
                                        🍗 Frango Assado <span className="text-brand text-2xl md:text-3xl ml-2">R$ {menuData.frangoAssado}</span>
                                    </h4>
                                </div>
                            </div>
                        )}

                        {menuData.acompanhamentos && (
                            <div className="max-w-4xl mx-auto">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="h-px bg-surface-light/50 flex-1" />
                                    <h4 className="text-text-muted text-sm md:text-base tracking-[0.1em] uppercase font-bold text-center">Para Acompanhar</h4>
                                    <div className="h-px bg-surface-light/50 flex-1" />
                                </div>
                                {renderInteractiveCards(menuData.acompanhamentos, 'Acompanhamentos')}
                            </div>
                        )}
                    </div>
                )}

                {/* Extras Shared */}
                <div className="mt-16 pt-10 border-t border-surface-light/30 flex flex-wrap justify-center gap-4 text-center">
                    {EXTRAS.map((extra, idx) => (
                        <motion.div 
                            key={idx} 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAddItem(extra, 'Extras')}
                            className="bg-surface/30 border border-surface-light/50 hover:border-brand/60 hover:bg-surface/50 px-5 py-3 rounded-xl cursor-pointer flex items-center justify-between md:justify-start min-w-[200px] gap-3 transition-colors shadow-lg shadow-black/20 group"
                        >
                            <span className="text-white uppercase tracking-wider text-xs font-bold">{extra.name}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-brand font-bold text-sm">R$ {extra.price}</span>
                                <Plus size={16} className="text-text-muted group-hover:text-brand transition-colors" />
                            </div>
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
