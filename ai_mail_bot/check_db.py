import sqlite3
conn = sqlite3.connect('itc_complaints.db')
cursor = conn.execute("PRAGMA table_info(complaints)")
columns = [row[1] for row in cursor.fetchall()]
print("Columns:", columns)
cursor = conn.execute("SELECT id, reference_id FROM complaints LIMIT 5")
rows = cursor.fetchall()
print("First 5 IDs & Reference IDs:", rows)
conn.close()
