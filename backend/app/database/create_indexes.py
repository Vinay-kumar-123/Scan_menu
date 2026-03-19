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

        # 🔥 UNIQUE PHONE
        db.users.create_index("phone", unique=True)

        print("✅ Indexes created successfully")

    except OperationFailure as e:
        print("⚠️ Index error:", e)