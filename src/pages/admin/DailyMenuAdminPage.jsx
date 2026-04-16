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

    const inputClasses = "w-full px-3 py-1.5 bg-background border border-surface-light rounded text-text-primary focus:outline-none focus:border-brand/50 transition-colors text-xs";
    const labelClasses = "block mb-1.5 text-[10px] font-bold tracking-widest uppercase text-text-secondary";
    const sectionClasses = "bg-surface p-4 sm:p-6 rounded-xl border border-surface-light mb-6";
    const sectionTitleClasses = "font-serif text-lg border-b border-surface-light pb-2 mb-4 text-brand";

    const renderEditableList = (listName, title) => {
        if (!currentMenu.hasOwnProperty(listName) && listName !== 'adicionar_depois') return null;
        
        const items = currentMenu[listName] || [];

        return (
            <div className="mb-8">
                <div className="flex items-center justify-between border-b border-surface-light pb-2 mb-3">
                    <h3 className="font-bold text-white uppercase tracking-wider text-xs">{title}</h3>
                    <button 
                        onClick={() => addItem(activeTab, listName)}
                        className="text-brand hover:text-brand-light flex items-center gap-1 text-[10px] font-bold bg-brand/10 px-2 py-1 rounded transition-colors"
                    >
                        <Plus size={12} /> ADICIONAR
                    </button>
                </div>
                
                {items.length === 0 && <p className="text-text-muted text-sm italic">Nenhum item adicionado.</p>}
                
                <div className="space-y-2">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
                            <input 
                                type="text"
                                value={item.name}
                                onChange={(e) => updateItem(activeTab, listName, idx, 'name', e.target.value)}
                                className={`${inputClasses} flex-1 min-w-[140px]`}
                                placeholder="Nome do prato"
                            />
                            <div className="flex items-center gap-1.5 w-full sm:w-28 shrink-0">
                                <span className="text-text-muted text-xs">R$</span>
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
                                className="text-danger/60 hover:text-danger p-1.5 transition-colors sm:static absolute right-2"
                                title="Remover item"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-5xl text-text-primary pb-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b border-surface-light gap-4">
                <div className="flex items-center gap-3">
                    <CalendarDays size={24} className="text-brand" />
                    <h1 className="text-2xl font-serif font-bold text-white uppercase tracking-wide">Cardápio Diário</h1>
                </div>
                <Button variant="primary" onClick={handleSave} className="flex items-center gap-2 shadow-sm text-xs py-2 px-4 w-full sm:w-auto justify-center">
                    <Save size={16} /> Salvar Alterações
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap pb-2">
                {[2, 3, 4, 5, 6, 0].map(day => {
                    const isActive = activeTab === day;
                    return (
                        <button
                            key={day}
                            onClick={() => setActiveTab(day)}
                            className={`px-3 py-1.5 rounded-md text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap ${
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
                        
                        <div className="mt-6 pt-6 border-t border-surface-light">
                            <label className={labelClasses}>Carnes Assadas (Descrição Geral)</label>
                            <input 
                                type="text"
                                value={currentMenu.carnesAssadas || ''}
                                onChange={(e) => updateField(activeTab, 'carnesAssadas', e.target.value)}
                                className={inputClasses + " mb-3"}
                            />
                            
                            <label className={labelClasses}>Preço do KG (Carnes Assadas)</label>
                            <div className="flex items-center gap-1.5 max-w-[150px]">
                                <span className="text-text-muted text-xs">R$</span>
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
                        
                        <div className="mt-6 pt-6 border-t border-surface-light">
                            <label className={labelClasses}>Carnes Assadas (Descrição Geral)</label>
                            <input 
                                type="text"
                                value={currentMenu.carnesAssadas || ''}
                                onChange={(e) => updateField(activeTab, 'carnesAssadas', e.target.value)}
                                className={inputClasses + " mb-3"}
                            />
                            
                            <label className={labelClasses}>Preço do KG (Carnes Assadas)</label>
                            <div className="flex items-center gap-1.5 max-w-[150px] mb-3">
                                <span className="text-text-muted text-xs">R$</span>
                                <input 
                                    type="text"
                                    value={currentMenu.precoKg || ''}
                                    onChange={(e) => updateField(activeTab, 'precoKg', e.target.value)}
                                    className={inputClasses}
                                />
                            </div>

                            <label className={labelClasses}>Preço Frango Assado</label>
                            <div className="flex items-center gap-1.5 max-w-[150px]">
                                <span className="text-text-muted text-xs">R$</span>
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
