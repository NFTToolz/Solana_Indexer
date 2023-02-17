-- Up Migration

CREATE TABLE "blocks_solana" (
  "hash" BYTEA NOT NULL,
  "number" INT NOT NULL
);

ALTER TABLE "blocks_solana"
  ADD CONSTRAINT "blocks_solana_pk"
  PRIMARY KEY ("number", "hash");

-- Down Migration

DROP TABLE "blocks_solana";