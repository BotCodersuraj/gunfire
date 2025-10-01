from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import time

app = FastAPI()

opens = 0
last_reset = time.time()

@app.get("/api/stats")
async def get_stats():
    global opens, last_reset
    now = time.time()

    # 24 hours = 86400 sec
    if now - last_reset >= 86400:
        opens = 0
        last_reset = now

    return JSONResponse({"opens": opens, "lastReset": last_reset})

@app.post("/api/stats")
async def add_open():
    global opens, last_reset
    now = time.time()

    # reset after 24h
    if now - last_reset >= 86400:
        opens = 0
        last_reset = now

    opens += 1
    return JSONResponse({"ok": True, "opens": opens, "lastReset": last_reset})