import sqlite3
import os

class Database:
    def __init__(self) -> None:
        self._db = os.path.join(os.path.abspath(os.path.dirname(__file__)), "app.db")
        self._conn = None
        self.cursor = None
        self.create_connection()

    def __enter__(self):
        """Returns db on using with clause"""
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        """Closes db connection after with clause"""
        self.close_connection()

    def create_connection(self) -> None:
        """Create a database connection if not already established."""
        if self._conn is None:
            self._conn = sqlite3.connect(self._db)
            self._conn.row_factory = sqlite3.Row
            self.cursor = self._conn.cursor()

    def close_connection(self) -> None:
        """Close the database connection."""
        if self._conn:
            self._conn.close()
            self._conn = None
            self.cursor = None

    def fetchall(self, query: str, parameters=None) -> list[dict]:
        """Fetch all records from the database."""
        self.create_connection()
        self.cursor.execute(query, parameters or ())
        result = self.cursor.fetchall()
        return self.convert_to_list_dict(result)

    def fetchone(self, query: str, parameters=None) -> dict | None:
        """Fetch one record from the database."""
        self.create_connection()
        self.cursor.execute(query, parameters or ())
        result = self.cursor.fetchone()
        return self.convert_to_list_dict(result) if result else None

    def execute(self, query: str, parameters=None) -> None:
        """Execute an INSERT, UPDATE, or DELETE command and commit changes."""
        self.create_connection()
        try:
            self.cursor.execute(query, parameters or ())
            self._conn.commit()
        except sqlite3.DatabaseError as e:
            print(f"Database error: {e}")
            raise

    def convert_to_list_dict(self, result):
        """Convert query result to a list of dictionaries."""
        if not result:
            return []
        columns = [desc[0] for desc in self.cursor.description]
        return [dict(zip(columns, row)) for row in result] if isinstance(result, list) else dict(zip(columns, result))
