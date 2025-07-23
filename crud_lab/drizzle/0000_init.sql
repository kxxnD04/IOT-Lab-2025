CREATE TABLE "student68" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"student_id" varchar(20) NOT NULL UNIQUE,
	"birth_date" date NOT NULL,
	"gender" varchar(10) NOT NULL
);
