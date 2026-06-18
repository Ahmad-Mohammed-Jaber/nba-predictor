import redis.asyncio as redis
import json
import os
from typing import Any
from dotenv import load_dotenv

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

redis_client = redis.from_url(
    REDIS_URL,
    decode_responses=True
)

async def get_cached_data(key: str) -> Any | None:
    try:
        data = await redis_client.get(key)

        if data is not None:
            return json.loads(data)

    except Exception as e:
        print(f"Error fetching from Redis: {e}")

    return None


async def set_cached_data(
    key: str,
    value: Any,
    ttl: int = 10
):
    try:
        await redis_client.setex(
            key,
            ttl,
            json.dumps(value, default=str)
        )

    except Exception as e:
        print(f"Error storing in Redis: {e}")