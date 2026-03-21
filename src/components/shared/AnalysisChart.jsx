import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AnalysisChart({ data, type = 'area', title, color = '#DC2626' }) {
    return (
        <div style={{
            backgroundColor: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            height: '350px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#111827' }}>{title}</h3>
            <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                    {type === 'area' ? (
                        <AreaChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} tickFormatter={val => `R$${val}`} />
                            <Tooltip
                                contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                                formatter={(value) => [`R$ ${value}`, 'Faturamento']}
                            />
                            <Area type="monotone" dataKey="value" stroke={color} fillOpacity={0.1} fill={color} strokeWidth={2} />
                        </AreaChart>
                    ) : (
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} dy={10} />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0].payload;
                                        return (
                                            <div style={{ backgroundColor: 'white', padding: '0.75rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: 'none' }}>
                                                <p style={{ fontWeight: 'bold', marginBottom: '0.25rem', color: '#374151' }}>{label}</p>
                                                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                                    Quantidade: <span style={{ fontWeight: 600, color: '#111827' }}>{data.value}</span>
                                                </p>
                                                {data.revenue !== undefined && (
                                                    <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                                        Valor: <span style={{ fontWeight: 600, color: '#111827' }}>R$ {data.revenue.toFixed(2).replace('.', ',')}</span>
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
