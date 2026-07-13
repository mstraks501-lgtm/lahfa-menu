import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const MENU_DATA_FILE = path.join(DATA_DIR, 'menu.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  nameAr: string;
  nameEn: string;
  price: number;
  description: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
}

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  nameEn: string;
  image: string;
}

export interface MenuData {
  categories: Category[];
  items: MenuItem[];
  lastUpdated: string;
}

// Initialize default menu data
const DEFAULT_MENU_DATA: MenuData = {
  categories: [],
  items: [],
  lastUpdated: new Date().toISOString(),
};

// Read menu data from JSON file
export function readMenuData(): MenuData {
  try {
    if (fs.existsSync(MENU_DATA_FILE)) {
      const data = fs.readFileSync(MENU_DATA_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('[Storage] Error reading menu data:', error);
  }
  return DEFAULT_MENU_DATA;
}

// Write menu data to JSON file
export function writeMenuData(data: MenuData): void {
  try {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(MENU_DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('[Storage] Error writing menu data:', error);
    throw error;
  }
}

// Get all categories
export function getCategories(): Category[] {
  const data = readMenuData();
  return data.categories;
}

// Get all items
export function getItems(): MenuItem[] {
  const data = readMenuData();
  return data.items;
}

// Get items by category
export function getItemsByCategory(categoryId: string): MenuItem[] {
  const data = readMenuData();
  return data.items.filter(item => item.categoryId === categoryId);
}

// Add or update item
export function upsertItem(item: MenuItem): MenuItem {
  const data = readMenuData();
  const index = data.items.findIndex(i => i.id === item.id);
  
  if (index >= 0) {
    data.items[index] = item;
  } else {
    data.items.push(item);
  }
  
  writeMenuData(data);
  return item;
}

// Delete item
export function deleteItem(itemId: string): boolean {
  const data = readMenuData();
  const index = data.items.findIndex(i => i.id === itemId);
  
  if (index >= 0) {
    data.items.splice(index, 1);
    writeMenuData(data);
    return true;
  }
  
  return false;
}

// Add or update category
export function upsertCategory(category: Category): Category {
  const data = readMenuData();
  const index = data.categories.findIndex(c => c.id === category.id);
  
  if (index >= 0) {
    data.categories[index] = category;
  } else {
    data.categories.push(category);
  }
  
  writeMenuData(data);
  return category;
}

// Delete category
export function deleteCategory(categoryId: string): boolean {
  const data = readMenuData();
  const index = data.categories.findIndex(c => c.id === categoryId);
  
  if (index >= 0) {
    data.categories.splice(index, 1);
    // Also remove items in this category
    data.items = data.items.filter(item => item.categoryId !== categoryId);
    writeMenuData(data);
    return true;
  }
  
  return false;
}

// Bulk update menu data (for initialization)
export function updateMenuData(newData: Partial<MenuData>): MenuData {
  const data = readMenuData();
  
  if (newData.categories) {
    data.categories = newData.categories;
  }
  if (newData.items) {
    data.items = newData.items;
  }
  
  writeMenuData(data);
  return data;
}
