CREATE TABLE places (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  address TEXT,
  phone TEXT,
  website TEXT,
  accessibilityFeatures TEXT,
  rating REAL,
  reviewCount INTEGER DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accessibility_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  placeId INTEGER NOT NULL,
  userId TEXT NOT NULL,
  rating INTEGER NOT NULL,
  features TEXT,
  comment TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (placeId) REFERENCES places(id)
);

CREATE TABLE user_preferences (
  userId TEXT PRIMARY KEY,
  accessibilityPreferences TEXT NOT NULL,
  savedPlaces TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);