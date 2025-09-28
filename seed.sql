-- This script will create the EmissionFactors table and populate it with initial data.

-- Optional but recommended: Create a custom ENUM type for categories.
-- This ensures data integrity, meaning you can't accidentally insert a wrong category.
DROP TYPE IF EXISTS activity_category;
CREATE TYPE activity_category AS ENUM ('Transport', 'Food', 'Energy', 'Waste');

-- Drop the table if it already exists to start fresh.
DROP TABLE IF EXISTS "EmissionFactors";

-- Create the EmissionFactors table
CREATE TABLE "EmissionFactors" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) UNIQUE NOT NULL,
    "category" activity_category NOT NULL,
    "factor" DECIMAL(10, 4) NOT NULL, -- Precision for accurate calculations
    "unit" VARCHAR(20) NOT NULL,
    "description" TEXT
);

-- Insert all the emission factor data in a single, efficient command.
INSERT INTO "EmissionFactors" ("name", "category", "factor", "unit", "description") VALUES
-- Transport
('Driving a petrol car', 'Transport', 0.2100, 'km', 'Average emissions for a standard medium-sized petrol car.'),
('Driving an electric car', 'Transport', 0.0500, 'km', 'Emissions based on average grid electricity mix for charging.'),
('Short-haul flight', 'Transport', 0.2500, 'km', 'Emissions per passenger on a flight under 3 hours.'),
('Long-haul flight', 'Transport', 0.1500, 'km', 'Emissions per passenger on a flight over 6 hours.'),
('Bus', 'Transport', 0.0300, 'km', 'Average emissions per passenger for a city bus.'),
('Train (National Rail)', 'Transport', 0.0400, 'km', 'Average emissions per passenger for national train travel.'),
('Cycling', 'Transport', 0.0000, 'km', 'Human-powered, considered zero-emission.'),
('Walking', 'Transport', 0.0000, 'km', 'Human-powered, considered zero-emission.'),

-- Food
('Eating beef', 'Food', 27.0000, 'kg', 'CO₂ equivalent for 1kg of beef consumption.'),
('Eating lamb', 'Food', 20.0000, 'kg', 'CO₂ equivalent for 1kg of lamb consumption.'),
('Eating chicken', 'Food', 6.9000, 'kg', 'CO₂ equivalent for 1kg of chicken consumption.'),
('Eating fish (farmed)', 'Food', 5.0000, 'kg', 'CO₂ equivalent for 1kg of farmed fish.'),
('Eating vegetables', 'Food', 2.0000, 'kg', 'CO₂ equivalent for 1kg of vegetables.'),
('Drinking milk', 'Food', 1.0000, 'litre', 'CO₂ equivalent for 1 litre of dairy milk.'),

-- Energy
('Grid Electricity', 'Energy', 0.4500, 'kWh', 'Average emissions for 1 kilowatt-hour of electricity.'),
('Natural Gas', 'Energy', 0.1850, 'kWh', 'Emissions from burning natural gas for heating or cooking.'),

-- Waste
('General household waste', 'Waste', 0.5000, 'kg', 'Emissions from landfilling 1kg of mixed waste.'),
('Recycling paper', 'Waste', 0.0200, 'kg', 'Emissions saved by recycling 1kg of paper vs. new production.');

-- Add a server-side index for faster lookups by name
CREATE INDEX "idx_emissionfactors_name" ON "EmissionFactors" ("name");