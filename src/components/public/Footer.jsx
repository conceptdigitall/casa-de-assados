import React from 'react';
import { Phone, MapPin, Instagram, Lock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export default function Footer() {
    const { settings } = useStore();

    if (!settings) return null; // Wait for settings loading logic if needed, though initial state is synchronous

    return (
        <footer style={{
            backgroundColor: 'var(--color-secondary)',
            color: 'white',
            padding: '4rem 2rem',
            marginTop: 'auto'
        }}>
            <div className="container" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '3rem'
            }}>
                {/* Brand Section */}
                <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                        Casa dos Assados
                    </h3>
                    <p style={{ color: '#d1d5db', lineHeight: '1.6' }}>
                        {settings.description}
                    </p>
                </div>

                {/* Contact Section */}
                <div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Contato</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#d1d5db' }}>
                            <Phone size={20} color="var(--color-primary)" />
                            <span>{settings.contact.phone}</span>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#d1d5db' }}>
                            <Instagram size={20} color="var(--color-primary)" />
                            <span>{settings.contact.instagram}</span>
                        </li>
                        <li style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', color: '#d1d5db' }}>
                            <MapPin size={20} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                            <span>{settings.contact.address.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br /></React.Fragment>)}</span>
                        </li>
                    </ul>
                </div>

                {/* Hours Section */}
                <div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Horário de Funcionamento</h4>
                    <ul style={{ listStyle: 'none', color: '#d1d5db', lineHeight: '2' }}>
                        <li><strong style={{ color: 'white' }}>Seg - Sex:</strong> {settings.hours.weekdays}</li>
                        <li><strong style={{ color: 'white' }}>Sáb - Dom:</strong> {settings.hours.weekend}</li>
                    </ul>
                </div>
            </div>

            <div style={{
                borderTop: '1px solid #374151',
                marginTop: '3rem',
                paddingTop: '2rem',
                textAlign: 'center',
                color: '#9ca3af',
                fontSize: '0.875rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                <p>&copy; {new Date().getFullYear()} Casa dos Assados. Todos os direitos reservados.</p>
                <a href="/admin" style={{ opacity: 0.3, display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'inherit', textDecoration: 'none' }}>
                    <Lock size={12} /> Área Restrita
                </a>
            </div>
        </footer>
    );
}
