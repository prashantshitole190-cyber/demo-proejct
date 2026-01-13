# Medium Clone API - CURL Testing Commands

## Authentication APIs

### 1. Register User
```bash
curl -X POST http://localhost:8000/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123",
    "first_name": "Test",
    "last_name": "User"
  }'
```

### 2. Login User
```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### 3. Get User Profile
```bash
curl -X GET http://localhost:8000/api/v1/users/profile/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

### 4. Logout User
```bash
curl -X POST http://localhost:8000/api/v1/auth/logout/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

## User Management APIs

### 5. Get User by Email
```bash
curl -X GET http://localhost:8000/api/v1/users/test@example.com/
```

### 6. Get User Articles
```bash
curl -X GET http://localhost:8000/api/v1/users/test@example.com/articles/
```

### 7. Follow User
```bash
curl -X POST http://localhost:8000/api/v1/users/test@example.com/follow/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

### 8. Unfollow User
```bash
curl -X DELETE http://localhost:8000/api/v1/users/test@example.com/follow/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

## Article APIs

### 9. Create Article
```bash
curl -X POST http://localhost:8000/api/v1/articles/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Article",
    "content": "This is the content of my first article. It contains multiple paragraphs.\n\nThis is the second paragraph with more details.",
    "excerpt": "A brief summary of the article",
    "tag_names": ["technology", "programming"]
  }'
```

### 10. Create Article with Image
```bash
curl -X POST http://localhost:8000/api/v1/articles/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -F "title=Article with Image" \
  -F "content=This article has a featured image." \
  -F "excerpt=Article with image example" \
  -F "featured_image=@/path/to/your/image.jpg"
```

### 11. Get All Articles
```bash
curl -X GET http://localhost:8000/api/v1/articles/
```

### 12. Get Article by Slug
```bash
curl -X GET http://localhost:8000/api/v1/articles/my-first-article/
```

### 13. Update Article
```bash
curl -X PUT http://localhost:8000/api/v1/articles/my-first-article/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Updated Article",
    "content": "This is the updated content.",
    "excerpt": "Updated excerpt"
  }'
```

### 14. Publish Article
```bash
curl -X POST http://localhost:8000/api/v1/articles/my-first-article/publish/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

### 15. Delete Article
```bash
curl -X DELETE http://localhost:8000/api/v1/articles/my-first-article/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

### 16. Get Tags
```bash
curl -X GET http://localhost:8000/api/v1/articles/tags/
```

## Interaction APIs

### 17. Clap Article
```bash
curl -X POST http://localhost:8000/api/v1/interactions/clap/my-first-article/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

### 18. Bookmark Article
```bash
curl -X POST http://localhost:8000/api/v1/interactions/bookmark/my-first-article/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

### 19. Remove Bookmark
```bash
curl -X DELETE http://localhost:8000/api/v1/interactions/bookmark/my-first-article/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

## Comment APIs

### 20. Get Article Comments
```bash
curl -X GET http://localhost:8000/api/v1/comments/article/my-first-article/
```

### 21. Create Comment
```bash
curl -X POST http://localhost:8000/api/v1/comments/article/my-first-article/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This is a great article! Thanks for sharing."
  }'
```

### 22. Reply to Comment
```bash
curl -X POST http://localhost:8000/api/v1/comments/article/my-first-article/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "I agree with your comment!",
    "parent": 1
  }'
```

### 23. Update Comment
```bash
curl -X PUT http://localhost:8000/api/v1/comments/1/ \
  -H "Authorization: Token YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Updated comment content"
  }'
```

### 24. Delete Comment
```bash
curl -X DELETE http://localhost:8000/api/v1/comments/1/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

## Feed APIs

### 25. Get Personalized Feed
```bash
curl -X GET http://localhost:8000/api/v1/feeds/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

## Notification APIs

### 26. Get Notifications
```bash
curl -X GET http://localhost:8000/api/v1/notifications/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

### 27. Mark Notification as Read
```bash
curl -X POST http://localhost:8000/api/v1/notifications/1/read/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

### 28. Mark All Notifications as Read
```bash
curl -X POST http://localhost:8000/api/v1/notifications/mark-all-read/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

## Testing Workflow

### Step 1: Setup
1. Start your Django server: `python manage.py runserver`
2. Make sure you have run migrations: `python manage.py migrate`

### Step 2: Authentication Flow
1. Register a user (API #1)
2. Login to get token (API #2)
3. Replace `YOUR_TOKEN_HERE` with the actual token in subsequent requests

### Step 3: Content Creation
1. Create an article (API #9 or #10)
2. Publish the article (API #14)
3. Add comments (API #21, #22)

### Step 4: Interactions
1. Clap the article (API #17)
2. Bookmark the article (API #18)
3. Follow users (API #7)

### Step 5: Notifications & Feed
1. Check notifications (API #26)
2. Get personalized feed (API #25)

## Response Examples

### Successful Registration Response:
```json
{
  "token": "9944b09199c62bcf9418ad846dd0e4bbdfc6ee4b",
  "user": {
    "id": 1,
    "username": "test@example.com",
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User"
  }
}
```

### Article List Response:
```json
{
  "results": [
    {
      "id": 1,
      "title": "My First Article",
      "slug": "my-first-article",
      "excerpt": "A brief summary",
      "author": {
        "id": 1,
        "username": "testuser",
        "email": "test@example.com"
      },
      "featured_image": "/media/articles/image.jpg",
      "read_time": 3,
      "views_count": 15,
      "created_at": "2024-01-10T12:00:00Z"
    }
  ]
}
```

### Error Response:
```json
{
  "error": "Invalid credentials"
}
```

## Notes
- Replace `YOUR_TOKEN_HERE` with actual token from login response
- Replace `/path/to/your/image.jpg` with actual image file path
- All timestamps are in ISO 8601 format
- File uploads require `multipart/form-data` content type
- Most endpoints support pagination with `?page=1&page_size=20` parameters