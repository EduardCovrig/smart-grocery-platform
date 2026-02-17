import os
import pandas as pd
from fastapi import FastAPI
from sklearn.metrics.pairwise import cosine_similarity
import psycopg2
import warnings
from dotenv import load_dotenv

load_dotenv() #incarca variabilele (baza de date) din .env
warnings.filterwarnings('ignore')

app=FastAPI(title="Machine Learning Licenta Covrig Eduard", description="Machine Learning Recommendation System")

DB_CONFIG={
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password":os.getenv("DB_PASSWORD"),
    "host":os.getenv("DB_HOST"),
    "port":os.getenv("DB_PORT")
}