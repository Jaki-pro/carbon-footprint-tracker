"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("../lib/db");
var fs_1 = require("fs");
var path_1 = require("path");
// Main function to orchestrate the seeding process
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var shouldClean;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    shouldClean = process.argv.includes('--clean');
                    if (!shouldClean) return [3 /*break*/, 2];
                    return [4 /*yield*/, cleanDatabase()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [4 /*yield*/, seedTables()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// Function to clean existing data from tables
function cleanDatabase() {
    return __awaiter(this, void 0, void 0, function () {
        var client, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.default.connect()];
                case 1:
                    client = _a.sent();
                    console.log('🧹 Cleaning the database...');
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 6, 8, 9]);
                    return [4 /*yield*/, client.query('BEGIN')];
                case 3:
                    _a.sent(); // Start transaction
                    console.log('  -> Truncating "UserChallenges", "UserBadges", "Activities"...');
                    // Note: List tables in order to avoid foreign key constraint issues
                    return [4 /*yield*/, client.query('TRUNCATE TABLE "UserChallenges", "UserBadges", "Todos", "CarbonBudgets", "Activities" RESTART IDENTITY CASCADE')];
                case 4:
                    // Note: List tables in order to avoid foreign key constraint issues
                    _a.sent();
                    return [4 /*yield*/, client.query('COMMIT')];
                case 5:
                    _a.sent(); // Commit transaction
                    console.log('✅ Database cleaned successfully.');
                    return [3 /*break*/, 9];
                case 6:
                    error_1 = _a.sent();
                    return [4 /*yield*/, client.query('ROLLBACK')];
                case 7:
                    _a.sent(); // Rollback on error
                    console.error('❌ Error cleaning database:', error_1);
                    throw error_1; // Re-throw error to stop the script
                case 8:
                    client.release();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
// Function to seed all necessary tables
function seedTables() {
    return __awaiter(this, void 0, void 0, function () {
        var client, sqlFilePath, sql, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.default.connect()];
                case 1:
                    client = _a.sent();
                    console.log('🌱 Seeding the database...');
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 6, 8, 9]);
                    return [4 /*yield*/, client.query('BEGIN')];
                case 3:
                    _a.sent(); // Start transaction
                    // Seed EmissionFactors
                    console.log('  -> Seeding "EmissionFactors"...');
                    sqlFilePath = path_1.default.join(__dirname, '..', 'seed.sql');
                    sql = fs_1.default.readFileSync(sqlFilePath, 'utf8');
                    return [4 /*yield*/, client.query(sql)];
                case 4:
                    _a.sent();
                    // You could add other seeding logic here for other tables if needed
                    return [4 /*yield*/, client.query('COMMIT')];
                case 5:
                    // You could add other seeding logic here for other tables if needed
                    _a.sent(); // Commit transaction
                    console.log('🚀 Database seeded successfully!');
                    return [3 /*break*/, 9];
                case 6:
                    error_2 = _a.sent();
                    return [4 /*yield*/, client.query('ROLLBACK')];
                case 7:
                    _a.sent(); // Rollback on error
                    console.error('❌ Error seeding tables:', error_2);
                    throw error_2; // Re-throw error to stop the script
                case 8:
                    client.release();
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
// Execute main function and handle final cleanup
main()
    .catch(function (err) {
    console.error('An error occurred while attempting to seed the database:', err);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('👋 Closing database connection pool.');
                return [4 /*yield*/, db_1.default.end()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
