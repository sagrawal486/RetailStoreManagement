from sqlalchemy import Column, Integer, String, Float, Date
from app.database import Base

class PricingRecord(Base):
    __tablename__ = "pricing_records"

    id = Column(Integer, primary_key=True, index=True)
    store_id = Column(String, index=True)
    sku = Column(String, index=True)
    product_name = Column(String)
    price = Column(Float)
    date = Column(String) 