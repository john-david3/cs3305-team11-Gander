import sqlite3
import os

class Database:
    def __init__(self) -> None:
        self._db = os.path.join(os.path.abspath(os.path.dirname(__file__)), "app.db")

    def create_connection(self) -> sqlite3.Cursor:
        conn = sqlite3.connect(self._db)
        conn.row_factory = sqlite3.Row
        self._conn = conn
        cursor = conn.cursor()
        return cursor
    
    def commit_data(self):
        try:
            self._conn.commit()
        except Exception as e:
            print(e)

    def close_connection(self) -> None:
        self._conn.close()