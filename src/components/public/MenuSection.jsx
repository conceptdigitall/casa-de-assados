import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../../components/public/ProductCard';
import { useCart } from '../../context/CartContext';
import { useStore } from '../../context/StoreContext';

export default function MenuSection() {
    const { addToCart } = useCart();
    const { products } = useStore();

    return (
        <section style={{ padding: '4rem 2rem', backgroundColor: 'var(--color-bg)' }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    style={{
                        textAlign: 'center',
                        fontSize: '2.5rem',
                        marginBottom: '3rem',
                        color: 'var(--color-secondary)'
                    }}
                >
                    Nosso Cardápio
                </motion.h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                    {products.map((product, index) => (
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
        </section>
    );
}
