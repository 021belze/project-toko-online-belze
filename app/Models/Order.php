<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'variant_id',
        'warranty_type',
        'order_code',
        'quantity',
        'unit_price',
        'unique_code',
        'insurance_fee',
        'total_price',
        'customer_name',
        'customer_email',
        'customer_phone',
        'fulfillment_method',
        'pickup_store',
        'shipping_province',
        'shipping_city',
        'shipping_district',
        'shipping_postal_code',
        'shipping_address',
        'payment_method',
        'status',
        'tracking_number',
        'imei',
        'serial_number',
        'expires_at',
        'paid_at',
        'shipped_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'insurance_fee' => 'decimal:2',
            'total_price' => 'decimal:2',
            'quantity' => 'integer',
            'unique_code' => 'integer',
            'expires_at' => 'datetime',
            'paid_at' => 'datetime',
            'shipped_at' => 'datetime',
        ];
    }

    /**
     * Check if the order payment deadline has expired.
     */
    public function isExpired(): bool
    {
        return $this->status === 'pending'
            && $this->expires_at !== null
            && $this->expires_at->isPast();
    }

    /**
     * Mark order as paid.
     */
    public function markAsPaid(): bool
    {
        $this->status = 'paid';
        $this->paid_at = now();

        return $this->save();
    }

    /**
     * Mark order as shipped with tracking resi and device IMEI.
     */
    public function markAsShipped(string $trackingNumber, ?string $imei = null, ?string $serialNumber = null): bool
    {
        $this->status = 'shipped';
        $this->tracking_number = $trackingNumber;
        if ($imei !== null) {
            $this->imei = $imei;
        }
        if ($serialNumber !== null) {
            $this->serial_number = $serialNumber;
        }
        $this->shipped_at = now();

        return $this->save();
    }

    /**
     * @return BelongsTo<ProductVariant, $this>
     */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
