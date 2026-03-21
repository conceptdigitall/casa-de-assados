import React from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Flame, PartyPopper } from 'lucide-react';
import Button from '../../components/shared/Button';
import logo from '../../assets/fire_theme.jpg';
import MenuSection from '../../components/public/MenuSection';
import Footer from '../../components/public/Footer';

export default function HomePage() {
    const scrollToMenu = () => {
        document.getElementById('menu-section').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="home-page" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0F0F0B' }}>

            {/* Navbar - Transparent/Absolute */}
            <nav style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'center',
                zIndex: 10,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)'
            }}>
                <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', padding: 0, margin: 0 }}>
                    {['HOME', 'SOBRE NÓS', 'MENU', 'EVENTOS', 'CONTATO'].map((item) => (
                        <li key={item}>
                            <a href="#" style={{
                                color: 'rgba(255,255,255,0.9)',
                                textDecoration: 'none',
                                fontWeight: 500,
                                fontSize: '0.9rem',
                                letterSpacing: '0.05em'
                            }}>
                                {item}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Hero Section */}
            <section className="hero-section" style={{
                textAlign: 'center',
                padding: '10rem 1rem 8rem',
                background: 'radial-gradient(circle at 50% 40%, #2a0a00 0%, #0F0F0B 80%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Ember Particles (Static Visual) */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundImage: 'radial-gradient(white 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    opacity: 0.05,
                    pointerEvents: 'none'
                }} />

                <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, type: 'spring' }}
                    >
                        <img
                            src={logo}
                            alt="Casa dos Assados"
                            style={{
                                maxWidth: '350px',
                                width: '100%',
                                marginBottom: '3rem',
                                borderRadius: '1rem',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 30px rgba(255, 77, 0, 0.3)'
                            }}
                        />
                    </motion.div>

                    <Button
                        variant="primary"
                        onClick={scrollToMenu}
                        style={{
                            padding: '1rem 3rem',
                            fontSize: '1rem',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            borderRadius: '4px', // Less rounded, more classic button
                            backgroundColor: '#FF4D00',
                            boxShadow: '0 4px 20px rgba(255, 77, 0, 0.4)',
                            border: 'none'
                        }}
                    >
                        Ver Nosso Menu
                    </Button>
                </div>
            </section>

            {/* Welcome & Features Section */}
            <section style={{
                padding: '6rem 1rem',
                backgroundColor: '#131310',
                textAlign: 'center',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 style={{
                            fontFamily: 'serif', // Trying to match the elegant font
                            fontSize: '2.5rem',
                            color: '#F3F4F6',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}>
                            Bem-vindo à Nossa Churrascaria
                        </h2>
                        <p style={{
                            color: '#9CA3AF',
                            textTransform: 'uppercase',
                            fontSize: '0.85rem',
                            letterSpacing: '0.15em',
                            marginBottom: '4rem'
                        }}>
                            Onde a paixão pela carne se torna uma experiência
                        </p>
                    </motion.div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2rem'
                    }}>
                        {/* Card 1 */}
                        <div style={{
                            padding: '2rem',
                            backgroundColor: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '0.5rem'
                        }}>
                            <UtensilsCrossed size={40} color="#FF4D00" style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1rem', fontFamily: 'serif' }}>Cortes de Qualidade</h3>
                            <p style={{ color: '#9CA3AF', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                Os melhores cortes para o churrasco perfeito. Seleção rigorosa e preparo artesanal.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div style={{
                            padding: '2rem',
                            backgroundColor: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '0.5rem'
                        }}>
                            <Flame size={40} color="#FF4D00" style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1rem', fontFamily: 'serif' }}>Ambiente Aconchegante</h3>
                            <p style={{ color: '#9CA3AF', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                Um local quente e acolhedor para seus momentos. Sinta-se em casa.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div style={{
                            padding: '2rem',
                            backgroundColor: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '0.5rem'
                        }}>
                            <PartyPopper size={40} color="#FF4D00" style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '1rem', fontFamily: 'serif' }}>Eventos Especiais</h3>
                            <p style={{ color: '#9CA3AF', fontSize: '0.9rem', lineHeight: 1.6 }}>
                                Celebre aqui seu evento com muito sabor e alegria.
                            </p>
                        </div>
                    </div>

                    <div style={{ marginTop: '4rem' }}>
                        <Button
                            variant="primary"
                            onClick={scrollToMenu}
                            style={{
                                padding: '1rem 3rem',
                                fontSize: '0.9rem',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                borderRadius: '4px',
                                backgroundColor: '#FF4D00'
                            }}
                        >
                            Ver Menu Completo
                        </Button>
                    </div>
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
