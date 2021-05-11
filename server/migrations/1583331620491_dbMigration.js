exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE "portfolio"."users" (
      "id" SERIAL PRIMARY KEY,
      "fullname" TEXT NOT NULL,
      "email" TEXT UNIQUE NOT NULL,
      "password" TEXT NOT NULL
    );
  `)
}
