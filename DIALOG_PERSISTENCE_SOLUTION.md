# Dialog Content Persistence & Token Refresh Improvements

## Overview
This implementation addresses two key issues:
1. **Content Persistence**: User content in dialogs is now preserved even when dialogs close accidentally or due to token refresh
2. **Stable Token Refresh**: Token refresh no longer causes application-wide re-renders that close dialogs

## 1. Content Persistence Solution

### Draft Persistence Manager
- **File**: `src/hooks/useDraftPersistence.ts`
- **Purpose**: Automatically saves and restores user content in forms/dialogs
- **Features**:
  - Saves drafts to localStorage with automatic expiry (7 days)
  - Debounced saving (500ms) to avoid excessive writes
  - Unique keys per dialog/content type
  - Visual indicators when drafts are restored
  - Manual draft clearing capabilities

### Implementation Details

#### Key Components Updated:
1. **NewRuminationDialog**: 
   - Uses draft key: `'new-rumination'`
   - Shows blue indicator when draft is restored
   - Clears draft only on successful submission

2. **EditRuminationDialog**: 
   - Uses draft key: `'edit-rumination-{id}'` (unique per rumination)
   - Shows amber indicator when content differs from original
   - Allows resetting to original content

3. **EditCommentDialog** (in Comments.tsx):
   - Uses draft key: `'edit-comment-{id}'` (unique per comment)
   - Preserves content across dialog closures

### Usage Pattern:
```typescript
const {
  content,
  setContent,
  selectedAudiences,
  setSelectedAudiences,
  clearDraft,
  hasDraft,
  isDraftRestored
} = useDraftPersistence('unique-key', initialContent, initialAudiences);
```

## 2. Stable Token Refresh Solution

### AuthContext Optimizations
- **File**: `src/AuthContext.tsx`
- **Improvements**:
  - Memoized context value to prevent unnecessary re-renders
  - Stable callback functions using `useCallback`
  - Less aggressive token refresh timing (2 minutes vs 4 minutes)
  - Maintains authentication state during token refresh
  - Prevents loading state changes during refresh

### Dialog State Management
- **File**: `src/contexts/DialogContext.tsx`
- **Purpose**: Centralized dialog state management independent of auth state
- **Benefits**:
  - Dialog states persist across context updates
  - Stable dialog open/close functions
  - Prevents dialogs from closing during token refresh

### Token Manager Improvements
- **File**: `src/utils/tokenManager.ts`
- **Changes**:
  - More precise token validation logic
  - Reduced refresh frequency (60s intervals vs 30s)
  - Proactive refresh only when needed (< 2 minutes to expiry)

## 3. Key Benefits

### For Users:
- **No More Lost Content**: Work is automatically saved and restored
- **Stable Experience**: Dialogs don't close unexpectedly during token refresh
- **Visual Feedback**: Clear indicators when drafts are restored or content differs
- **Recovery Options**: Manual draft clearing and content reset capabilities

### For Developers:
- **Reusable Hook**: `useDraftPersistence` can be used in any form/dialog
- **Stable Context**: AuthContext optimizations reduce unnecessary re-renders
- **Centralized State**: DialogContext provides stable dialog management
- **Configurable**: Draft expiry, debounce timing, and storage keys are configurable

## 4. Technical Implementation

### Draft Storage Structure:
```typescript
interface DraftContent {
  content: string;
  selectedAudiences: UserRelationType[];
  lastModified: number;
}
```

### Storage Keys:
- `'new-rumination'` - New rumination dialog
- `'edit-rumination-{id}'` - Edit rumination dialogs (per rumination)
- `'edit-comment-{id}'` - Edit comment dialogs (per comment)

### Token Refresh Flow:
1. Check token expiry every 60 seconds
2. Refresh proactively when < 2 minutes remain
3. Maintain auth state during refresh process
4. Update token without triggering full re-render
5. Dialogs remain open and content persists

## 5. Error Handling

- **Storage Failures**: Gracefully handles localStorage failures
- **Expired Drafts**: Automatically cleans up drafts older than 7 days
- **Token Refresh Failures**: Proper fallback to logout
- **Network Issues**: Maintains user experience during temporary failures

## 6. Future Enhancements

- **Server-side Draft Sync**: Could sync drafts to server for cross-device access
- **Conflict Resolution**: Handle conflicts when editing same content on multiple devices
- **Draft History**: Maintain multiple draft versions
- **Auto-save Indicators**: Real-time saving status indicators

This implementation provides a robust, user-friendly solution that prevents data loss and maintains a stable user experience during authentication operations.
