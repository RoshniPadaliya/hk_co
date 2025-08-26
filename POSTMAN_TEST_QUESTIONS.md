# Postman Test Questions for HK AI Chatbot

## Health Check
**GET** `http://localhost:8080/api/health`

## Test Questions by Page Category

### 1. Main Website & About Page
**URLs**: `https://www.hk.co/`, `https://www.hk.co/about-leading-diamond-manufacturer`

**Test Questions:**
```json
{
  "message": "What is Hari Krishna Exports?"
}
```

```json
{
  "message": "Tell me about your company"
}
```

```json
{
  "message": "Where are you located?"
}
```

### 2. Leadership Page
**URL**: `https://www.hk.co/hari-krishna-group-leaders`

**Test Questions:**
```json
{
  "message": "Who are the founders of HK?"
}
```

```json
{
  "message": "Tell me about Savji Dholakia"
}
```

```json
{
  "message": "Who is shavji dholakia?"
}
```

```json
{
  "message": "What awards has Savji Dholakia received?"
}
```

### 3. Sustainability Page
**URL**: `https://www.hk.co/sustainability`

**Test Questions:**
```json
{
  "message": "What are your sustainability initiatives?"
}
```

```json
{
  "message": "Tell me about Mission 102030"
}
```

```json
{
  "message": "What solar energy programs do you have?"
}
```

```json
{
  "message": "How do you conserve water?"
}
```

### 4. Certifications Page
**URL**: `https://www.hk.co/diamond-industry-certifications`

**Test Questions:**
```json
{
  "message": "What certifications do you have?"
}
```

```json
{
  "message": "Are your diamonds GIA certified?"
}
```

```json
{
  "message": "What is Tracr blockchain?"
}
```

### 5. CSR Activities Page
**URL**: `https://www.hk.co/csr-activity-topmost-diamond-manufacturer`

**Test Questions:**
```json
{
  "message": "What CSR activities do you do?"
}
```

```json
{
  "message": "How do you support communities?"
}
```

### 6. Diamond Education Page
**URL**: `https://www.hk.co/diamond-education`

**Test Questions:**
```json
{
  "message": "What are the 4Cs of diamonds?"
}
```

```json
{
  "message": "Explain diamond carat weight"
}
```

```json
{
  "message": "What is diamond color grading?"
}
```

```json
{
  "message": "Tell me about diamond clarity"
}
```

### 7. Privacy Policy Page
**URL**: `https://www.hk.co/privacy-policy`

**Test Questions:**
```json
{
  "message": "What is your privacy policy?"
}
```

```json
{
  "message": "How do you protect customer data?"
}
```

### 8. Terms & Conditions Page
**URL**: `https://www.hk.co/terms-and-conditions`

**Test Questions:**
```json
{
  "message": "What are your terms and conditions?"
}
```

### 9. Business Principles Page
**URL**: `https://www.hk.co/business-principles`

**Test Questions:**
```json
{
  "message": "What are your business principles?"
}
```

```json
{
  "message": "How do you ensure ethical sourcing?"
}
```

### 10. Achievements Page
**URL**: `https://www.hk.co/hari-krishna-exports-achievements`

**Test Questions:**
```json
{
  "message": "What awards has HK received?"
}
```

```json
{
  "message": "Tell me about your achievements"
}
```

### 11. Grading System Page
**URL**: `https://www.hk.co/hari-krishna-exports-grading`

**Test Questions:**
```json
{
  "message": "What is your grading system?"
}
```

```json
{
  "message": "How do you grade diamonds?"
}
```

### 12. Concierge Services Page
**URL**: `https://www.hk.co/concierge-services`

**Test Questions:**
```json
{
  "message": "What concierge services do you offer?"
}
```

### 13. Contact Page
**URL**: `https://www.hk.co/contact-global-diamond-manufacturer`

**Test Questions:**
```json
{
  "message": "How can I contact you?"
}
```

```json
{
  "message": "Where is your head office?"
}
```

### 14. Blog/Events Page
**URL**: `https://www.hk.co/blog/events-news/`

**Test Questions:**
```json
{
  "message": "What events are you attending?"
}
```

```json
{
  "message": "Tell me about upcoming events"
}
```

### 15. Suggestion Page
**URL**: `https://www.hk.co/hk-suggestion`

**Test Questions:**
```json
{
  "message": "How can I make a suggestion?"
}
```

## Postman Collection Example

You can create a Postman collection with these requests:

1. **Collection Name**: HK AI Chatbot Tests
2. **Base URL**: `http://localhost:8080`
3. **Endpoints**:
   - Health Check: `GET /api/health`
   - AI Chat: `POST /api/chat/openai`
   - Fixed Responses: `GET /api/fixed?key={key_name}`
   - Combined Chat: `POST /api/chat`

## Expected Responses

For each test, you should receive:
- **Proper context-based responses** when OpenAI API is working
- **Enhanced fallback responses** when using keyword search
- **Leadership queries** should correctly handle "shavji" misspelling
- **Sustainability queries** should mention specific initiatives
- **Diamond education** should explain 4Cs properly

## Testing Tips

1. **Start with health check** to ensure server is running
2. **Test both endpoints**: `/api/chat/openai` and `/api/chat`
3. **Verify responses contain specific details** from the website
4. **Check that misspellings** (like "shavji") are handled correctly
5. **Ensure fallback responses** work when OpenAI API is unavailable

## Example Postman Request

```bash
# Health Check
curl -X GET http://localhost:8080/api/health

# AI Chat Request
curl -X POST http://localhost:8080/api/chat/openai \
  -H "Content-Type: application/json" \
  -d '{"message": "What are your sustainability initiatives?"}'

# Fixed Response Request
curl -X GET "http://localhost:8080/api/fixed?key=sustainability"

# Combined Chat Request
curl -X POST http://localhost:8080/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about diamond 4Cs"}'
```

This test suite will help you verify that all scraped pages are working correctly and the AI responses are accurate.
