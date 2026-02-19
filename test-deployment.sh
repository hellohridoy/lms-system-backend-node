#!/bin/bash

echo "=========================================="
echo "Testing Library Management System Deployment"
echo "=========================================="
echo ""

BACKEND_URL="https://lms-system-backend-node-1.onrender.com"
FRONTEND_URL="https://librarymanagementsystem-eight.vercel.app"

echo "1. Testing Backend Health..."
echo "   URL: $BACKEND_URL/health"
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/health")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$HEALTH_RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Backend is healthy!"
    echo "   Response: $RESPONSE_BODY"
else
    echo "   ❌ Backend health check failed (HTTP $HTTP_CODE)"
    echo "   Response: $RESPONSE_BODY"
fi
echo ""

echo "2. Testing Books API..."
echo "   URL: $BACKEND_URL/api/books"
BOOKS_RESPONSE=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/api/books")
HTTP_CODE=$(echo "$BOOKS_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Books API is working!"
else
    echo "   ❌ Books API failed (HTTP $HTTP_CODE)"
fi
echo ""

echo "3. Testing Genres API..."
echo "   URL: $BACKEND_URL/api/books/genres"
GENRES_RESPONSE=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/api/books/genres")
HTTP_CODE=$(echo "$GENRES_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Genres API is working!"
else
    echo "   ❌ Genres API failed (HTTP $HTTP_CODE)"
fi
echo ""

echo "4. Testing Frontend..."
echo "   URL: $FRONTEND_URL"
FRONTEND_RESPONSE=$(curl -s -w "\n%{http_code}" "$FRONTEND_URL")
HTTP_CODE=$(echo "$FRONTEND_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Frontend is accessible!"
else
    echo "   ❌ Frontend failed (HTTP $HTTP_CODE)"
fi
echo ""

echo "=========================================="
echo "Deployment Test Complete!"
echo "=========================================="
echo ""
echo "Next Steps:"
echo "1. Open $FRONTEND_URL in your browser"
echo "2. Press F12 to open DevTools"
echo "3. Try to register/login"
echo "4. Check Console for CORS errors"
echo ""
echo "If you see CORS errors:"
echo "- Wait a few minutes for deployments to complete"
echo "- Check Render logs: https://dashboard.render.com/web/srv-d6b9rkoboq4c73fgrcgg"
echo "- Verify environment variables are set"
echo ""
