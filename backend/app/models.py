from pydantic import BaseModel

class PricingRecordUpdate(BaseModel):
    store_id: str = None
    sku: str = None
    product_name: str = None
    price: float = None
    date: str = None