import React, { useState } from 'react';
import { Edit2, Trash2, Plus, X, Save, Boxes, Tag, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import Button from '../../components/shared/Button';

export default function ProductsPage() {
    const { products, addProduct, updateProduct, deleteProduct } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Assados',
        image: '',
        stock: 0,
        minStock: 5,
        unit_type: 'unit',
        barcode: ''
    });

    const categories = ['Assados', 'Acompanhamentos', 'Bebidas', 'Marmita'];

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                ...product,
                unit_type: product.unit_type || 'unit',
                barcode: product.barcode || ''
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: 'Assados',
                image: '',
                stock: 0,
                minStock: 5,
                unit_type: 'unit',
                barcode: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            price: parseFloat(formData.price),
            stock: parseFloat(formData.stock),
            minStock: parseFloat(formData.minStock)
        };

        if (editingProduct) {
            updateProduct(editingProduct.id, dataToSave);
        } else {
            addProduct(dataToSave);
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir este produto permanentemente?')) {
            deleteProduct(id);
        }
    };

    return (
        <div className="pb-10 text-text-primary">
            <header className="flex justify-between items-end mb-10 border-b border-surface-light pb-6">
                <div className="flex items-center gap-4">
                    <Boxes size={32} className="text-brand" />
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-white uppercase tracking-wide">Catálogo de Produtos</h1>
                        <p className="text-text-muted font-medium italic mt-1">Gerencie produtos, categorias e valores</p>
                    </div>
                </div>
                <Button variant="primary" onClick={() => handleOpenModal()} className="shadow-lg shadow-brand/20">
                    <Plus size={20} className="mr-2" />
                    Novo Produto
                </Button>
            </header>

            <div className="space-y-12">
                {categories.map(category => {
                    const categoryProducts = products.filter(p => p.category === category);

                    return (
                        <section key={category} className="animate-in fade-in duration-500">
                            <h2 className="text-xl font-serif font-bold text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                                <span className="w-2 h-6 bg-brand rounded-sm block"></span>
                                {category}
                                <span className="text-xs font-mono text-text-muted ml-2">({categoryProducts.length})</span>
                            </h2>

                            {categoryProducts.length === 0 ? (
                                <div className="p-8 border border-dashed border-surface-light rounded-2xl text-center">
                                    <p className="text-text-muted italic flex flex-col items-center gap-2">
                                        <Tag size={24} className="text-surface-light" />
                                        Nenhum produto nesta categoria.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {categoryProducts.map((product) => (
                                        <div key={product.id} className="bg-surface border border-surface-light rounded-2xl overflow-hidden group hover:border-brand/30 transition-all duration-300 hover:shadow-xl hover:shadow-brand/5 flex flex-col">
                                            <div className="h-40 relative bg-background border-b border-surface-light">
                                                <img 
                                                    src={product.image || 'https://via.placeholder.com/300x150?text=Sem+Imagem'} 
                                                    alt={product.name} 
                                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                                                />
                                                <div className="absolute top-3 right-3 bg-[#1A1A1A]/90 backdrop-blur-sm border border-surface-light text-text-primary px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                                                    {product.unit_type === 'kg' ? 'Venda p/ KG' : 'Venda p/ Unit'}
                                                </div>
                                            </div>
                                            <div className="p-6 flex flex-col flex-1">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-lg text-white leading-tight uppercase tracking-tight">{product.name}</h3>
                                                </div>
                                                {product.barcode && <span className="text-[10px] text-brand font-mono mb-2">CÓD: {product.barcode}</span>}
                                                <p className="text-text-secondary text-sm mb-6 flex-1 line-clamp-2">
                                                    {product.description || <span className="italic text-text-muted">Sem descrição adicionada.</span>}
                                                </p>

                                                <div className="flex justify-between items-end mt-auto pt-4 border-t border-surface-light">
                                                    <div>
                                                        <span className="text-[10px] uppercase font-black text-text-muted block mb-1">Preço Atual</span>
                                                        <span className="font-bold text-white text-2xl font-mono">
                                                            <span className="text-brand-light text-sm mr-1">R$</span>
                                                            {product.price.toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleOpenModal(product)}
                                                            className="p-2.5 bg-background border border-surface-light rounded-xl text-text-secondary hover:text-white hover:border-brand/50 transition-all"
                                                            title="Editar Produto"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            className="p-2.5 bg-background border border-surface-light rounded-xl text-danger/80 hover:text-danger hover:border-danger/50 hover:bg-danger/10 transition-all"
                                                            title="Excluir Produto"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    );
                })}
            </div>

            {/* Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-surface rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl border border-surface-light scale-in-center flex flex-col">
                        
                        <div className="bg-[#1A1A1A] p-6 border-b border-surface-light flex justify-between items-center shrink-0">
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-white tracking-wide uppercase">
                                    {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                                </h2>
                                <p className="text-text-muted text-xs uppercase font-mono mt-1 tracking-widest">
                                    {editingProduct ? 'Modifique as informações abaixo' : 'Preencha os dados do novo item'}
                                </p>
                            </div>
                            <button onClick={handleCloseModal} className="h-10 w-10 bg-background rounded-full border border-surface-light flex items-center justify-center text-text-secondary hover:text-white hover:border-brand transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-8 custom-scrollbar">
                            <form id="productForm" onSubmit={handleSubmit} className="space-y-8">
                                {/* Basic Info Section */}
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black uppercase text-brand tracking-widest border-b border-surface-light pb-2">Informações Principais</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Nome do Produto</label>
                                            <input
                                                name="name"
                                                placeholder="Ex: Picanha Premium"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                className="w-full p-4 bg-background border border-surface-light rounded-xl focus:border-brand/50 text-white outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Código de Barras (Opcional)</label>
                                            <input
                                                name="barcode"
                                                placeholder="Ex: 789123456"
                                                value={formData.barcode}
                                                onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                                                className="w-full p-4 bg-background border border-surface-light rounded-xl focus:border-brand/50 text-white outline-none transition-colors font-mono"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Descrição Curta</label>
                                        <textarea
                                            name="description"
                                            placeholder="Detalhes sobre o produto, acompanhamentos, etc."
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            rows={2}
                                            className="w-full p-4 bg-background border border-surface-light rounded-xl focus:border-brand/50 text-white outline-none transition-colors resize-none"
                                        />
                                    </div>
                                </div>

                                {/* Pricing and Types Section */}
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black uppercase text-brand tracking-widest border-b border-surface-light pb-2">Venda & Classificação</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Preço de Venda (R$)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                name="price"
                                                min="0"
                                                placeholder="0.00"
                                                value={formData.price}
                                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                required
                                                className="w-full p-4 bg-background border border-surface-light rounded-xl focus:border-brand/50 text-white outline-none transition-colors font-mono font-bold text-xl"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Unidade de Medida</label>
                                            <select
                                                name="unit_type"
                                                value={formData.unit_type}
                                                onChange={e => setFormData({ ...formData, unit_type: e.target.value })}
                                                className="w-full p-4 bg-background border border-surface-light rounded-xl focus:border-brand/50 text-white outline-none transition-colors appearance-none cursor-pointer"
                                            >
                                                <option value="unit">Unidade / Porção</option>
                                                <option value="kg">Peso (KG)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Categoria</label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full p-4 bg-background border border-surface-light rounded-xl focus:border-brand/50 text-white outline-none transition-colors appearance-none cursor-pointer"
                                            >
                                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Stock Section */}
                                <div className="space-y-6">
                                    <h3 className="text-[10px] font-black uppercase text-brand tracking-widest border-b border-surface-light pb-2">Controle de Estoque</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Estoque Inicial / Atual</label>
                                            <input
                                                type="number"
                                                name="stock"
                                                step="0.001"
                                                value={formData.stock}
                                                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                                className="w-full p-4 bg-background border border-surface-light rounded-xl focus:border-brand/50 text-white outline-none transition-colors font-mono"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-black uppercase tracking-widest text-text-muted mb-2">Alerta de Estoque Mínimo</label>
                                            <input
                                                type="number"
                                                name="minStock"
                                                step="0.001"
                                                min="0"
                                                value={formData.minStock}
                                                onChange={e => setFormData({ ...formData, minStock: e.target.value })}
                                                className="w-full p-4 bg-background border border-surface-light rounded-xl focus:border-danger/50 text-white outline-none transition-colors font-mono"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Image Section */}
                                <div className="space-y-6 pb-4">
                                    <h3 className="text-[10px] font-black uppercase text-brand tracking-widest border-b border-surface-light pb-2">Foto Principal</h3>
                                    <div>
                                        <div className="flex gap-6 items-center">
                                            <div className="h-24 w-24 bg-background rounded-2xl border-2 border-dashed border-surface-light flex items-center justify-center shrink-0 overflow-hidden relative group">
                                                {formData.image ? (
                                                    <>
                                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <ImageIcon className="text-white" size={24} />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <ImageIcon className="text-surface-light" size={32} />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    id="imageUpload"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setFormData({ ...formData, image: reader.result });
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                                <label 
                                                    htmlFor="imageUpload" 
                                                    className="inline-flex items-center gap-2 px-6 py-3 bg-background border border-surface-light hover:border-brand/50 text-white rounded-xl cursor-pointer transition-all uppercase tracking-widest font-black text-[10px]"
                                                >
                                                    <ImageIcon size={16} /> 
                                                    <span>Escolher Imagem...</span>
                                                </label>
                                                <p className="text-[10px] text-text-muted mt-3 italic">Formato JPG ou PNG recomendados.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        
                        <div className="p-6 bg-[#1A1A1A] border-t border-surface-light shrink-0">
                            <Button 
                                variant="primary" 
                                type="submit"
                                form="productForm"
                                className="w-full justify-center py-4 bg-brand hover:bg-brand-light text-white text-md tracking-wider shadow-lg shadow-brand/20"
                            >
                                <Save size={20} className="mr-2" />
                                {editingProduct ? 'Salvar Configurações do Produto' : 'Cadastrar Novo Produto'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
