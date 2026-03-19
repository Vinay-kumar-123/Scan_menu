from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    MONGO_URI: str
    DB_NAME: str
    JWT_SECRET: str
    JWT_ALGORITHM: str
    RAZORPAY_KEY_ID: str
    RAZORPAY_SECRET: str
    RAZORPAY_WEBHOOK_SECRET: str
    class Config:
        env_file = ".env"


settings = Settings()