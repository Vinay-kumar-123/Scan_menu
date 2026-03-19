from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth,store, product,order,subscription,webhook
app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # 🔥 TEMP FULL OPEN
    allow_credentials=True,
    allow_methods=["*"],   # 🔥 VERY IMPORTANT
    allow_headers=["*"],   # 🔥 VERY IMPORTANT
)
app.include_router(auth.router)
app.include_router(store.router)
app.include_router(product.router)
app.include_router(order.router)
app.include_router(subscription.router)

app.include_router(webhook.router)
@app.get("/")
def read_root():
    return {"message": "Hello Worlds"}