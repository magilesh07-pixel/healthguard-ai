import sqlite3
import json

DB_PATH = "healthguard.db"

def check_db():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Check if table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='history'")
        if not cursor.fetchone():
            print("Table 'history' does not exist yet.")
            return

        cursor.execute("SELECT * FROM history ORDER BY timestamp DESC")
        rows = cursor.fetchall()
        
        if not rows:
            print("Database is empty (no records found in 'history' table).")
        else:
            print(f"Success! Found {len(rows)} records.")
            for row in rows[:3]: # Show latest 3
                print(f"ID: {row[0]}, Type: {row[2]}, Timestamp: {row[4]}")
                # print(f"Data snippet: {row[3][:100]}...")
        
        conn.close()
    except Exception as e:
        print(f"Error checking database: {e}")

if __name__ == "__main__":
    check_db()
