import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import Button from '../../components/shared/Button';
import { Save, CalendarDays, Plus, Trash2 } from 'lucide-react';

export default function DailyMenuAdminPage() {
    const { dailyMenus, updateDailyMenus } = useStore();
    
    // We clone the global state into a local editing state to avoid mutating global until "Save"
    const [localMenus, setLocalMenus] = useState(null);
    const [activeTab, setActiveTab] = useState(2); // Start on Terça (2)
    
    useEffect(() => {
        if (dailyMenus) {
            // Deep clone to safely edit
            setLocalMenus(JSON.parse(JSON.stringify(dailyMenus)));
        }
    }, [dailyMenus]);

    if (!localMenus) return <div>Carregando...</div>;

    const handleSave = () => {
        updateDailyMenus(localMenus);
        alert('Cardápio do dia salvo com sucesso!');
    };

    const updateItem = (dayId, category, index, field, value) => {
        const newData = { ...localMenus };
        newData[dayId][category][index][field] = value;
        setLocalMenus(newData);
    };

    const updateField = (dayId, field, value) => {
        const newData = { ...localMenus };
        newData[dayId][field] = value;
        setLocalMenus(newData);
    };

    const addItem = (dayId, category) => {
        const newData = { ...localMenus };
        if (!newData[dayId][category]) newData[dayId][category] = [];
        newData[dayId][category].push({ name: '', price: '' });
        setLocalMenus(newData);
    };

    const removeItem = (dayId, category, index) => {
        const newData = { ...localMenus };
        newData[dayId][category].splice(index, 1);
        setLocalMenus(newData);
    };

    const currentMenu = localMenus[activeTab];

    const inputClasses = "w-full p-2 bg-background border border-surface-light rounded-lg text-text-primary focus:outline-none focus:border-brand/50 transition-colors text-sm";
    const labelClasses = "block mb-2 text-xs font-bold tracking-widest uppercase text-text-secondary";
    const sectionClasses = "bg-surface p-6 rounded-xl border border-surface-light mb-8";
    const sectionTitleClasses = "font-serif text-xl border-b border-surface-light pb-3 mb-6 text-brand";

    const renderEditableList = (listName, title) => {
        if (!currentMenu.hasOwnProperty(listName) && listName !== 'adicionar_depois') return null;
        
        const items = currentMenu[listName] || [];

        return (
            <div className="mb-8">
                <div className="flex items-center justify-between border-b border-surface-light pb-2 mb-4">
                    <h3 className="font-bold text-white uppercase tracking-wider text-sm">{title}</h3>
                    <button 
                        onClick={() => addItem(activeTab, listName)}
                        className="text-brand hover:text-brand-light flex items-center gap-1 text-xs font-bold bg-brand/10 px-2 py-1 rounded"
                    >
                        <Plus size={14} /> ADICIONAR
                    </button>
                </div>
                
                {items.length === 0 && <p className="text-text-muted text-sm italic">Nenhum item adicionado.</p>}
                
                <div className="space-y-3">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                            <input 
                                type="text"
                                value={item.name}
                                onChange={(e) => updateItem(activeTab, listName, idx, 'name', e.target.value)}
                                className={inputClasses}
                                placeholder="Nome do prato"
                            />
                            <div className="flex items-center gap-2 w-32 shrink-0">
                                <span className="text-text-muted">R$</span>
                                <input 
                                    type="text"
                                    value={item.price}
                                    onChange={(e) => updateItem(activeTab, listName, idx, 'price', e.target.value)}
                                    className={inputClasses}
                                    placeholder="00,00"
                                />
                            </div>
                            <button 
                                onClick={() => removeItem(activeTab, listName, idx)}
                                className="text-danger/60 hover:text-danger p-2 transition-colors"
                                title="Remover item"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-5xl text-text-primary pb-20">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-surface-light">
                <div className="flex items-center gap-4">
                    <CalendarDays size={32} className="text-brand" />
                    <h1 className="text-3xl font-serif font-bold text-white uppercase tracking-wide">Cardápio Diário</h1>
                </div>
                <Button variant="primary" onClick={handleSave} className="flex items-center gap-2 shadow-lg shadow-brand/20">
                    <Save size={20} /> Salvar Alterações Globais
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-4 custom-scrollbar">
                {[2, 3, 4, 5, 6, 0].map(day => {
                    const isActive = activeTab === day;
                    return (
                        <button
                            key={day}
                            onClick={() => setActiveTab(day)}
                            className={`px-5 py-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap ${
                                isActive 
                                    ? 'bg-brand text-background shadow drop-shadow' 
                                    : 'bg-surface border border-surface-light text-text-secondary hover:text-white hover:bg-surface-light/50'
                            }`}
                        >
                            {localMenus[day].name}
                        </button>
                    )
                })}
            </div>

            {/* Editor Area */}
            <div className={sectionClasses}>
                <h2 className={sectionTitleClasses}>Editando: {currentMenu.name}</h2>
                
                {activeTab !== 6 && activeTab !== 0 && (
                    <>
                        {renderEditableList('tradicionais', 'Marmitas Tradicionais')}
                        {renderEditableList('especiais', 'Marmitas Especiais')}
                    </>
                )}
                
                {activeTab === 6 && (
                    <>
                        {renderEditableList('especiais', 'Marmitas Especiais')}
                        
                        <div className="mt-8 pt-8 border-t border-surface-light">
                            <label className={labelClasses}>Carnes Assadas (Descrição Geral)</label>
                            <input 
                                type="text"
                                value={currentMenu.carnesAssadas || ''}
                                onChange={(e) => updateField(activeTab, 'carnesAssadas', e.target.value)}
                                className={inputClasses + " mb-4"}
                            />
                            
                            <label className={labelClasses}>Preço do KG (Carnes Assadas)</label>
                            <div className="flex items-center gap-2 max-w-[200px]">
                                <span className="text-text-muted">R$</span>
                                <input 
                                    type="text"
                                    value={currentMenu.precoKg || ''}
                                    onChange={(e) => updateField(activeTab, 'precoKg', e.target.value)}
                                    className={inputClasses}
                                />
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 0 && (
                    <>
                        {renderEditableList('marmitas', 'Marmitas')}
                        
                        <div className="mt-8 pt-8 border-t border-surface-light">
                            <label className={labelClasses}>Carnes Assadas (Descrição Geral)</label>
                            <input 
                                type="text"
                                value={currentMenu.carnesAssadas || ''}
                                onChange={(e) => updateField(activeTab, 'carnesAssadas', e.target.value)}
                                className={inputClasses + " mb-4"}
                            />
                            
                            <label className={labelClasses}>Preço do KG (Carnes Assadas)</label>
                            <div className="flex items-center gap-2 max-w-[200px] mb-4">
                                <span className="text-text-muted">R$</span>
                                <input 
                                    type="text"
                                    value={currentMenu.precoKg || ''}
                                    onChange={(e) => updateField(activeTab, 'precoKg', e.target.value)}
                                    className={inputClasses}
                                />
                            </div>

                            <label className={labelClasses}>Preço Frango Assado</label>
                            <div className="flex items-center gap-2 max-w-[200px]">
                                <span className="text-text-muted">R$</span>
                                <input 
                                    type="text"
                                    value={currentMenu.frangoAssado || ''}
                                    onChange={(e) => updateField(activeTab, 'frangoAssado', e.target.value)}
                                    className={inputClasses}
                                />
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-surface-light">
                            {renderEditableList('acompanhamentos', 'Acompanhamentos')}
                        </div>
                    </>
                )}

            </div>
            
            <div className="text-center text-text-muted text-xs mt-8">
                Nota: A exibição de opções e categorias muda de acordo com o padrão do dia selecionado.
            </div>
        </div>
    );
}
