from decimal import Decimal
import requests
from django.conf import settings


DEFAULT_TARGET_CURRENCY = "EUR"


class ExchangeRateClient:
    def __init__(
        self,
        api_url: str | None = None,
        target_currency: str | None = None,
        default_rate: Decimal | float | str | None = None,
        timeout: int | None = None,
    ):
        """Inicializa el cliente de tasas de cambio con la moneda local seleccionada y tasa de respaldo."""
        self.api_url = api_url or settings.EXCHANGE_RATE_API_URL
        self.target_currency = (target_currency or DEFAULT_TARGET_CURRENCY).strip().upper()
        fallback_val = default_rate if default_rate is not None else settings.DEFAULT_EXCHANGE_RATE
        self.default_rate = Decimal(str(fallback_val))
        self.timeout = timeout if timeout is not None else settings.EXCHANGE_RATE_TIMEOUT

    def get_exchange_rate(self) -> tuple[Decimal, str]:
        """Obtiene la tasa de cambio desde la API externa o retorna la tasa por defecto si falla."""
        try:
            response = requests.get(self.api_url, timeout=self.timeout)
            response.raise_for_status()
            payload = response.json()
            rates = payload.get("rates", {})
            rate_value = rates.get(self.target_currency)
            if rate_value is None:
                return self.default_rate, self.target_currency
            return Decimal(str(rate_value)), self.target_currency
        except (requests.RequestException, ValueError, KeyError, TypeError):
            return self.default_rate, self.target_currency
