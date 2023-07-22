CREATE TABLE users(
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role varchar(100) DEFAULT 'USER',
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL
);
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  name varchar(20) NOT NULL,
  title varchar(50) NOT NULL,
  price float NOT NULL,
  description TEXT NOT NULL
);
CREATE TABLE category (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  name varchar(30) NOT NULL,
  description TEXT NOT NULL
);
CREATE TABLE book_category (
  book_id UUID REFERENCES "books" ("id") ON DELETE CASCADE,
  category_id UUID REFERENCES "category" ("id") ON DELETE CASCADE,
  PRIMARY KEY ("book_id", "category_id")
);
ALTER TABLE category
ADD CONSTRAINT unique_category_name UNIQUE (name);