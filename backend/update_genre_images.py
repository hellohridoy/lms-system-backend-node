# Map genres to specific Unsplash Image IDs to ensure they look distinct and relevant
genre_images = {
    "Angular": "photo-1590595906931-81f04f0ccebb", # Abstract/Tech
    "AWS": "photo-1451187580459-43490279c0fa", # Cloud/Network
    "Azure": "photo-1581090464777-f3220bbe1b8b", # Blue/Tech
    "Docker": "photo-1605745341112-85968b19335b", # Containers/Shipping
    "Flutter": "photo-1617042375876-a13e36732a04", # Mobile/Dart
    "Go": "photo-1633356122544-f134324a6cee", # Code/Go
    "Java": "photo-1517694712202-14dd9538aa97", # Coding
    "Kotlin": "photo-1596727147705-54a9d6ed27e6", # Mobile/Tech
    "Kubernetes": "photo-1667372393119-c81c00489998", # K8s/Helm
    "Laravel": "photo-1603468620905-8de7d71279ed", # PHP/Web
    "Mobile Application": "photo-1526498460520-4c246339dccb", # Mobile Phone
    "MongoDB": "photo-1544383835-bda2bc66a55d", # Database/Leaf
    "MySQL": "photo-1563206767-5b1d97302591", # Database
    "Next.js": "photo-1618477388954-7852f32655ec", # React/Next
    "Node.js": "photo-1555099962-4199c345e5dd", # Code/Server
    "PostgreSQL": "photo-1617502787883-8a39a2b535d8", # Elephant/Database
    "Programming": "photo-1516116216624-53e697fedbea", # Generic Code
    "Python": "photo-1526379095098-d400fd0bf935", # Snake/Python
    "React": "photo-1633356122102-3fe601e1570a", # React Atom
    "React Native": "photo-1551650975-87deedd944c3", # Mobile/React
    "Redis": "photo-1519389950473-47ba0277781c", # Fast/Cache
    "Software Engineering": "photo-1461749280684-dccba630e2f6", # Engineering/Code
    "Spring Boot": "photo-1556075798-4825dfaaf498", # Spring/Leaf
    "Swift": "photo-1599839575945-a9e5af0c3fa5", # Swift/Apple
    "Tailwind": "photo-1587620962725-abab7fe55159", # CSS
    "Vue": "photo-1607799275518-d58665d099db" # Vue
}

base_url = "https://images.unsplash.com/"
params = "?auto=format&fit=crop&w=300&q=80"

sql_statements = []

for genre, image_id in genre_images.items():
    url = f"{base_url}{image_id}{params}"
    # Escape single quotes if needed
    sql = f"UPDATE books SET cover_url = '{url}' WHERE genre = '{genre}';"
    sql_statements.append(sql)

# Fallback for any other genre
default_url = f"{base_url}photo-1532012197267-da84d127e765{params}"
sql_statements.append(f"UPDATE books SET cover_url = '{default_url}' WHERE genre NOT IN ({', '.join([repr(g) for g in genre_images.keys()])});")

with open('update_genre_images.sql', 'w') as f:
    for stmt in sql_statements:
        f.write(stmt + "\n")

print(f"Generated {len(sql_statements)} statements in update_genre_images.sql")
