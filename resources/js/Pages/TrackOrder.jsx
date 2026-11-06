import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function TrackOrder({ order = null, searched = false, errorMessage = null, filters = {} }) {
    const [orderCode, setOrderCode] = useState(filters.order_code || '');
    const [contact, setContact] = useState(filters.contact || '');
    const [loading, setLoading] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        setLoading(true);
        router.get(
            '/track',
            { order_code: orderCode, contact },
            {
                preserveState: true,
                onFinish: () => setLoading(false),
            }
        );
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

    return (
        <>
            <Head title="Pelacakan Pesanan" />

            <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <Link href="/" style={{ color: '#0066cc', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <img src="/images/logo/galax-lockup.svg" alt="Galax — Samsung Authorized Reseller" style={{ height: '32px' }} />
                    </Link>
                    <Link href="/" style={{ color: '#0066cc', textDecoration: 'none', fontSize: '13px' }}>&larr; Kembali ke Beranda</Link>
                </div>

                <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
                    <h1 style={{ marginTop: 0, fontSize: '20px' }}>Lacak Status Pesanan</h1>

                    <form onSubmit={handleSearch}>
                        <div style={{ marginBottom: '12px' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Kode Pesanan:</label>
                            <input
                                type="text"
                                required
                                value={orderCode}
                                onChange={(e) => setOrderCode(e.target.value)}
                                placeholder="INV-202610-XXXXXX"
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>Email / No. HP:</label>
                            <input
                                type="text"
                                required
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                placeholder="email atau nomor whatsapp"
                                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                            />
                        </div>
                        <button type="submit" disabled={loading} style={{ padding: '10px 20px', backgroundColor: '#0066cc', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            {loading ? 'Mencari...' : 'Cari Pesanan'}
                        </button>
                    </form>
                </div>

                {errorMessage && (
                    <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '6px', marginBottom: '20px' }}>
                        {errorMessage}
                    </div>
                )}

                {order && (
                    <div style={{ border: '1px solid #2e7d32', borderRadius: '8px', padding: '24px', background: '#f1f8e9' }}>
                        <h2 style={{ marginTop: 0, fontSize: '18px' }}>Hasil Pelacakan: #{order.order_code}</h2>
                        <p>Status Terkini: <strong style={{ color: '#2e7d32', textTransform: 'uppercase' }}>{order.status}</strong></p>
                        <p>Penerima: <strong>{order.customer_name}</strong></p>
                        <p>Produk: <strong>{order.variant?.product_name || 'Samsung Galaxy'}</strong> — {order.variant?.color_name} ({order.variant?.ram} / {order.variant?.storage}) &times; {order.quantity} unit</p>
                        <p>Garansi: <strong style={{ color: '#16a34a' }}>✓ {order.warranty_type || 'Garansi Resmi SEIN'}</strong></p>
                        {order.imei && (
                            <p>IMEI Resmi SEIN: <strong style={{ fontFamily: 'monospace' }}>{order.imei}</strong></p>
                        )}
                        <p>Total Tagihan: <strong>{formatRupiah(order.total_price)}</strong></p>
                        {order.tracking_number && (
                            <p>No. Resi Pengiriman: <strong style={{ fontFamily: 'monospace', color: '#0284c7' }}>{order.tracking_number}</strong></p>
                        )}
                        <p>
                            <Link href={`/invoice/${order.order_code}`} style={{ color: '#0066cc' }}>Buka Halaman Invoice Lengkap &rarr;</Link>
                        </p>
                    </div>
                )}
            </div>
        </>
    );
}
