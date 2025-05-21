curl -X POST \
  -H "Authorization: Bearer your-token" \
  -H "Content-Type: application/json" \
  -d '{"bookId": 1, "customerName": "John Doe"}' \
  http://localhost:4010/orders
