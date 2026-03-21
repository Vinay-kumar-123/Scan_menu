from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth, store, product, order, subscription, webhook
from app.database.create_indexes import create_indexes

app = FastAPI()

# =========================
# ✅ CORS CONFIG
# =========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://scanbite-five.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# ✅ STARTUP EVENT
# =========================
@app.on_event("startup")
def startup():
    create_indexes()

# =========================
# ✅ ROUTES
# =========================
app.include_router(auth.router)
app.include_router(store.router)
app.include_router(product.router)
app.include_router(order.router)
app.include_router(subscription.router)
app.include_router(webhook.router)

@app.get("/health")
def health():
    return {"status": "ok"}
# =========================
# ✅ ROOT
# =========================
@app.get("/")
def read_root():
    return {"message": "Hello World"}