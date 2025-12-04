// src/services/categoryService.ts

export interface Category {
    id: string;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CategoryCreateDTO {
    name: string;
    description?: string;
}

export interface CategoryUpdateDTO {
    name?: string;
    description?: string;
}

/**
 * Base API URL resolution (prefer Next.js public env var):
 * - Next.js: `process.env.NEXT_PUBLIC_API_BASE_URL` (preferred)
 * - Vite: `import.meta.env.VITE_API_BASE_URL`
 * - CRA: `process.env.REACT_APP_API_BASE_URL`
 * - Fallback: `http://localhost:4000`
 */
const BASE_API =
    (process.env.NEXT_PUBLIC_API_BASE_URL as string) ||
    (process.env.REACT_APP_API_BASE_URL as string) ||
    'http://localhost:4000';

const CATEGORIES_ENDPOINT = `${BASE_API.replace(/\/$/, '')}/categories`;

async function handleResponse<T>(res: Response): Promise<T> {
    if (res.status === 204) {
        // No content
        return undefined as unknown as T;
    }
    const text = await res.text();
    try {
        return text ? (JSON.parse(text) as T) : (undefined as unknown as T);
    } catch {
        // If response isn't JSON, return raw text as unknown
        return text as unknown as T;
    }
}

export async function getCategories(): Promise<Category[]> {
    const res = await fetch(CATEGORIES_ENDPOINT, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text() || res.statusText);
    return handleResponse<Category[]>(res);
}

export async function getCategory(id: string): Promise<Category> {
    const res = await fetch(`${CATEGORIES_ENDPOINT}/${encodeURIComponent(id)}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text() || res.statusText);
    return handleResponse<Category>(res);
}

export async function createCategory(payload: CategoryCreateDTO): Promise<Category> {
    const res = await fetch(CATEGORIES_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text() || res.statusText);
    return handleResponse<Category>(res);
}

export async function updateCategory(id: string, payload: CategoryUpdateDTO): Promise<Category> {
    const res = await fetch(`${CATEGORIES_ENDPOINT}/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(await res.text() || res.statusText);
    return handleResponse<Category>(res);
}

export async function deleteCategory(id: string): Promise<void> {
    const res = await fetch(`${CATEGORIES_ENDPOINT}/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: { Accept: 'application/json' },
        credentials: 'include',
    });
    if (!res.ok) throw new Error(await res.text() || res.statusText);
    await handleResponse<void>(res);
}

const categoryService = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
};

export default categoryService;