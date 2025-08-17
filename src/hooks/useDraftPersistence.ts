import { useState, useEffect, useCallback } from 'react';
import { UserRelationType } from '../types/rumination';

export interface DraftContent {
  content: string;
  selectedAudiences: UserRelationType[];
  lastModified: number;
}

interface DraftStorage {
  [key: string]: DraftContent;
}

const DRAFT_STORAGE_KEY = 'rumination_drafts';
const DRAFT_EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

class DraftPersistenceManager {
  private static instance: DraftPersistenceManager;

  static getInstance(): DraftPersistenceManager {
    if (!DraftPersistenceManager.instance) {
      DraftPersistenceManager.instance = new DraftPersistenceManager();
    }
    return DraftPersistenceManager.instance;
  }

  private getDrafts(): DraftStorage {
    try {
      const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error('Failed to parse draft storage:', error);
      return {};
    }
  }

  private saveDrafts(drafts: DraftStorage): void {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
    } catch (error) {
      console.error('Failed to save drafts:', error);
    }
  }

  saveDraft(key: string, content: string, selectedAudiences: UserRelationType[]): void {
    if (!content.trim()) {
      this.deleteDraft(key);
      return;
    }

    const drafts = this.getDrafts();
    drafts[key] = {
      content,
      selectedAudiences,
      lastModified: Date.now()
    };
    this.saveDrafts(drafts);
  }

  getDraft(key: string): DraftContent | null {
    const drafts = this.getDrafts();
    const draft = drafts[key];
    
    if (!draft) return null;

    // Check if draft has expired
    if (Date.now() - draft.lastModified > DRAFT_EXPIRY_TIME) {
      this.deleteDraft(key);
      return null;
    }

    return draft;
  }

  deleteDraft(key: string): void {
    const drafts = this.getDrafts();
    delete drafts[key];
    this.saveDrafts(drafts);
  }

  clearExpiredDrafts(): void {
    const drafts = this.getDrafts();
    const now = Date.now();
    let hasChanges = false;

    Object.keys(drafts).forEach(key => {
      if (now - drafts[key].lastModified > DRAFT_EXPIRY_TIME) {
        delete drafts[key];
        hasChanges = true;
      }
    });

    if (hasChanges) {
      this.saveDrafts(drafts);
    }
  }
}

export const draftManager = DraftPersistenceManager.getInstance();

export function useDraftPersistence(
  draftKey: string,
  initialContent: string = '',
  initialAudiences: UserRelationType[] = []
) {
  const [content, setContent] = useState(initialContent);
  const [selectedAudiences, setSelectedAudiences] = useState<UserRelationType[]>(initialAudiences);
  const [isDraftRestored, setIsDraftRestored] = useState(false);

  // Load draft on mount
  useEffect(() => {
    draftManager.clearExpiredDrafts();
    const draft = draftManager.getDraft(draftKey);
    
    if (draft && !isDraftRestored) {
      setContent(draft.content);
      setSelectedAudiences(draft.selectedAudiences);
      setIsDraftRestored(true);
    }
  }, [draftKey, isDraftRestored]);

  // Save draft whenever content or audiences change
  useEffect(() => {
    if (isDraftRestored || content !== initialContent || selectedAudiences.length !== initialAudiences.length) {
      const timeoutId = setTimeout(() => {
        draftManager.saveDraft(draftKey, content, selectedAudiences);
      }, 500); // Debounce saves

      return () => clearTimeout(timeoutId);
    }
  }, [content, selectedAudiences, draftKey, isDraftRestored, initialContent, initialAudiences]);

  const clearDraft = useCallback(() => {
    draftManager.deleteDraft(draftKey);
    setContent(initialContent);
    setSelectedAudiences(initialAudiences);
    setIsDraftRestored(false);
  }, [draftKey, initialContent, initialAudiences]);

  const resetToInitial = useCallback(() => {
    setContent(initialContent);
    setSelectedAudiences(initialAudiences);
    setIsDraftRestored(false);
  }, [initialContent, initialAudiences]);

  const hasDraft = useCallback(() => {
    const draft = draftManager.getDraft(draftKey);
    return !!draft && (draft.content.trim() !== '' || draft.selectedAudiences.length > 0);
  }, [draftKey]);

  return {
    content,
    setContent,
    selectedAudiences,
    setSelectedAudiences,
    clearDraft,
    resetToInitial,
    hasDraft,
    isDraftRestored
  };
}
