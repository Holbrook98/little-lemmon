import * as SQLite from 'expo-sqlite';

const database = SQLite.openDatabaseSync('littlelemon');

export async function createMenuTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS menu (
      id INTEGER PRIMARY KEY NOT NULL,
      name TEXT,
      description TEXT,
      price REAL,
      category TEXT,
      imageFileName TEXT
    );
  `;
  return database.execAsync(query);
}

export async function getMenuItems() {
  const sqlQuery = 'SELECT * FROM menu';
  return database.getAllAsync(sqlQuery);
}

export async function getFilteredItems(query, selectedCategories) {
  let categoriesList = selectedCategories.map(category => `'${category}'`).join(',');
  let categoryFilter = `(${categoriesList})`;
  const sqlQuery = `
    SELECT * FROM menu
    WHERE LOWER(name) LIKE '%${query.toLowerCase()}%'
    AND LOWER(category) IN ${categoryFilter.toLowerCase()}
  `;
  return database.getAllAsync(sqlQuery);
}

export async function saveMenuItems(menuItems) {
  const insertQuery = `
    INSERT INTO menu (id, name, description, price, category, imageFileName)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  for (const item of menuItems) {
    await database.runAsync(insertQuery, item.id, item.name, item.description, item.price, item.category, item.imageFileName);
  }
}