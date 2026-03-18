from pydantic import BaseModel
from typing import List

class OrderItem(BaseModel):
    product_id: str
    qty: int

class OrderCreate(BaseModel):
    store_id: str
    customer_name: str   
    table: int           
    items: List[OrderItem]
    total: float