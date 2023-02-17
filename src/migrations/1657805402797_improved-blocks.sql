-- Up Migration

ALTER TABLE "blocks" ADD COLUMN "timestamp" INT;
ALTER TABLE "blocks_solana" ADD COLUMN "timestamp" INT;

-- Down Migration

ALTER TABLE "blocks" DROP COLUMN "timestamp";
ALTER TABLE "blocks_solana" DROP COLUMN "timestamp";