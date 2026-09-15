import sqlite3
conn = sqlite3.connect('itc_complaints.db')
cursor = conn.cursor()

# 1. Back up existing category to sub_category if empty
cursor.execute("UPDATE complaints SET sub_category = issue_category WHERE sub_category IS NULL or sub_category = ''")

# 2. Map old categories to new top-level categories
cursor.execute("UPDATE complaints SET issue_category = 'Complaint' WHERE issue_category IN ('Quality Complaint', 'Product Defect', 'Delivery Issue', 'Billing Issue')")
cursor.execute("UPDATE complaints SET issue_category = 'Compliment' WHERE issue_category IN ('Positive Feedback / Appreciation')")
cursor.execute("UPDATE complaints SET issue_category = 'Query' WHERE issue_category IN ('General Inquiry', 'Price & Value Comparison')")

# 3. Default for anything else
cursor.execute("UPDATE complaints SET issue_category = 'Feedback' WHERE issue_category NOT IN ('Complaint', 'Compliment', 'Query', 'Suggestion')")

conn.commit()
print(f"Migration complete. Handled {cursor.rowcount} records.")
conn.close()
