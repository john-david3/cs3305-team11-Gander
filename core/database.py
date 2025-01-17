import sqlite3

class Database:
    def __init__(self, db:str) -> None:
        self._db = db
        self._conn = None

    def create_connection(self) -> sqlite3.Cursor:
        conn = sqlite3.connect(self._db)
        self._conn = conn
        cursor = conn.cursor()
        return cursor

    def close_connection(self) -> None:
        self._conn.close()