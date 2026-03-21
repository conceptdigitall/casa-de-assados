import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../../components/public/ProductCard';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';

const CATEGORIES = [
    { id: 'Assados', label: 'Assados' },
    { id: 'Acompanhamentos', label: 'Acompanhamentos' },
    { id: 'Bebidas', label: 'Bebidas' },
    { id: 'Marmita', label: 'Marmita' }
];

export default function MenuSection() {
    const { addToCart } = useCart();
    const { products } = useStore();
    const [activeCategory, setActiveCategory] = useState('Assados');

    // Group products by category
    const groupedProducts = CATEGORIES.reduce((acc, category) => {
        acc[category.id] = products.filter(p => p.category === category.id);
        return acc;
    }, {});

    const scrollToCategory = (categoryId) => {
        const element = document.getElementById(`category-${categoryId}`);
        if (element) {
            const offset = 160; // Increased offset to account for sticky header + spacing
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            // Manual set to avoid jitter from scroll listener
            setActiveCategory(categoryId);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 200; // Offset to trigger change slightly before section hits top

            // Find the category that corresponds to the current scroll position
            for (const category of CATEGORIES) {
                const element = document.getElementById(`category-${category.id}`);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
                        setActiveCategory(category.id);
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section style={{ backgroundColor: 'transparent', minHeight: '100vh', paddingBottom: '4rem' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>

                <h2 style={{
                    textAlign: 'center',
                    fontSize: '2.5rem',
                    padding: '3rem 1rem 1rem',
                    color: '#F3F4F6', // White text for visibility
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}>
                    Nosso Cardápio
                </h2>

                {/* Sticky Category Navigation */}
                <div style={{
                    position: 'sticky',
                    top: '0',
                    zIndex: 100,
                    backgroundColor: 'rgba(15, 15, 11, 0.85)',
                    backdropFilter: 'blur(12px)',
                    padding: '1rem 0',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    marginBottom: '2rem',
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)'
                }}>
                    {CATEGORIES.map(category => (
                        <button
                            key={category.id}
                            onClick={() => scrollToCategory(category.id)}
                            style={{
                                padding: '0.6rem 1.5rem',
                                borderRadius: '9999px',
                                border: activeCategory === category.id ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: activeCategory === category.id ? '600' : '400',
                                backgroundColor: activeCategory === category.id ? 'var(--color-primary)' : 'rgba(255,255,255,0.03)',
                                color: activeCategory === category.id ? 'white' : 'var(--color-text-muted)',
                                transition: 'all 0.3s ease',
                                letterSpacing: '0.02em'
                            }}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Product Sections */}
                <div style={{ padding: '0 1rem 4rem' }}>
                    {CATEGORIES.map((category) => {
                        const categoryProducts = groupedProducts[category.id];
                        if (!categoryProducts || categoryProducts.length === 0) return null;

                        return (
                            <div key={category.id} id={`category-${category.id}`} style={{ marginBottom: '4rem', scrollMarginTop: '100px' }}>
                                <motion.h3
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    style={{
                                        fontSize: '1.8rem',
                                        color: '#FF4D00', // Red/Orange for Category
                                        marginBottom: '1.5rem',
                                        borderLeft: '4px solid #FF4D00',
                                        paddingLeft: '1rem',
                                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                    }}
                                >
                                    {category.label}
                                </motion.h3>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                    gap: '2rem'
                                }}>
                                    {categoryProducts.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <ProductCard
                                                product={product}
                                                onAdd={addToCart}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
