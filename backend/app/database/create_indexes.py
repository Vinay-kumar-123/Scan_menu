from app.database.mongodb import db
from pymongo.errors import OperationFailure

def create_indexes():
    try:
        # 🔥 UNIQUE EMAIL (case-insensitive)
        db.users.create_index(
            [("email", 1)],
            unique=True,
            collation={"locale": "en", "strength": 2}
        )

        db.orders.create_index([("store_id", 1), ("created_at", -1)])
        

       

    except OperationFailure as e:
        print("⚠️ Index error:", e)