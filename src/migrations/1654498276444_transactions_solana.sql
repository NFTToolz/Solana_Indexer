-- Up Migration

CREATE TABLE "transactions_solana" (
  "hash" BYTEA NOT NULL,
  "from" BYTEA NOT NULL,
  "to" BYTEA NOT NULL,
  "value" NUMERIC NOT NULL,
  -- Optimization: force the `data` column to be TOASTed
  "data" BYTEA
);

ALTER TABLE "transactions_solana"
  ADD CONSTRAINT " transactions_solana_pk"
  PRIMARY KEY ("hash");

CREATE INDEX "transactions_solana_to_index"
  ON "transactions_solana" ("to");

-- Down Migration

DROP TABLE "transactions_solana";