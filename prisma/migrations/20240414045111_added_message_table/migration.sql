-- CreateTable
CREATE TABLE "message" (
    "message_id" SERIAL NOT NULL,
    "message_email" VARCHAR(500) NOT NULL,
    "message_message" VARCHAR(500) NOT NULL,
    "message_isdeleted" BOOLEAN NOT NULL DEFAULT false,
    "message_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_pkey" PRIMARY KEY ("message_id")
);
