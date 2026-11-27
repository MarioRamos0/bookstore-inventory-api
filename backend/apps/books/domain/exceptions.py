class DomainError(Exception):
    def __init__(self, message: str, field: str | None = None):
        """Inicializa un error de dominio con mensaje y campo opcional."""
        super().__init__(message)
        self.message = message
        self.field = field


class BookValidationError(DomainError):
    pass


class DuplicateISBNError(BookValidationError):
    pass


class BookNotFoundError(DomainError):
    pass
