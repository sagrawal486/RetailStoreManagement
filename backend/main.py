from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session
from app import models, database, schemas
from app.database import SessionLocal, engine
import uvicorn
database.Base.metadata.create_all(bind=engine)

app = APIRouter()


@app.get("/")
def ping():
    """
    Ping    
    """
    return "Hello World"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/api/pricing-data")
def get_pricing_data(
    store_id: str = None,
    sku: str = None,
    product_name: str = None,
    min_price: float = None,
    max_price: float = None,
    date: str = None,
    db: Session = Depends(get_db),
):
    query = db.query(schemas.PricingRecord)

    if store_id:
        query = query.filter(schemas.PricingRecord.store_id == store_id)
    if sku:
        query = query.filter(schemas.PricingRecord.sku == sku)
    if product_name:
        query = query.filter(schemas.PricingRecord.product_name.contains(product_name))
    if min_price:
        query = query.filter(schemas.PricingRecord.price >= min_price)
    if max_price:
        query = query.filter(schemas.PricingRecord.price <= max_price)
    if date:
        query = query.filter(schemas.PricingRecord.date == date)

    return query.all()

@app.get("/api/pricing-data/{id}")
def get_pricing_record(id: int, db: Session = Depends(get_db)):
    return db.query(schemas.PricingRecord).filter(schemas.PricingRecord.id == id).first()

@app.put("/api/pricing-data/{id}")
def update_pricing_record(id: int, record: models.PricingRecordUpdate, db: Session = Depends(get_db)):
    db_record = db.query(schemas.PricingRecord).filter(schemas.PricingRecord.id == id).first()
    if db_record:
        for key, value in record.dict(exclude_unset=True).items():
            setattr(db_record, key, value)
        db.commit()
        return db_record
    return {"error": "Record not found"}

@app.post("/api/pricing-data/upload")
async def upload_pricing_data(file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Uploaded file must be a CSV.")

    try:

        content = await file.read()  
        lines = content.decode().splitlines()
        
        records = []
        
        for line in lines[1:]: 
            fields = line.split(",")
            if len(fields) < 5: 
                continue
            
            record = schemas.PricingRecord(
                store_id=fields[0],
                sku=fields[1],
                product_name=fields[2],
                price=float(fields[3]),
                date=fields[4],
            )
            records.append(record)

        if records:
            db.add_all(records)
            db.commit()
            return {"message": f"{len(records)} records uploaded successfully"}
        else:
            return {"message": "No valid records found in the uploaded file."}

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=f"Value error: {str(ve)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process the file: {str(e)}")
    
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
