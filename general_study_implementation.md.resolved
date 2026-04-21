# General Study — AI-Powered Academic Resource Sharing Platform
### Exhaustive Implementation Explanation for Class Presentation

---

## 1. Project Idea

**General Study** is a full-stack web platform designed to solve a common problem among university students: the isolation of academic materials and the difficulty of studying them effectively.

### The Problem

Students upload textbooks, lecture notes, and past papers to group chats where they are quickly forgotten. There is no structured way to study from them, track progress, or measure understanding.

### The Solution

General Study provides:
1. A **community resource library** where students upload academic files (PDFs, slides, docs).
2. An **AI engine** that automatically reads each uploaded file and generates a structured *Learning Catalogue* — a personalized, topic-by-topic study plan with summaries and quiz questions.
3. A **learning session system** that guides students through topics one at a time and tracks their progress.
4. A **quiz and assessment system** to test understanding after each topic.
5. A **gamification layer** (points + daily streaks) to incentivise consistent study.
6. An **admin moderation system** so staff can approve resources before they are visible to all users.

The core differentiator is the **AI pipeline**: a student uploads a file → the system automatically processes it in the background using a Large Language Model (LLM) → a full structured catalogue is ready in minutes.

---

## 2. Technology Stack

| Layer | Technology | What It Is |
|---|---|---|
| Backend Framework | **Django** | A high-level Python web framework that provides URL routing, an ORM (Object-Relational Mapper), and the admin panel |
| REST API | **Django REST Framework (DRF)** | An extension for Django that makes it easy to build RESTful JSON APIs |
| Authentication | **JWT (djangorestframework-simplejwt)** | JSON Web Tokens — a standard for stateless, signed authentication tokens |
| Database | **SQLite (development)** | A file-based relational database included with Python; no server required |
| Async Task Queue | **Celery** | A distributed task queue for running long processes (like AI calls) in the background without blocking the HTTP response |
| Message Broker | **Redis** | An in-memory data store used by Celery as a broker to pass task messages between the web server and background workers |
| AI / LLM | **Groq API (LLaMA 3.1 70B)** | A cloud LLM inference API; Groq provides ultra-fast hardware for running Meta's LLaMA large language model |
| Frontend Framework | **React + TypeScript** | React is a JavaScript UI library; TypeScript adds static typing to catch errors at compile time |
| Build Tool | **Vite** | A fast frontend build tool and development server for React projects |
| Routing | **React Router DOM** | Client-side routing library that renders different React components based on the URL without page reloads |
| Icons | **Lucide React** | A clean, tree-shakeable icon library for React |
| Styling | **CSS + Tailwind-style utility classes** | Custom CSS design tokens used via utility class names in JSX |

### Key Terminology Definitions

| Term | Definition |
|---|---|
| **API** | Application Programming Interface — a set of defined rules for how software components communicate. Here, the frontend sends HTTP requests to the Django API and receives JSON responses. |
| **REST** | Representational State Transfer — an architectural style for APIs using standard HTTP verbs: GET, POST, PUT, DELETE. |
| **ORM** | Object-Relational Mapper — Django's way of representing database tables as Python classes ([models.py](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/models.py)), so you write Python instead of raw SQL. |
| **JWT** | JSON Web Token — a compact, URL-safe token that encodes user identity. The client sends it in the `Authorization: Bearer <token>` header on every request. |
| **Access Token** | A short-lived JWT (e.g. 5–15 mins) used to authenticate API requests. |
| **Refresh Token** | A long-lived JWT used to get a new access token when the old one expires, without requiring re-login. |
| **Serializer** | A DRF class that converts Python model instances  to/from JSON, validating data in both directions. |
| **ViewSet** | A DRF class that bundles multiple API actions (list, retrieve, create, update, destroy) into a single class. |
| **Celery Task** | A Python function decorated with `@shared_task` that runs asynchronously outside the HTTP request/response cycle. |
| **Broker** | The intermediary (Redis here) that holds task messages until a Celery worker picks them up. |
| **LLM** | Large Language Model — a deep learning model (like LLaMA 3.1) trained on vast text data; used here to read study material and generate structured content. |
| **Prompt Engineering** | The craft of writing precise instructions (prompts) to an LLM to get reliably structured outputs (in this case, valid JSON). |
| **UUID** | Universally Unique Identifier — a 128-bit random ID used as the primary key for all models to prevent enumeration attacks. |
| **FK / ForeignKey** | A database relationship where one row references a row in another table (e.g., a Resource belongs to a User). |
| **OneToOneField** | A FK that enforces uniqueness — each Resource can have at most one Catalogue. |
| **JSONField** | A Django field that stores arbitrary JSON data natively in the database. Used for quiz questions, course lists, and AI-generated content. |
| **Protected Route** | A React component that redirects unauthenticated users to `/login` before rendering the target page. |
| **SPA** | Single Page Application — the entire app runs in one HTML page; React Router swaps components without browser page reloads. |
| **`localStorage`** | Browser storage used to persist JWT tokens and the user object across page refreshes. |

