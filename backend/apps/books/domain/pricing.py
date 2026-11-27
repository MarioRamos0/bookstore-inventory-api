from decimal import Decimal, ROUND_HALF_UP

FIXED_MARGIN_PERCENTAGE = 40
MARGIN_MULTIPLIER = Decimal("1.40")
TWO_PLACES = Decimal("0.01")


def calculate_pricing_breakdown(cost_usd: Decimal, exchange_rate: Decimal) -> dict:
    """Calcula el costo local y el precio de venta sugerido aplicando un margen fijo del 40%."""
    cost_usd_dec = Decimal(str(cost_usd)).quantize(TWO_PLACES, rounding=ROUND_HALF_UP)
    rate_dec = Decimal(str(exchange_rate))
    cost_local = (cost_usd_dec * rate_dec).quantize(TWO_PLACES, rounding=ROUND_HALF_UP)
    selling_price_local = (cost_local * MARGIN_MULTIPLIER).quantize(TWO_PLACES, rounding=ROUND_HALF_UP)

    return {
        "cost_usd": cost_usd_dec,
        "exchange_rate": rate_dec,
        "cost_local": cost_local,
        "margin_percentage": FIXED_MARGIN_PERCENTAGE,
        "selling_price_local": selling_price_local,
    }
