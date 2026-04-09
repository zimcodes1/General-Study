# Streak System Documentation

## Overview
The streak system tracks consecutive days of user activity, rewarding consistent engagement. The streak counter increments when a user logs in on consecutive days.

## How It Works

### Fields
- **`User.streak`** (Integer): Number of consecutive days of activity. Default: 0
- **`User.last_active_date`** (DateField): Last date the user was active. Default: None

### Update Logic (in `users/views.py`)

The streak is updated in the **login endpoint** via the `update_user_streak()` function:

```python
def update_user_streak(user):
    """
    Update user's streak based on login activity.
    
    Scenarios:
    1. First login (last_active_date is None) → streak = 1, last_active_date = today
    2. Same day login (last_active_date == today) → no change
    3. Consecutive day login (last_active_date == yesterday) → streak += 1
    4. Broken streak (last_active_date > 1 day ago) → streak = 1
    """
```

### Scenarios

#### Scenario 1: First Login Ever
- **User State Before**: `streak = 0`, `last_active_date = None`
- **Action**: User logs in
- **Result**: `streak = 1`, `last_active_date = today`

#### Scenario 2: Multiple Logins Same Day
- **User State Before**: `streak = 5`, `last_active_date = today`
- **Action**: User logs in again (same day)
- **Result**: No change (`streak = 5`, `last_active_date = today`)

#### Scenario 3: Consecutive Day Login
- **User State Before**: `streak = 5`, `last_active_date = yesterday`
- **Action**: User logs in on new day
- **Result**: `streak = 6`, `last_active_date = today`

#### Scenario 4: Streak Broken (Gap > 1 Day)
- **User State Before**: `streak = 10`, `last_active_date = 3 days ago`
- **Action**: User logs in after skipping days
- **Result**: `streak = 1`, `last_active_date = today` (streak resets)

## Activity Tracking Integration

Other activities (bookmarks, reviews, assessments) **do NOT** increment streak directly. Instead, they update `last_active_date`:

- **Bookmark Added/Removed**: Updates `last_active_date` if different from today
- **Review Submitted**: Updates `last_active_date` if different from today
- **Assessment Completed**: Updates `last_active_date` if different from today

This means:
- Users can engage with activities throughout the day
- Streak only increments once per calendar day at next login
- Streak is maintained by **daily logins**, not individual actions

## API Response

When a user logs in successfully, the response includes updated user data:

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com", 
    "full_name": "User Name",
    "points": 150,
    "streak": 5,
    "last_active_date": "2026-04-09"
  },
  "tokens": {
    "refresh": "...",
    "access": "..."
  }
}
```

## Testing

Run the streak system tests:
```bash
pipenv run python manage.py test users.test_streak -v 2
```

### Test Coverage
- ✅ First login sets streak to 1
- ✅ Same-day logins don't change streak
- ✅ Consecutive-day logins increment streak
- ✅ Broken streaks reset to 1
- ✅ Function returns updated user object

## Future Enhancements

### Suggested Improvements
1. **Streak Reset Threshold**: Currently streak resets after 1 day gap. Could make this configurable.
2. **Frozen Streaks**: Option to "freeze" a streak if user might miss a day (paid feature?)
3. **Leaderboards**: Add global/faculty leaderboards based on current streak
4. **Streak Milestones**: Award bonus points at 7-day, 30-day, 100-day streaks
5. **Notifications**: Send reminder emails before streak breaks
6. **Streak Analytics**: Track best streak, current streak, total login days, etc.

## Database Migrations

Current fields in User model:
- `points` (IntegerField, default=0)
- `streak` (IntegerField, default=0)
- `last_active_date` (DateField, null=True, blank=True)

No additional migrations needed for current implementation.

## Files Modified
- `backend/users/views.py` - Added `update_user_streak()` function and login streak logic
- `backend/activity/signals.py` - Simplified to only update `last_active_date` in activity signals
- `backend/users/test_streak.py` - Comprehensive test cases (new file)