---

## 3. Backend Architecture

The backend is a Django project with eight distinct Django **apps**, each responsible for a specific domain:

```
backend/
├── users/          ← Authentication, user profiles, admin user management
├── resources/      ← File uploads, bookmarks, reviews, reports
├── catalogues/     ← AI-generated learning catalogues, topics, quizzes, progress
├── processing/     ← Async Celery pipeline: text extraction → Groq AI → catalogue creation
├── assessments/    ← Full quiz/exam sessions linked to resources
├── gamification/   ← Points and streaks leaderboard data
├── activity/       ← User action log (uploads, bookmarks, completions)
└── progress/       ← General progress records synced from catalogue progress
```

---

## 4. Feature-by-Feature Implementation

---

### 4.1 Authentication & User Management (`users` app)

#### 4.1.1 Custom User Model

Django ships with a built-in [User](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/models.py#21-63) model, but it uses a username + password system. The project **replaced it entirely** with a custom model extending `AbstractBaseUser` and `PermissionsMixin`.

**Key design decisions:**
- **Email as username** — `USERNAME_FIELD = 'email'` so users log in with their email address, not a username.
- **UUID primary key** — `id = models.UUIDField(primary_key=True, default=uuid.uuid4)` ensures IDs are non-sequential and safe to expose in URLs.
- **Embedded gamification fields** — `points` and [streak](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/views.py#17-52) live directly on the User model for fast access.
- **Academic profile** — `faculty`, [department](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/views.py#121-131), `degree_level`, `current_level`, and `courses` (stored as a `JSONField` list) allow content to be filtered by the student's academic context.

```python
class User(AbstractBaseUser, PermissionsMixin):
    id             = UUIDField(primary_key=True, default=uuid.uuid4)
    email          = EmailField(unique=True)          # Used as login
    full_name      = CharField(max_length=255)
    faculty        = ForeignKey(Faculty, ...)
    department     = ForeignKey(Department, ...)
    degree_level   = CharField(choices=[...])         # undergraduate / graduate / postgraduate
    current_level  = CharField(choices=['100'..'600'])
    courses        = JSONField(default=list)          # list of course codes
    points         = IntegerField(default=0)          # gamification
    streak         = IntegerField(default=0)          # gamification
    last_active_date = DateField()                    # for streak tracking
```

**[UserManager](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/models.py#6-20)** — The custom manager overrides [create_user](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/models.py#7-15) (hashes the password via `set_password()`) and [create_superuser](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/models.py#16-20).

#### 4.1.2 Faculty & Department Models ([faculty_models.py](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/faculty_models.py))

The [Faculty](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/serializers.py#5-9) and [Department](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/serializers.py#10-17) models form a two-level academic hierarchy. During registration, the user selects a faculty first, then a department filtered to that faculty. The serializer resolves UUIDs into full faculty/department objects.

#### 4.1.3 Registration (`POST /api/auth/register`)

1. Request body: `{ email, password, full_name, faculty_id, department_id, degree_level, current_level }`.
2. `UserRegistrationSerializer.create()` pops the IDs, fetches the [Faculty](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/serializers.py#5-9) and [Department](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/serializers.py#10-17) objects, then calls `User.objects.create_user(...)` which hashes the password.
3. A **JWT refresh + access token pair** is generated immediately, so the user is logged in on sign-up without a second request.

```python
refresh = RefreshToken.for_user(user)
return Response({
    'user': UserSerializer(user).data,
    'tokens': {
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }
}, status=201)
```

#### 4.1.4 Login & Streak Update (`POST /api/auth/login`)

1. Django's `authenticate()` verifies the email/password pair.
2. **Streak logic** runs on every successful login via [update_user_streak(user)](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/views.py#17-52):
   - If `last_active_date` is `None` → first login, streak = 1.
   - If `last_active_date` is yesterday → consecutive day, streak +=1.
   - If `last_active_date` > 1 day ago → streak broken, reset to 1.
   - If `last_active_date` is today → already counted, no change.
3. A new JWT pair is returned.

#### 4.1.5 Protected Routes on the Frontend

[ProtectedRoute](file:///home/azimeh/Desktop/Code/General%20Study/frontend/src/components/ProtectedRoute.tsx#9-23) is a React component that wraps every private page:

```tsx
export default function ProtectedRoute({ children, adminOnly = false }) {
  if (!auth.isAuthenticated()) return <Navigate to="/login" replace />;
  if (adminOnly) {
    const user = auth.getUser();
    if (!user || !user.is_staff) return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}
```

The `auth` utility reads the stored token from `localStorage` and checks its expiry. All admin pages are wrapped with `<ProtectedRoute adminOnly>`, which additionally verifies `user.is_staff`.

#### 4.1.6 API Token Persistence

The [auth/storage.ts](file:///home/azimeh/Desktop/Code/General%20Study/frontend/src/utils/auth/storage.ts) module stores both the access token and refresh token plus the full user object in `localStorage`. The [auth/api.ts](file:///home/azimeh/Desktop/Code/General%20Study/frontend/src/utils/auth/api.ts) module attaches the access token to every outbound API request via an `Authorization: Bearer <token>` header.

---

### 4.2 Resource Upload & Management ([resources](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/views.py#164-201) app)

#### 4.2.1 Resource Model

```python
class Resource(models.Model):
    id          = UUIDField(primary_key=True)
    title       = CharField(max_length=255)
    course_code = CharField(max_length=50)
    course_name = CharField(max_length=255)
    faculty     = ForeignKey(Faculty, ...)
    department  = ForeignKey(Department, ...)
    level       = CharField(max_length=3)            # '100', '200', etc.
    file        = FileField(upload_to=resource_upload_path)  # actual file
    file_type   = CharField(choices=[pdf, doc, ppt, ...])
    uploaded_by = ForeignKey(User, ...)
    status      = CharField(choices=[processing, pending, approved, rejected, failed])
    raw_text    = TextField()                        # extracted text, stored for AI
    rating_avg  = FloatField(default=0.0)
    rating_count = IntegerField(default=0)
```

**Status lifecycle:** `processing` → `pending` (after AI pipeline) → `approved` (admin) or `rejected`.

**[resource_upload_path](file:///home/azimeh/Desktop/Code/General%20Study/backend/resources/models.py#10-15)**: A function that generates a structured path `resources/{year}/{month}/{day}/{uuid}.ext` so files are never overwritten.

#### 4.2.2 File Upload Flow ([ResourceViewSet](file:///home/azimeh/Desktop/Code/General%20Study/backend/resources/views.py#27-360))

- The ViewSet uses `MultiPartParser` and `FormParser` to handle `multipart/form-data` (binary file + form fields).
- [perform_create()](file:///home/azimeh/Desktop/Code/General%20Study/backend/resources/views.py#84-101) saves the resource to the database, then immediately calls:
  ```python
  process_resource_upload.delay(str(resource.id))
  ```
  The `.delay()` call dispatches the task to Celery **asynchronously** — the HTTP response returns immediately with `202 Accepted` while processing continues in the background.

#### 4.2.3 Role-Based Visibility

In [get_queryset()](file:///home/azimeh/Desktop/Code/General%20Study/backend/resources/views.py#44-61), the view applies role-based filtering:
- **Admin (is_staff):** sees ALL resources regardless of status.
- **Regular user:** sees `status='approved'` resources OR their own resources (any status).

#### 4.2.4 Bookmarks

[Bookmark](file:///home/azimeh/Desktop/Code/General%20Study/backend/resources/models.py#97-110) is a junction model linking `User ↔ Resource`. The [bookmark](file:///home/azimeh/Desktop/Code/General%20Study/backend/resources/views.py#252-306) action handles both `POST` (add) and `DELETE` (remove) on the same URL (`/api/resources/{id}/bookmark/`), distinguished by the HTTP method. `get_or_create()` ensures no duplicate bookmarks.

#### 4.2.5 Reviews & Ratings

[Review](file:///home/azimeh/Desktop/Code/General%20Study/backend/resources/models.py#80-96) stores a 1–5 star rating per user per resource. The `unique_together` constraint on `['user', 'resource']` prevents multiple reviews. After each review is saved or updated, the resource's `rating_avg` and `rating_count` are recomputed using Django's `Avg` and `Count` aggregates.

#### 4.2.6 Reports

[Report](file:///home/azimeh/Desktop/Code/General%20Study/backend/resources/models.py#112-132) allows users to flag inappropriate resources. It links to the resource and stores an open/dismissed/resolved status. The admin moderation view queries open reports.

---

### 4.3 AI Processing Pipeline (`processing` app)

This is the most technically complex part of the system. When a file is uploaded, a three-stage Celery pipeline fires automatically:

#### Stage 1 — Text Extraction ([extract_text_from_resource](file:///home/azimeh/Desktop/Code/General%20Study/backend/processing/tasks.py#41-88))
- The Celery task opens the file from disk using [file_extractors.py](file:///home/azimeh/Desktop/Code/General%20Study/backend/processing/file_extractors.py).
- Text is extracted using format-appropriate libraries (e.g., `PyPDF2` for PDFs).
- The extracted `raw_text` is saved back to the [Resource](file:///home/azimeh/Desktop/Code/General%20Study/backend/resources/models.py#16-79) record.

#### Stage 2 — Chunking & Groq AI ([chunk_and_process_with_groq](file:///home/azimeh/Desktop/Code/General%20Study/backend/processing/tasks.py#90-137))

Long academic documents exceed the LLM's token limit, so the text is split into **3,000-character chunks**:

```python
chunks = [text[i : i + max_chars] for i in range(0, len(text), max_chars)]
```

Each chunk is sent to the Groq API with a carefully engineered prompt:

```
Analyze the following study material and extract structured learning content.

Return ONLY a valid JSON object:
{
  "subtopics": ["Topic 1", "Topic 2"],
  "summaries": ["Summary 1", "Summary 2"],
  "quiz_questions": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "answer": "Option A",
      "explanation": "..."
    }
  ]
}

RULES:
- Extract 2-4 main subtopics from the text
- Generate 1-2 multiple choice questions
- Return ONLY JSON. No extra text.
```

The [GroqService](file:///home/azimeh/Desktop/Code/General%20Study/backend/processing/groq_service.py#19-219) class:
- Initialises the Groq client with `GROQ_API_KEY` from Django settings.
- Uses model `llama-3.1-70b-versatile` (configurable via `GROQ_MODEL` setting).
- Sets `temperature=0.3` (lower = more deterministic, less creative output — good for factual content).
- Parses and **validates** the JSON response, stripping any markdown code fences the LLM may accidentally include.
- Results from all chunks are merged together into a single combined dictionary.

#### Stage 3 — Catalogue Creation ([create_catalogue](file:///home/azimeh/Desktop/Code/General%20Study/backend/resources/views.py#195-251))

1. **Validation:** The merged Groq data is validated against expected structure.
2. A [Catalogue](file:///home/azimeh/Desktop/Code/General%20Study/backend/catalogues/models.py#6-22) object is created, linked to the resource via `OneToOneField`.
3. [_populate_topics_from_groq()](file:///home/azimeh/Desktop/Code/General%20Study/backend/processing/tasks.py#430-473) iterates the subtopics list and creates individual [Topic](file:///home/azimeh/Desktop/Code/General%20Study/backend/catalogues/models.py#24-43) rows. Quiz questions are distributed across topics proportionally.
4. The resource status is updated to `pending` — signalling the admin to review.
5. The system sends an **email notification** to the admin (`send_mail`).

#### Master Orchestrator ([process_resource_upload](file:///home/azimeh/Desktop/Code/General%20Study/backend/processing/tasks.py#259-338))

A single top-level Celery task calls all three stages in sequence. If any stage fails, the resource status is set to `failed` and a failure email is sent to the admin.

```
process_resource_upload
   ├── extract_text_from_resource(resource_id)
   ├── chunk_and_process_with_groq(resource_id)
   └── create_catalogue(resource_id, groq_result)
```

---

### 4.4 Catalogue & Learning Session (`catalogues` app)

#### 4.4.1 Data Models

| Model | Purpose |
|---|---|
| [Catalogue](file:///home/azimeh/Desktop/Code/General%20Study/backend/catalogues/models.py#6-22) | Top-level container; 1:1 with Resource; stores full `content_json` + summary |
| [Topic](file:///home/azimeh/Desktop/Code/General%20Study/backend/catalogues/models.py#24-43) | A single study topic inside a catalogue; has a title, content, summary, and `order` field |
| [QuizQuestion](file:///home/azimeh/Desktop/Code/General%20Study/backend/catalogues/models.py#45-63) | MCQ linked to a Topic; stores question, 4 options (JSONField), correct answer text, and explanation |
| [CatalogueProgress](file:///home/azimeh/Desktop/Code/General%20Study/backend/catalogues/models.py#65-86) | Per-user per-catalogue progress; tracks `completed_topics` (list of UUIDs), `current_topic_index`, `points_earned`, `completion_percent` |
| [TopicQuizAttempt](file:///home/azimeh/Desktop/Code/General%20Study/backend/catalogues/models.py#88-107) | Records each time a user submits a quiz for a topic; stores answers, score, and points earned |

#### 4.4.2 Learning Session Flow

When a user opens a catalogue (`GET /api/catalogues/{id}/`):
1. [CatalogueProgress](file:///home/azimeh/Desktop/Code/General%20Study/backend/catalogues/models.py#65-86) is fetched or created (`get_or_create`) for that user.
2. The `last_accessed_at` timestamp is updated.
3. The catalogue data + user progress are returned in one response.

The user reads through topics one by one. After each topic, they can:
- **Complete the topic** (`POST /api/catalogues/progress/complete_topic/`) — marks it done without a quiz.
- **Submit a quiz** (`POST /api/catalogues/progress/submit_quiz/`) — the server grades the submission:
  1. Fetches all [QuizQuestion](file:///home/azimeh/Desktop/Code/General%20Study/backend/catalogues/models.py#45-63) objects for the topic.
  2. Compares each user answer (case-insensitive string match) with `correct_answer`.
  3. Awards **5 points per correct answer**.
  4. Creates a [TopicQuizAttempt](file:///home/azimeh/Desktop/Code/General%20Study/backend/catalogues/models.py#88-107) record.
  5. Updates [CatalogueProgress](file:///home/azimeh/Desktop/Code/General%20Study/backend/catalogues/models.py#65-86): adds the topic to `completed_topics`, recalculates `completion_percent`.
  6. Adds points to the user's profile (`user.points += points_earned`).
  7. **Syncs** to the general [Progress](file:///home/azimeh/Desktop/Code/General%20Study/backend/catalogues/models.py#65-86) model (used by the dashboard for aggregate stats).
  8. Sets `completed_at` if `completion_percent == 100`.

#### 4.4.3 Catalogue Rating

Users can rate a catalogue 1—5 stars. The rating is stored as a [Review](file:///home/azimeh/Desktop/Code/General%20Study/backend/resources/models.py#80-96) on the underlying [Resource](file:///home/azimeh/Desktop/Code/General%20Study/backend/resources/models.py#16-79), and `rating_avg` / `rating_count` are recomputed using database aggregation after each rating.

---

### 4.5 Dashboard Statistics (`users` views)

The [dashboard_stats](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/views.py#132-163) endpoint aggregates real-time stats for the logged-in user:

```python
active_catalogues = Progress.objects.filter(user=user, completion_percent__lt=100).count()
completed_count   = Progress.objects.filter(user=user, completion_percent__gte=100).count()
avg_score         = Progress.objects.filter(user=user).aggregate(avg_score=Avg('score'))
total_points      = user.points
```

These four numbers drive the stat cards shown on the frontend Dashboard page.

#### Recommended Resources

The [recommended_resources](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/views.py#164-201) endpoint returns approved resources from the user's own faculty with a rating of 4.0 or higher, ordered by rating descending. If the user has no faculty set, it returns the top-rated resources globally. Supports `limit` and `offset` query parameters for pagination.

---

### 4.6 Assessments (`assessments` app)

[Assessment](file:///home/azimeh/Desktop/Code/General%20Study/backend/assessments/models.py#6-31) is a separate, standalone quiz/exam linked directly to a [Resource](file:///home/azimeh/Desktop/Code/General%20Study/backend/resources/models.py#16-79) (not a catalogue topic). It has a `type` field ([quiz](file:///home/azimeh/Desktop/Code/General%20Study/backend/catalogues/views.py#163-280) or `exam`), and stores the questions as raw JSON (`questions_json`), score, and `completed` flag. This allows for full exam-mode testing on a resource independently of the structured learning catalogue.

---

### 4.7 Gamification (`gamification` app)

[Gamification](file:///home/azimeh/Desktop/Code/General%20Study/backend/gamification/models.py#5-21) is a separate model that mirrors the points and streak stored on the [User](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/models.py#21-63) model, intended as a standalone leaderboard record.

| Mechanism | Implementation |
|---|---|
| **Points on quiz** | `user.points += score * 5` after each quiz submission in [submit_quiz](file:///home/azimeh/Desktop/Code/General%20Study/backend/catalogues/views.py#163-280) |
| **Login streak** | [update_user_streak(user)](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/views.py#17-52) called on every successful login; compares `last_active_date` with today via Python [date](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/serializers.py#62-76) arithmetic |
| **Streak reset** | If the user skips a day, [streak](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/views.py#17-52) resets to 1 on next login |

---

### 4.8 Activity Logging (`activity` app)

[UserAction](file:///home/azimeh/Desktop/Code/General%20Study/backend/activity/models.py#7-46) is an append-only audit log. Each row records:
- [user](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/models.py#7-15) — who performed the action
- `action_type` — one of: [resource_upload](file:///home/azimeh/Desktop/Code/General%20Study/backend/resources/models.py#10-15), `resource_approved`, `bookmark_add`, `bookmark_remove`, `assessment_start`, `assessment_complete`, `catalogue_complete`
- [resource](file:///home/azimeh/Desktop/Code/General%20Study/backend/resources/models.py#10-15) — the resource involved (nullable)
- `metadata` — a flexible JSON blob for extra context

Database indexes on [(user, -created_at)](file:///home/azimeh/Desktop/Code/General%20Study/frontend/src/App.tsx#22-61) and [(action_type, -created_at)](file:///home/azimeh/Desktop/Code/General%20Study/frontend/src/App.tsx#22-61) ensure fast lookups for both user history and admin analytics.

---

### 4.9 Admin System

The admin system is built entirely **without** Django's built-in admin UI — it is a set of custom API endpoints consumed by React pages.

#### Backend Admin Endpoints

| Endpoint | Method | What It Does |
|---|---|---|
| `/api/users/admin/users/` | GET | Paginated user list; filterable by name/email/status |
| `/api/users/admin/users/{id}/disable/` | POST | Sets `user.is_active = False` |
| `/api/users/admin/users/{id}/enable/` | POST | Sets `user.is_active = True` |
| `/api/users/admin/analytics/` | GET | Total users, active last 30 days, weekly signup chart (8 weeks), degree level breakdown |
| `/api/resources/{id}/approve/` | POST | Sets `resource.status = 'approved'` |
| `/api/resources/{id}/reject/` | POST | Sets `resource.status = 'rejected'`, stores rejection reason |
| Admin reports endpoints | GET/POST | List, dismiss, resolve Reports |

All admin endpoints call [_require_staff(request)](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/views.py#207-211) which checks `request.user.is_staff` and returns `403 Forbidden` if the caller is not an admin.

#### Admin Analytics

[admin_user_analytics](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/views.py#302-349) builds a weekly signup chart by iterating over the last 8 weeks:
```python
for i in range(7, -1, -1):
    ws = now - timedelta(weeks=i + 1)
    we = now - timedelta(weeks=i)
    count = User.objects.filter(created_at__gte=ws, created_at__lt=we).count()
    weekly_signups.append({'week': ws.strftime('%-d %b'), 'count': count})
```

The frontend renders this as a custom SVG bar/line chart. No third-party chart library is used.

#### Frontend Admin Pages

| Page | Route | Purpose |
|---|---|---|
| [AdminPanel.tsx](file:///home/azimeh/Desktop/Code/General%20Study/frontend/src/pages/AdminPanel.tsx) | `/admin` | Overview with aggregate stats (users, resources, reports, pending items) |
| [AdminUsers.tsx](file:///home/azimeh/Desktop/Code/General%20Study/frontend/src/pages/AdminUsers.tsx) | `/admin/users` | Paginated user table; enable/disable; live search |
| [AdminResources.tsx](file:///home/azimeh/Desktop/Code/General%20Study/frontend/src/pages/AdminResources.tsx) | `/admin/resources` | List all resources; approve / reject with reason |
| [AdminReports.tsx](file:///home/azimeh/Desktop/Code/General%20Study/frontend/src/pages/AdminReports.tsx) | `/admin/reports` | List flagged resource reports; dismiss / resolve |

---

### 4.10 Frontend Architecture

#### Application Entry Point

[main.tsx](file:///home/azimeh/Desktop/Code/General%20Study/frontend/src/main.tsx) renders the root `<App />` component into the DOM. [App.tsx](file:///home/azimeh/Desktop/Code/General%20Study/frontend/src/App.tsx) wraps everything in `<BrowserRouter>` and defines all `<Route>` entries.

A 1.5-second **preloader** ([Preloader.tsx](file:///home/azimeh/Desktop/Code/General%20Study/frontend/src/components/Preloader.tsx)) is shown on first render while the app initialises, then the `loading` state is cleared and the routes take effect.

#### Routing Table

```
/login              → Login.tsx           (public)
/signup             → Signup.tsx          (public)
/dashboard          → Dashboard.tsx       (protected)
/resources          → Resources.tsx       (protected)
/catalogues         → MyCatalogues.tsx    (protected)
/catalogue/:id      → CatalogueOverview   (protected)
/catalogue/:id/quiz → CatalogueQuiz       (protected)
/learn/:catalogueId/:topicId → LearningSession (protected)
/assessment/:catalogueId/:mode → Assessment  (protected)
/profile            → Profile.tsx         (protected)
/settings           → Settings.tsx        (protected)
/admin              → AdminPanel          (protected + adminOnly)
/admin/users        → AdminUsers          (protected + adminOnly)
/admin/resources    → AdminResources      (protected + adminOnly)
/admin/reports      → AdminReports        (protected + adminOnly)
```

#### Sidebar Navigation

[Sidebar.tsx](file:///home/azimeh/Desktop/Code/General%20Study/frontend/src/components/dashboard/Sidebar.tsx) reads `user.is_staff` from `localStorage` via `auth.getUser()` and conditionally renders the **Admin Panel** nav item. On mobile, it overlays the screen and closes on backdrop tap. Use of `useLocation()` from React Router enables active-link highlighting without extra state.

#### State Management

The project uses **React local state** (`useState`) and **side effects** (`useEffect`) per page — no global state library (Redux/Zustand) is used. Data fetching is done with `fetch()` calls in `useEffect` hooks, attaching the token from `auth.getToken()`.

---

## 5. Full End-to-End Data Flow

```
┌──────────┐    1. POST /api/resources/upload (multipart)
│  Student │ ──────────────────────────────────────────► Django ResourceViewSet
│ (Browser)│                                             • Saves Resource (status=processing)
└──────────┘                                             • Returns 202 Accepted
                                                         • Calls process_resource_upload.delay()
                                                                   │
                                                     ┌─────────────▼──────────────┐
                                                     │      Celery Worker          │
                                                     │  1. extract_text_from_file  │
                                                     │  2. chunk_text (3000 chars) │
                                                     │  3. Groq API (LLaMA 3.1)   │
                                                     │  4. create Catalogue        │
                                                     │  5. Resource → pending      │
                                                     │  6. Email admin             │
                                                     └────────────────────────────┘

Admin approves resource ──► status = 'approved'

Student opens catalogue ──► GET /api/catalogues/{id}/
                           • get_or_create CatalogueProgress
                           • Returns topics + user progress

Student completes topic ──► POST /api/catalogues/progress/submit_quiz/
                           • Grade answers (5pts / correct)
                           • Update CatalogueProgress
                           • Update user.points
                           • Sync to Progress model

Dashboard ──────────────► GET /api/users/dashboard-stats/
                           • Aggregates from Progress model
                           • Returns: active, completed, avg_score, points
```

---

## 6. Security & Quality Considerations

| Concern | Implementation |
|---|---|
| **Authentication** | All private API endpoints decorated with `@permission_classes([IsAuthenticated])`; JWT signature verified by simplejwt middleware on every request |
| **Authorization** | Admin endpoints check `request.user.is_staff`; users can only see their own data or approved shared resources |
| **Password hashing** | Django's `set_password()` uses PBKDF2-SHA256 — passwords are never stored in plain text |
| **File validation** | [validators.py](file:///home/azimeh/Desktop/Code/General%20Study/backend/processing/validators.py) checks file types before processing; [resource_upload_path](file:///home/azimeh/Desktop/Code/General%20Study/backend/resources/models.py#10-15) generates UUID-based filenames to prevent path traversal |
| **UUID primary keys** | Prevents sequential ID enumeration attacks |
| **AI response validation** | `GroqService._parse_response()` and `validate_groq_response()` strictly validate the JSON structure before persisting to the database |
| **Frontend route guarding** | [ProtectedRoute](file:///home/azimeh/Desktop/Code/General%20Study/frontend/src/components/ProtectedRoute.tsx#9-23) and `adminOnly` prop prevent unauthorized page access client-side, backed by server-side enforcement |
| **Unique constraints** | `unique_together` on Review and Bookmark prevents duplicate entries; `OneToOneField` on Catalogue ensures one catalogue per resource |
| **Pagination** | All list endpoints return `count`, `limit`, and `offset` — never load unbounded recordsets |

---

## 7. Summary Table of All Models

| Model | App | Key Fields |
|---|---|---|
| [User](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/models.py#21-63) | users | id (UUID), email, faculty FK, department FK, points, streak, is_staff |
| [Faculty](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/serializers.py#5-9) | users | id, name |
| [Department](file:///home/azimeh/Desktop/Code/General%20Study/backend/users/serializers.py#10-17) | users | id, name, faculty FK |
| [Resource](file:///home/azimeh/Desktop/Code/General%20Study/backend/resources/models.py#16-79) | resources | id, title, course_code, file, status, raw_text, rating_avg |
| [Review](file:///home/azimeh/Desktop/Code/General%20Study/backend/resources/models.py#80-96) | resources | user FK, resource FK, rating (1-5), comment |
| [Bookmark](file:///home/azimeh/Desktop/Code/General%20Study/backend/resources/models.py#97-110) | resources | user FK, resource FK |
| [Report](file:///home/azimeh/Desktop/Code/General%20Study/backend/resources/models.py#112-132) | resources | resource FK, reported_by FK, reason, status |
| [Catalogue](file:///home/azimeh/Desktop/Code/General%20Study/backend/catalogues/models.py#6-22) | catalogues | id, resource (1:1), title, content_json, summary |
| [Topic](file:///home/azimeh/Desktop/Code/General%20Study/backend/catalogues/models.py#24-43) | catalogues | catalogue FK, title, content, order |
| [QuizQuestion](file:///home/azimeh/Desktop/Code/General%20Study/backend/catalogues/models.py#45-63) | catalogues | topic FK, question, options (JSON), correct_answer, explanation |
| [CatalogueProgress](file:///home/azimeh/Desktop/Code/General%20Study/backend/catalogues/models.py#65-86) | catalogues | user FK, catalogue FK, completed_topics (JSON), completion_percent |
| [TopicQuizAttempt](file:///home/azimeh/Desktop/Code/General%20Study/backend/catalogues/models.py#88-107) | catalogues | user FK, topic FK, answers (JSON), score, points_earned |
| [Assessment](file:///home/azimeh/Desktop/Code/General%20Study/backend/assessments/models.py#6-31) | assessments | user FK, resource FK, type (quiz/exam), questions_json, score |
| [Gamification](file:///home/azimeh/Desktop/Code/General%20Study/backend/gamification/models.py#5-21) | gamification | user (1:1), total_points, streak, last_activity_date |
| [UserAction](file:///home/azimeh/Desktop/Code/General%20Study/backend/activity/models.py#7-46) | activity | user FK, action_type, resource FK, metadata (JSON) |
| [Progress](file:///home/azimeh/Desktop/Code/General%20Study/backend/catalogues/models.py#65-86) | progress | user FK, catalogue FK, completed_subtopics, completion_percent, score |
