# Phase 3 - Database Models Implementation

## Overview
All models from Phase 3 of the roadmap have been created with enhanced features and proper relationships.

## Models Created

### 1. Resource Model (`resources/models.py`)
Stores uploaded academic resources.

**Key Features:**
- Belongs to a **Faculty** (required)
- Can belong to a **Department** (optional - for general faculty resources)
- Status workflow: pending → approved/rejected
- Rating system (avg + count)
- File type support: PDF, Document, Video, Audio, Other

**Fields:**
- `id` - UUID primary key
- `title` - Resource title
- `course_code` - Course code (e.g., CSC 301)
- `course_name` - Full course name
- `faculty` - FK to Faculty (required)
- `department` - FK to Department (optional, null=True)
- `level` - Academic level (100-600)
- `file_url` - URL to stored file
- `file_type` - Type of file
- `cover_image` - Optional cover image URL
- `uploaded_by` - FK to User
- `attribution` - Optional attribution text
- `status` - pending/approved/rejected
- `rating_avg` - Average rating (0.0-5.0)
- `rating_count` - Number of ratings
- `created_at` - Timestamp
- `updated_at` - Timestamp

**Indexes:**
- faculty + status
- department + status
- level + status

---

### 2. Review Model (`resources/models.py`)
User reviews and ratings for resources.

**Fields:**
- `id` - UUID primary key
- `user` - FK to User
- `resource` - FK to Resource
- `rating` - Integer (1-5)
- `comment` - Text (optional)
- `created_at` - Timestamp

**Constraints:**
- Unique together: (user, resource) - one review per user per resource

---

### 3. Bookmark Model (`resources/models.py`)
User bookmarks for quick access.

**Fields:**
- `id` - UUID primary key
- `user` - FK to User
- `resource` - FK to Resource
- `created_at` - Timestamp

**Constraints:**
- Unique together: (user, resource)

---

### 4. Catalogue Model (`catalogues/models.py`)
AI-generated learning catalogues for resources.

**Fields:**
- `id` - UUID primary key
- `resource` - OneToOne to Resource
- `title` - Catalogue title
- `content_json` - JSON field (structured learning content)
- `summary` - Text summary
- `created_at` - Timestamp
- `updated_at` - Timestamp

**JSON Structure:**
```json
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
```

---

### 5. Progress Model (`progress/models.py`)
Tracks user progress through catalogues.

**Fields:**
- `id` - UUID primary key
- `user` - FK to User
- `catalogue` - FK to Catalogue
- `completed_subtopics` - JSON array of completed subtopic IDs
- `current_index` - Current position in catalogue
- `score` - Total score earned
- `completion_percent` - Percentage completed (0.0-100.0)
- `created_at` - Timestamp
- `updated_at` - Timestamp

**Constraints:**
- Unique together: (user, catalogue)

---

### 6. Assessment Model (`assessments/models.py`)
Quizzes and exams taken by users.

**Fields:**
- `id` - UUID primary key
- `user` - FK to User
- `resource` - FK to Resource
- `type` - quiz/exam
- `questions_json` - JSON field (questions and answers)
- `score` - Score achieved
- `total_questions` - Total number of questions
- `completed` - Boolean
- `created_at` - Timestamp
- `completed_at` - Timestamp (nullable)

**JSON Structure:**
```json
{
  "questions": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct_answer": "B",
      "explanation": "...",
      "user_answer": "B"
    }
  ]
}
```

---

### 7. Gamification Model (`gamification/models.py`)
User gamification stats.

**Fields:**
- `id` - UUID primary key
- `user` - OneToOne to User
- `total_points` - Total points earned
- `streak` - Current daily streak
- `last_activity_date` - Last activity date
- `created_at` - Timestamp
- `updated_at` - Timestamp

---

## Key Design Decisions

### 1. Faculty vs Department for Resources
- **Faculty is required** - Every resource must belong to a faculty
- **Department is optional** - Allows for "general" faculty-wide resources
- Example: "Introduction to Science" can be faculty-wide (department=null)
- Example: "Advanced Python" can be department-specific (department=Computer Science)

### 2. OneToOne Relationships
- `Catalogue` → `Resource` (one catalogue per resource)
- `Gamification` → `User` (one gamification record per user)

### 3. Unique Constraints
- User can only review a resource once
- User can only bookmark a resource once
- User has one progress record per catalogue

### 4. JSON Fields
Used for flexible, structured data:
- `content_json` in Catalogue
- `questions_json` in Assessment
- `completed_subtopics` in Progress
- `courses` in User

### 5. Status Workflow
Resources go through approval:
1. User uploads → status = 'pending'
2. Admin reviews → status = 'approved' or 'rejected'
3. Only approved resources are visible to users

---

## Admin Panel Features

All models are registered with comprehensive admin interfaces:
- List displays with relevant fields
- Filters for quick searching
- Search functionality
- Readonly fields for system-generated data
- Organized fieldsets
- Collapsible sections for JSON fields

---

## Next Steps

### 1. Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 2. Create Serializers
- ResourceSerializer
- ReviewSerializer
- CatalogueSerializer
- ProgressSerializer
- AssessmentSerializer
- GamificationSerializer

### 3. Create Views & Endpoints
- Resource CRUD
- Review & Rating
- Bookmark management
- Catalogue generation
- Progress tracking
- Assessment creation & submission
- Gamification updates

### 4. Implement AI Integration
- Catalogue generation from uploaded files
- Quiz/Exam generation

---

## Database Relationships Diagram

```
User
├── uploaded_resources (Resource)
├── reviews (Review)
├── bookmarks (Bookmark)
├── progress (Progress)
├── assessments (Assessment)
└── gamification (Gamification)

Faculty
├── users (User)
├── resources (Resource)
└── departments (Department)

Department
├── users (User)
└── resources (Resource)

Resource
├── reviews (Review)
├── bookmarked_by (Bookmark)
├── catalogue (Catalogue)
└── assessments (Assessment)

Catalogue
└── user_progress (Progress)
```

---

## Model Counts Summary

- **7 Models Created**
- **3 Apps Updated** (resources, catalogues, progress, assessments, gamification)
- **All models registered in admin**
- **Proper indexing for performance**
- **Comprehensive field validation**
