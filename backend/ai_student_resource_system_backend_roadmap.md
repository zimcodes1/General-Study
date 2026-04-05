Here's your **complete backend roadmap + AI integration spec + database design** in a clean Markdown document format 👇

---

# 📄 AI-Based Student Academic Resource Sharing System

## Backend Implementation Roadmap (MVP)

---

# **1. Overview**

This backend system will power:

* Resource sharing
* AI-generated learning catalogues
* Quiz & exam generation
* User progress tracking
* Gamification (points, streaks)

---

# **2. Tech Stack**

```md
Backend Framework: Django + Django REST Framework (DRF)
Authentication: JWT (djangorestframework-simplejwt)
Database: PostgreSQL (or SQLite for MVP)
File Storage: Local / Cloud (AWS S3 optional)
AI Integration: External API (LLM provider)
Task Queue (Optional): Celery + Redis (for async AI processing)
```

---

# **3. Development Phases (Step-by-Step)**

---

## **Phase 1 — Project Setup**

* Initialize Django project

* Install dependencies:

  ```bash
  pip install djangorestframework psycopg2-binary simplejwt
  ```

* Create apps:

  ```
  users
  resources
  catalogues
  assessments
  progress
  gamification
  ```

---

## **Phase 2 — Authentication System**

### Endpoints:

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/update
```

### JWT:

* Access + Refresh tokens
* Protect all private routes

---

## **Phase 3 — Database Schema**

---

## **User Model**

```ts
User {
  id: UUID
  full_name: string
  email: string (unique)
  phone: string
  school: string
  department: string
  level: string (e.g. "100", "200")
  courses: string[] (optional)

  points: int
  streak: int
  last_active_date: date

  created_at: datetime
}
```

---

## **Resource Model**

```ts
Resource {
  id: UUID
  title: string
  course_code: string
  course_name: string
  department: string
  level: string

  file_url: string
  file_type: string
  cover_image: string (optional)

  uploaded_by: FK(User)
  attribution: string (optional)

  status: enum(pending, approved, rejected)

  rating_avg: float
  rating_count: int

  created_at: datetime
}
```

---

## **Review Model**

```ts
Review {
  id: UUID
  user: FK(User)
  resource: FK(Resource)

  rating: int (1–5)
  comment: text

  created_at: datetime
}
```

---

## **Catalogue Model**

```ts
Catalogue {
  id: UUID
  resource: FK(Resource)

  title: string
  content_json: JSON
  summary: text

  created_at: datetime
}
```

---

## **Progress Model**

```ts
Progress {
  id: UUID
  user: FK(User)
  catalogue: FK(Catalogue)

  completed_subtopics: string[]
  current_index: int

  score: int
  completion_percent: float

  updated_at: datetime
}
```

---

## **Assessment Model**

```ts
Assessment {
  id: UUID
  user: FK(User)
  resource: FK(Resource)

  type: enum(quiz, exam)
  questions_json: JSON

  score: int
  completed: boolean

  created_at: datetime
}
```

---

## **Gamification Model**

```ts
Gamification {
  user: FK(User)

  total_points: int
  streak: int
  last_activity_date: date
}
```

---

# **4. Resource System**

### Endpoints:

```http
GET  /api/resources
GET  /api/resources/:id
POST /api/resources/upload
POST /api/resources/:id/rate
POST /api/resources/:id/bookmark
```

---

# **5. Catalogue System**

---

## **AI Generation Strategy**

### Hybrid Approach:

* Generate catalogue **on upload**
* Store result in DB

---

## **Endpoint**

```http
POST /api/catalogue/generate/:resourceId
GET  /api/catalogue/:resourceId
```

---

## **AI Prompt (Catalogue Generation)**

```txt
You are an academic assistant.

Analyze the provided study material and generate a structured learning catalogue.

Return ONLY valid JSON in this schema:

{
  "title": "...",
  "topics": [
    {
      "name": "...",
      "subtopics": [
        {
          "title": "...",
          "content": "...",
          "quiz": [
            {
              "question": "...",
              "options": ["A", "B", "C", "D"],
              "answer": "A"
            }
          ]
        }
      ]
    }
  ]
}

Rules:
- Keep content clear and concise
- Use structured paragraphs
- Include 1–2 quiz questions per subtopic
- Do NOT return text outside JSON
```

---

## **Storage**

* Store full JSON in `content_json`
* Store summary separately

---

## **Formatting Rules**

### Content Formatting:

* Use plain text with line breaks (`\n`)
* Frontend parses into:

  * Headings → `<h2>`
  * Paragraphs → `<p>`
* Optional: store markdown

---

# **6. Learning Session (Progress Tracking)**

### Endpoints:

```http
GET  /api/progress/:catalogueId
POST /api/progress/update
```

---

# **7. Quiz & Exam System**

---

## **Endpoints**

```http
POST /api/assessment/generate
POST /api/assessment/submit
GET  /api/assessment/:id
```

---

## **AI Prompt (Quiz/Exam)**

```txt
Generate a set of multiple-choice questions based on the provided content.

Return ONLY JSON:

{
  "questions": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "B",
      "explanation": "..."
    }
  ]
}

Rules:
- Ensure correctness
- Avoid ambiguity
- Cover key concepts
- No extra text outside JSON
```

---

## **Storage Strategy**

* Do NOT store all generated exams (optional)
* Store only:

  * Completed attempts
  * Scores

---

# **8. Gamification System**

---

## Logic:

### Points:

* +10 per quiz completion
* +X per correct answer

### Streak:

* Increase if user is active daily
* Reset after inactivity

---

## Endpoint:

```http
POST /api/gamification/update
GET  /api/gamification
```

---

# **9. Recommendations**

---

## Simple Logic (MVP):

* Filter resources by:

  * Department
  * Level
  * Courses

---

## Endpoint:

```http
GET /api/resources/recommended
```

---

# **10. Admin System**

---

## Capabilities:

* Approve resources
* Remove content
* Handle reports

---

## Endpoints:

```http
POST /api/admin/resource/:id/approve
POST /api/admin/resource/:id/reject
```

---

# **11. Error Handling & Validation**

* Validate AI JSON before saving
* Handle malformed responses
* Fallback: regenerate

---

# **12. Performance Considerations**

* Cache catalogues
* Lazy load large content
* Use pagination for resources

---

# **13. Security**

* JWT authentication
* File validation (uploads)
* Rate limit AI calls

---

# **14. Final System Flow**

```md
User uploads resource
→ AI generates catalogue (stored)
→ User opens catalogue overview
→ User enters learning session
→ Progress tracked
→ User takes quiz/exam
→ Score stored
→ Points & streak updated
```

---

# **🚀 Final Note**

This architecture ensures:

* Scalable backend
* Stable AI integration
* Clean frontend consumption
* MVP-ready delivery
