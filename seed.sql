-- This script now defines the ENTIRE database schema and seeds initial data.

-- Create the custom ENUM type if it doesn't exist (compatible with older Postgres)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'activity_category') THEN
        CREATE TYPE activity_category AS ENUM ('Transport', 'Food', 'Energy', 'Waste');
    END IF;
END$$;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS "Users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "name" VARCHAR(255),
    "image_url" VARCHAR(255),
    "provider" VARCHAR(50),
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);

-- 2. UserSettings Table
CREATE TABLE IF NOT EXISTS "UserSettings" (
    "user_id" UUID PRIMARY KEY REFERENCES "Users"("id") ON DELETE CASCADE,
    "distance_unit" VARCHAR(10) DEFAULT 'km',
    "mass_unit" VARCHAR(10) DEFAULT 'kg',
    "language" VARCHAR(10) DEFAULT 'en',
    "dark_mode" BOOLEAN DEFAULT false
);

-- 3. EmissionFactors Table (Your original table)
CREATE TABLE IF NOT EXISTS "EmissionFactors" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) UNIQUE NOT NULL,
    "category" activity_category NOT NULL,
    "factor" DECIMAL(10, 4) NOT NULL,
    "unit" VARCHAR(20) NOT NULL,
    "description" TEXT
);

-- 4. Activities Table
CREATE TABLE IF NOT EXISTS "Activities" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
    "emission_factor_id" INTEGER NOT NULL REFERENCES "EmissionFactors"("id"),
    "value" DECIMAL(10, 2) NOT NULL,
    "co2_emitted" DECIMAL(10, 4) NOT NULL,
    "activity_date" TIMESTAMPTZ NOT NULL,
    "notes" TEXT
);

-- 5. Badges & Challenges (Definition tables)
CREATE TABLE IF NOT EXISTS "Badges" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "icon_url" VARCHAR(255),
    "criteria" TEXT
);

CREATE TABLE IF NOT EXISTS "Challenges" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "goal_metric" VARCHAR(50),
    "goal_value" DECIMAL(10, 2),
    "start_date" TIMESTAMPTZ,
    "end_date" TIMESTAMPTZ
);

-- 6. UserBadges & UserChallenges (Join tables)
CREATE TABLE IF NOT EXISTS "UserBadges" (
    "user_id" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
    "badge_id" INTEGER NOT NULL REFERENCES "Badges"("id") ON DELETE CASCADE,
    "awarded_at" TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY ("user_id", "badge_id")
);

CREATE TABLE IF NOT EXISTS "UserChallenges" (
    "user_id" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
    "challenge_id" INTEGER NOT NULL REFERENCES "Challenges"("id") ON DELETE CASCADE,
    "progress" DECIMAL(10, 2) DEFAULT 0,
    "status" VARCHAR(50) DEFAULT 'in-progress',
    PRIMARY KEY ("user_id", "challenge_id")
);

-- 7. Other Tables
CREATE TABLE IF NOT EXISTS "CarbonBudgets" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
    "monthly_limit_kg" DECIMAL(10, 2) NOT NULL,
    "start_date" DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS "Recommendations" (
    "id" SERIAL PRIMARY KEY,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category" VARCHAR(50),
    "estimated_co2_saving" DECIMAL(10, 2)
);

CREATE TABLE IF NOT EXISTS "Todos" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL REFERENCES "Users"("id") ON DELETE CASCADE,
    "title" VARCHAR(255) NOT NULL,
    "status" VARCHAR(50) DEFAULT 'pending',
    "priority" INTEGER DEFAULT 1,
    "recommendation_id" INTEGER REFERENCES "Recommendations"("id")
);

-- Clear existing emission factors before inserting new ones to prevent duplicates
TRUNCATE TABLE "EmissionFactors" RESTART IDENTITY CASCADE;

-- Insert all the emission factor data
INSERT INTO "EmissionFactors" ("name", "category", "factor", "unit", "description") VALUES
('Driving a petrol car', 'Transport', 0.2100, 'km', 'Average emissions for a standard medium-sized petrol car.'),
('Driving an electric car', 'Transport', 0.0500, 'km', 'Emissions based on average grid electricity mix for charging.'),
('Short-haul flight', 'Transport', 0.2500, 'km', 'Emissions per passenger on a flight under 3 hours.'),
('Bus', 'Transport', 0.0300, 'km', 'Average emissions per passenger for a city bus.'),
('Cycling', 'Transport', 0.0000, 'km', 'Human-powered, considered zero-emission.'),
('Eating beef', 'Food', 27.0000, 'kg', 'CO₂ equivalent for 1kg of beef consumption.'),
('Eating chicken', 'Food', 6.9000, 'kg', 'CO₂ equivalent for 1kg of chicken consumption.'),
('Grid Electricity', 'Energy', 0.4500, 'kWh', 'Average emissions for 1 kilowatt-hour of electricity.'), 
('General household waste', 'Waste', 0.5000, 'kg', 'Emissions from landfilling 1kg of mixed waste.'),
('Recycling paper', 'Waste', 0.0200, 'kg', 'Emissions saved by recycling 1kg of paper vs. new production.');

-- Add a server-side index for faster lookups by name
CREATE INDEX IF NOT EXISTS "idx_emissionfactors_name" ON "EmissionFactors" ("name");