// src/lib/api-journal.ts
import { api } from './api';

export interface JournalItem {
  id: number;
  title: string;
  text: string;
  img: string;
  date: string;
  slug?: string;
}

export async function fetchJournal(limit = 4): Promise<JournalItem[]> {
  try {
    const { data } = await api.get('/journal', { params: { limit, published: true } });
    // Backend qaytargan formatga qarab moslashtiring:
    // { items: [...] } yoki [...] yoki { data: [...] }
    return data.items || data || [];
  } catch (error) {
    console.error('Journal yuklashda xato:', error);
    return [];
  }
}