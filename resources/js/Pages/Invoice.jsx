import { Head, Link } from '@inertiajs/react';

export default function Invoice({ order, paymentDetails }) {
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

    return (
        <>
            <Head title={`Invoice #${order.order_code} — Samsung Authorized Reseller`} />

            <div style={{ maxWidth: '700px', margin: '40px auto', padding: '0 20px', fontFamily: 'sans-serif' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <Link href="/" style={{ color: '#0066cc', textDecoration: 'none' }}>&larr; Kembali ke Katalog</Link>
                    <Link href={`/track?order_code=${order.order_code}&contact=${encodeURIComponent(order.customer_email)}`} style={{ color: '#0066cc', textDecoration: 'none' }}>
                        Lacak Status Pesanan &rarr;
                    </Link>
                </div>

                <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <img src="/images/logo/galax-lockup.svg" alt="Galax — Samsung Authorized Reseller" style={{ height: '32px', marginBottom: '12px', display: 'block' }} />
                            <h1 style={{ margin: '4px 0 0 0', fontSize: '22px' }}>Faktur Pesanan #{order.order_code}</h1>
                        </div>
                        <span style={{
                            padding: '6px 12px',
                            borderRadius: '16px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            backgroundColor: order.status === 'paid' ? '#dcfce7' : (order.status === 'cancelled' ? '#fee2e2' : '#e0f2fe'),
                            color: order.status === 'paid' ? '#166534' : (order.status === 'cancelled' ? '#991b1b' : '#0369a1'),
                            textTransform: 'uppercase'
                        }}>
                            {order.status}
                        </span>
                    </div>

                    <p style={{ color: '#666', fontSize: '13px', margin: '8px 0 20px 0' }}>
                        Waktu Pemesanan: {new Date(order.created_at).toLocaleString('id-ID')}
                    </p>

                    {order.status === 'pending' && paymentDetails?.expiry_time && (
                        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', padding: '12px', borderRadius: '6px', marginBottom: '20px', fontSize: '13px', color: '#92400e' }}>
                            ⏱ <strong>Batas Waktu Pembayaran:</strong> {new Date(paymentDetails.expiry_time).toLocaleString('id-ID')} WIB (Sistem akan membatalkan otomatis dan merilis stok jika belum diselesaikan).
                        </div>
                    )}

                    <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />

                    <h2>Instruksi Pembayaran</h2>
                    <div style={{ background: '#f5f5f5', padding: '16px', borderRadius: '6px' }}>
                        <p style={{ margin: '0 0 8px 0' }}>Metode: <strong>{order.payment_method.toUpperCase()}</strong></p>
                        <p style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#0284c7' }}>
                            Total Pembayaran: <strong>{formatRupiah(order.total_price)}</strong>
                        </p>
                        <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>
                            (Termasuk 3-digit kode verifikasi transfer: +{order.unique_code})
                        </p>
                        {paymentDetails?.virtual_account && (
                            <p style={{ margin: '12px 0 0 0', fontSize: '16px' }}>
                                Nomor Virtual Account: <strong style={{ fontFamily: 'monospace' }}>{paymentDetails.virtual_account}</strong>
                            </p>
                        )}
                        {paymentDetails?.qris_payload && (
                            <div style={{ marginTop: '12px' }}>
                                <p style={{ margin: '0 0 6px 0', fontSize: '13px' }}>QRIS String Payload:</p>
                                <textarea readOnly rows="2" style={{ width: '100%', fontFamily: 'monospace', fontSize: '11px' }} value={paymentDetails.qris_payload} />
                            </div>
                        )}
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />

                    <h2>Detail Perangkat & Pengiriman</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                            <tr>
                                <td style={{ padding: '8px 0' }}>Produk:</td>
                                <td style={{ padding: '8px 0', textAlign: 'right' }}>
                                    <strong>{order.variant?.product_name || 'Samsung Galaxy'}</strong><br />
                                    <span style={{ fontSize: '13px', color: '#555' }}>
                                        {order.variant?.color_name} ({order.variant?.ram} / {order.variant?.storage})
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: '8px 0' }}>Garansi:</td>
                                <td style={{ padding: '8px 0', textAlign: 'right', color: '#16a34a', fontWeight: 'bold' }}>
                                    ✓ {order.warranty_type || 'Garansi Resmi SEIN (1 Tahun)'}
                                </td>
                            </tr>
                            {order.imei && (
                                <tr>
                                    <td style={{ padding: '8px 0' }}>IMEI Resmi:</td>
                                    <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'monospace', fontWeight: 'bold' }}>
                                        {order.imei}
                                    </td>
                                </tr>
                            )}
                            {order.tracking_number && (
                                <tr>
                                    <td style={{ padding: '8px 0' }}>Resi Pengiriman:</td>
                                    <td style={{ padding: '8px 0', textAlign: 'right', fontFamily: 'monospace', color: '#0284c7', fontWeight: 'bold' }}>
                                        {order.tracking_number}
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <td style={{ padding: '8px 0' }}>Jumlah Unit:</td>
                                <td style={{ padding: '8px 0', textAlign: 'right' }}>{order.quantity} unit</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '8px 0' }}>Harga Satuan:</td>
                                <td style={{ padding: '8px 0', textAlign: 'right' }}>{formatRupiah(order.unit_price)}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '8px 0' }}>Penerima:</td>
                                <td style={{ padding: '8px 0', textAlign: 'right' }}>{order.customer_name} ({order.customer_phone})</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '8px 0' }}>Email Invoice:</td>
                                <td style={{ padding: '8px 0', textAlign: 'right' }}>{order.customer_email}</td>
                            </tr>
                            <tr>
                                <td style={{ padding: '8px 0' }}>Metode Pengambilan:</td>
                                <td style={{ padding: '8px 0', textAlign: 'right' }}>
                                    {order.fulfillment_method === 'pickup' ? `Ambil di Toko: ${order.pickup_store}` : `Kirim ke: ${order.shipping_address}, ${order.shipping_city}`}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
