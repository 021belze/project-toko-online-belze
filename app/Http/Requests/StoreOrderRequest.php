<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        $emailRule = app()->environment('testing') ? 'email' : 'email:rfc,dns';

        return [
            'variant_id' => ['required', 'exists:product_variants,id'],
            'quantity' => ['required', 'integer', 'min:1', 'max:5'],
            'customer_name' => ['required', 'string', 'min:3', 'max:100'],
            'customer_email' => ['required', $emailRule, 'max:100'],
            'customer_phone' => ['required', 'string', 'min:10', 'max:15'],
            'fulfillment_method' => ['required', 'in:delivery,pickup'],
            'pickup_store' => ['nullable', 'required_if:fulfillment_method,pickup', 'string', 'max:100'],
            'shipping_province' => ['nullable', 'required_if:fulfillment_method,delivery', 'string', 'max:100'],
            'shipping_city' => ['nullable', 'required_if:fulfillment_method,delivery', 'string', 'max:100'],
            'shipping_district' => ['nullable', 'required_if:fulfillment_method,delivery', 'string', 'max:100'],
            'shipping_postal_code' => ['nullable', 'required_if:fulfillment_method,delivery', 'string', 'max:10'],
            'shipping_address' => ['nullable', 'required_if:fulfillment_method,delivery', 'string', 'min:10'],
            'payment_method' => ['required', 'in:qris,va_bca,va_mandiri,va_bni,va_bri,gopay,dana,shopeepay'],
        ];
    }

    /**
     * Get custom error messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'variant_id.required' => 'Pilih varian produk terlebih dahulu.',
            'variant_id.exists' => 'Varian produk yang dipilih tidak valid.',
            'quantity.required' => 'Jumlah pesanan wajib diisi.',
            'quantity.min' => 'Jumlah pesanan minimal 1 unit.',
            'quantity.max' => 'Jumlah pesanan maksimal 5 unit per transaksi.',
            'customer_name.required' => 'Nama lengkap wajib diisi.',
            'customer_name.min' => 'Nama lengkap minimal 3 karakter.',
            'customer_email.required' => 'Alamat email wajib diisi.',
            'customer_email.email' => 'Format email tidak valid atau domain tidak aktif.',
            'customer_phone.required' => 'Nomor HP/WhatsApp wajib diisi.',
            'customer_phone.min' => 'Nomor HP minimal 10 digit.',
            'fulfillment_method.required' => 'Pilih metode pengiriman atau ambil di toko.',
            'pickup_store.required_if' => 'Pilih cabang toko fisik untuk pengambilan barang.',
            'shipping_province.required_if' => 'Provinsi pengiriman wajib diisi.',
            'shipping_city.required_if' => 'Kota/Kabupaten pengiriman wajib diisi.',
            'shipping_district.required_if' => 'Kecamatan pengiriman wajib diisi.',
            'shipping_postal_code.required_if' => 'Kode pos pengiriman wajib diisi.',
            'shipping_address.required_if' => 'Alamat lengkap pengiriman wajib diisi.',
            'shipping_address.min' => 'Alamat pengiriman minimal 10 karakter.',
            'payment_method.required' => 'Pilih metode pembayaran yang tersedia.',
            'payment_method.in' => 'Metode pembayaran tidak valid.',
        ];
    }
}
