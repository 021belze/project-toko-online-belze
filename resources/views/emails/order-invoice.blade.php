<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice Pesanan #{{ $order->order_code }}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .header { background: #0f172a; color: #ffffff; padding: 28px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
        .header p { margin: 6px 0 0; color: #94a3b8; font-size: 13px; }
        .body { padding: 28px; }
        .order-badge { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 6px 14px; border-radius: 9999px; font-weight: 600; font-size: 13px; margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        .table th { text-align: left; padding: 10px; font-size: 12px; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #e2e8f0; }
        .table td { padding: 12px 10px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .total-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-top: 20px; }
        .total-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px; }
        .grand-total { font-size: 18px; font-weight: 700; color: #0284c7; border-top: 1px solid #e2e8f0; padding-top: 8px; margin-top: 8px; }
        .fulfillment-box { margin-top: 20px; padding: 16px; border-radius: 12px; background: #f1f5f9; font-size: 13px; }
        .footer { text-align: center; padding: 24px; font-size: 12px; color: #94a3b8; }
        .btn { display: inline-block; background: #0284c7; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 14px; margin-top: 20px; text-align: center; }
        .sein-badge { display: inline-block; background: #dcfce7; color: #15803d; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px; margin-top: 4px; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h1>Galax — Samsung Authorized Reseller</h1>
            <p>Konfirmasi & Faktur Resmi Pesanan Gadget Samsung</p>
        </div>
        <div class="body">
            <div class="order-badge">Kode Invoice: {{ $order->order_code }}</div>
            <p style="margin-top: 0; font-size: 14px;">Halo <strong>{{ $order->customer_name }}</strong>,</p>
            <p style="font-size: 14px; color: #475569;">
                Terima kasih telah berbelanja di Samsung Authorized Partner. Pesanan Anda saat ini berstatus <strong>{{ strtoupper($order->status) }}</strong>.
            </p>

            @if($order->expires_at && $order->status === 'pending')
                <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #991b1b; margin-bottom: 16px;">
                    ⏱ <strong>Batas Pembayaran:</strong> {{ $order->expires_at->format('d M Y, H:i') }} WIB (Pesanan akan dibatalkan otomatis jika belum diselesaikan).
                </div>
            @endif

            <table class="table">
                <thead>
                    <tr>
                        <th>Produk</th>
                        <th>Qty</th>
                        <th style="text-align: right;">Harga Satuan</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <strong>{{ $order->variant?->product_name ?? 'Samsung Galaxy' }}</strong><br>
                            <span style="font-size: 13px; color: #334155;">
                                Varian: {{ $order->variant?->color_name }} | {{ $order->variant?->ram }} / {{ $order->variant?->storage }}
                            </span><br>
                            <span class="sein-badge">✓ {{ $order->warranty_type ?? 'Garansi Resmi SEIN' }}</span>
                            @if($order->imei)
                                <div style="margin-top: 6px; font-size: 12px; color: #475569;">
                                    <strong>IMEI Resmi:</strong> <span style="font-family: monospace;">{{ $order->imei }}</span>
                                </div>
                            @endif
                        </td>
                        <td>{{ $order->quantity }}x</td>
                        <td style="text-align: right;">Rp {{ number_format($order->unit_price, 0, ',', '.') }}</td>
                    </tr>
                </tbody>
            </table>

            <div class="total-box">
                <div style="font-size: 13px; color: #64748b; margin-bottom: 6px;">Metode Pembayaran: <strong>{{ strtoupper($order->payment_method) }}</strong></div>
                <div style="font-size: 13px; color: #64748b; margin-bottom: 6px;">Kode Unik Transfer: <strong>+{{ $order->unique_code }}</strong></div>
                @if($order->insurance_fee > 0)
                    <div style="font-size: 13px; color: #64748b; margin-bottom: 6px;">Asuransi Gadget: <strong>Rp {{ number_format($order->insurance_fee, 0, ',', '.') }}</strong></div>
                @endif
                <div class="grand-total">
                    Total Tagihan: Rp {{ number_format($order->total_price, 0, ',', '.') }}
                </div>
            </div>

            <div class="fulfillment-box">
                @if($order->fulfillment_method === 'pickup')
                    <strong>📍 Pengambilan di Toko Fisik (Samsung Experience Store)</strong><br>
                    Cabang: {{ $order->pickup_store }}
                @else
                    <strong>🚚 Pengiriman ke Alamat Pelanggan</strong><br>
                    {{ $order->shipping_address }}<br>
                    {{ $order->shipping_district }}, {{ $order->shipping_city }}, {{ $order->shipping_province }} {{ $order->shipping_postal_code }}
                    @if($order->tracking_number)
                        <div style="margin-top: 8px; font-weight: 600; color: #0369a1;">
                            Nomor Resi: <span style="font-family: monospace;">{{ $order->tracking_number }}</span>
                        </div>
                    @endif
                @endif
            </div>

            <div style="text-align: center;">
                <a href="{{ url('/invoice/' . $order->order_code) }}" class="btn">Buka Halaman Invoice & QRIS/VA</a>
            </div>
        </div>
        <div class="footer">
            Pusat Bantuan Samsung Authorized Reseller. Unit 100% Baru, Segel Asli, dan Terdaftar di Kemenperin/Postel Indonesia.
        </div>
    </div>
</body>
</html>
