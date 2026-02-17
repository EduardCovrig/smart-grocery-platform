import uvicorn

#ruleaza cu python3 run.py

if __name__ == "__main__":
    #Porneste serverul automat pe portul 8000 si da reload la modificari
    #echivalent cu asta in terminal: python3 -m uvicorn main:app --reload --port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)