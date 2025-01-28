import sqlite3
import os

class Database:
    def __init__(self) -> None:
        self._db = os.path.join(os.path.abspath(os.path.dirname(__file__)), "app.db")
        self.cursor = None

    def create_connection(self) -> sqlite3.Cursor:
        conn = sqlite3.connect(self._db)
        conn.row_factory = sqlite3.Row
        self._conn = conn
        self.cursor = conn.cursor()
        return self.cursor
    
    def fetchall(self, query: str, parameters=None) -> list[dict]:
        if parameters:
            self.cursor.execute(query, parameters)
        else:
            self.cursor.execute(query)

        result = self.cursor.fetchall()
        return self.convert_to_list_dict(result)
    
    def fetchone(self, query: str, parameters=None) -> list[dict]:
        if parameters:
            self.cursor.execute(query, parameters)
        else:
            self.cursor.execute(query)

        result = self.cursor.fetchone()
        return self.convert_to_list_dict(result)
    
    def convert_to_list_dict(self, result):
        """
        Converts a query result to a list of dictionaries
        """
        # Get the column names from the cursor
        columns = [description[0] for description in self.cursor.description]

        if not result:
            # for empty result
            return []
        elif isinstance(result, sqlite3.Row):
            # for fetchone
            return dict(zip(columns, result))
        else:
            # for fetchall or fetchmany
            return [dict(zip(columns, row)) for row in result]
    
    def commit_data(self):
        try:
            self._conn.commit()
        except Exception as e:
            print(e)

    def close_connection(self) -> None:
        self._conn.close()