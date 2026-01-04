import React from 'react';
import { motion } from 'framer-motion';
import Button from '../../components/shared/Button';
import logo from '../../assets/logo.png';
import MenuSection from '../../components/public/MenuSection';
import Footer from '../../components/public/Footer';

export default function HomePage() {
    const scrollToMenu = () => {
        document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="home-page" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            {/* Hero Section */}
            <section className="hero-section" style={{
                textAlign: 'center',
                padding: '6rem 1rem',
                backgroundImage: 'linear-gradient(to bottom, #FFF8F0, #FFFFFF)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Decorative Elements */}
                <div style={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-5%',
                    width: '300px',
                    height: '300px',
                    backgroundColor: 'rgba(242, 169, 0, 0.1)',
                    borderRadius: '50%',
                    filter: 'blur(80px)',
                    zIndex: 0
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '10%',
                    left: '-10%',
                    width: '400px',
                    height: '400px',
                    backgroundColor: 'rgba(220, 38, 38, 0.05)',
                    borderRadius: '50%',
                    filter: 'blur(100px)',
                    zIndex: 0
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <img
                            src={logo}
                            alt="Casa dos Assados"
                            style={{ maxWidth: '280px', marginBottom: '2rem', dropShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                        />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        style={{
                            fontSize: '3rem',
                            color: 'var(--color-secondary)',
                            marginBottom: '1rem',
                            lineHeight: 1.2
                        }}
                    >
                        O Verdadeiro Sabor <br /> <span style={{ color: 'var(--color-primary)' }}>do Churrasco</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        style={{
                            margin: '0 auto 2.5rem',
                            color: 'var(--color-text-muted)',
                            maxWidth: '600px',
                            fontSize: '1.125rem'
                        }}
                    >
                        Carnes suculentas, acompanhamentos deliciosos e a tradição que você conhece.
                        Peça agora e receba quentinho em sua casa.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}
                    >
                        <Button variant="primary" onClick={scrollToMenu} style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
                            Ver Cardápio
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Menu Section with ID for scroll */}
            <div id="menu-section">
                <MenuSection />
            </div>

            <Footer />
        </div>
    );
}
