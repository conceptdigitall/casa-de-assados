import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useStore } from '../../context/StoreContext';
import Button from '../../components/shared/Button';
import { Save, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
    const { settings, updateSettings } = useStore();
    const { register, handleSubmit, reset, formState: { isDirty } } = useForm({
        defaultValues: settings
    });

    // Update form when settings load/change
    useEffect(() => {
        if (settings) {
            reset(settings);
        }
    }, [settings, reset]);

    const onSubmit = (data) => {
        updateSettings(data);
        alert('Configurações salvas com sucesso!');
        // Ideally we'd show a toast notification here
    };

    return (
        <div style={{ maxWidth: '800px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <SettingsIcon size={32} color="#4b5563" />
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Configurações do Site</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* General Info */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>Informações Gerais</h2>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>Descrição do Rodapé</label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                        />
                    </div>
                </div>

                {/* Contact */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>Contato</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>Telefone / WhatsApp</label>
                            <input
                                {...register('contact.phone')}
                                type="text"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>Instagram</label>
                            <input
                                {...register('contact.instagram')}
                                type="text"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>Endereço Completo</label>
                        <textarea
                            {...register('contact.address')}
                            rows={2}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                        />
                    </div>
                </div>

                {/* Hours */}
                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>Horários de Funcionamento</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>Segunda a Sexta (Seg - Sex)</label>
                            <input
                                {...register('hours.weekdays')}
                                type="text"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}>Sábado e Domingo (Sáb - Dom)</label>
                            <input
                                {...register('hours.weekend')}
                                type="text"
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid #d1d5db' }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', justifySelf: 'start' }}>
                    <Button variant="primary" type="submit" disabled={!isDirty} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Save size={20} />
                        Salvar Alterações
                    </Button>
                </div>

            </form>
        </div>
    );
}
