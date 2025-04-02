-- CreateTable
CREATE TABLE "Museum" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "score" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Museum_name_key" ON "Museum"("name");
