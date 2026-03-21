import React, { useState } from 'react';
import { Edit2, Trash2, Plus, X, Save } from 'lucide-react';
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
        category: '',
        image: '',
        stock: 0,
        minStock: 5
    });

    const categories = ['Assados', 'Acompanhamentos', 'Bebidas', 'Marmita'];

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({ ...product });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                category: 'Assados',
                image: '',
                stock: 0,
                minStock: 5
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
            stock: parseInt(formData.stock),
            minStock: parseInt(formData.minStock)
        };

        if (editingProduct) {
            updateProduct(editingProduct.id, dataToSave);
        } else {
            addProduct(dataToSave);
        }
        handleCloseModal();
    };

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir este produto?')) {
            deleteProduct(id);
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>Produtos e Estoque</h1>
                <Button variant="primary" onClick={() => handleOpenModal()}>
                    <Plus size={20} />
                    Novo Produto
                </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {categories.map(category => {
                    const categoryProducts = products.filter(p => p.category === category);
                    // Optional: Show empty categories? Let's show them so user knows where to add

                    return (
                        <div key={category}>
                            <h2 style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                color: '#4b5563',
                                marginBottom: '1.5rem',
                                borderBottom: '2px solid #e5e7eb',
                                paddingBottom: '0.5rem'
                            }}>
                                {category}
                            </h2>

                            {categoryProducts.length === 0 ? (
                                <p style={{ color: '#9ca3af', fontStyle: 'italic' }}>Nenhum produto nesta categoria.</p>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                    {categoryProducts.map((product) => (
                                        <div key={product.id} style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                                            <div style={{ height: '150px', position: 'relative' }}>
                                                <img src={product.image || 'https://via.placeholder.com/300x150?text=Sem+Imagem'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <div style={{ padding: '1rem' }}>
                                                <h3 style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '0.25rem' }}>{product.name}</h3>
                                                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem', minHeight: '40px' }}>{product.description}</p>

                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontWeight: 'bold', color: '#dc2626', fontSize: '1.125rem' }}>R$ {product.price.toFixed(2)}</span>
                                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                        <button
                                                            onClick={() => handleOpenModal(product)}
                                                            style={{ padding: '0.5rem', backgroundColor: '#f3f4f6', borderRadius: '0.375rem', color: '#4b5563', cursor: 'pointer', border: 'none' }}
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            style={{ padding: '0.5rem', backgroundColor: '#fee2e2', borderRadius: '0.375rem', color: '#ef4444', cursor: 'pointer', border: 'none' }}
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
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '2rem',
                        borderRadius: '0.5rem',
                        width: '100%',
                        maxWidth: '500px',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                {editingProduct ? 'Editar Produto' : 'Novo Produto'}
                            </h2>
                            <button onClick={handleCloseModal} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nome</label>
                                <input
                                    name="name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Descrição</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Preço (R$)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        name="price"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        required
                                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Categoria</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Foto do Produto</label>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    {formData.image && (
                                        <img src={formData.image} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '0.25rem', border: '1px solid #ddd' }} />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
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
                                        style={{ flex: 1, padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                                    />
                                </div>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>Selecione uma foto do seu computador/celular.</p>
                            </div>

                            {/* Initial Stock Fields - Only visible on creation usually, or editable here? Let's keep editable for flexibility even though Inventory Page exists */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Estoque Inicial</label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Estoque Mínimo</label>
                                    <input
                                        type="number"
                                        name="minStock"
                                        value={formData.minStock}
                                        onChange={e => setFormData({ ...formData, minStock: e.target.value })}
                                        style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '0.25rem' }}
                                    />
                                </div>
                            </div>

                            <Button variant="primary" style={{ justifyContent: 'center', marginTop: '1rem' }}>
                                <Save size={20} />
                                {editingProduct ? 'Salvar Alterações' : 'Criar Produto'}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
