import { api, API_URL } from './api';

const SERVER_URL = API_URL.replace('/api', '');

export interface Employee {
  id: number;
  name: string;
  position: string;
  photo: string | null;
  phone: string | null;
  email: string | null;
  description: string | null;
  hidden: boolean;
  order: number;
}

// Rasm URL manzilini to'g'rilash
function fixPhotoUrl(emp: any) {
  if (emp && emp.photo && !emp.photo.startsWith('http')) {
    emp.photo = `${SERVER_URL}${emp.photo}`;
  }
  return emp;
}

export async function fetchEmployees(): Promise<Employee[]> {
  const { data } = await api.get('/employees');
  const items = data.items || data;
  return items.map(fixPhotoUrl);
}