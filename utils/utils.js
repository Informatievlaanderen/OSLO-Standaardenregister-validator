"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertCsvToExcel = exports.convertJsonToCsv = exports.writeFile = exports.generateRawGithubPath = exports.generateRawGithubUrl = void 0;
const json_2_csv_1 = require("json-2-csv");
const fs_1 = __importDefault(require("fs"));
const xlsx_1 = __importDefault(require("xlsx"));
const generateRawGithubUrl = (url) => {
    return url.replace('github.com', 'raw.githubusercontent.com');
};
exports.generateRawGithubUrl = generateRawGithubUrl;
const generateRawGithubPath = (repository, branch, path) => {
    return `${generateRawGithubUrl(repository)}/${branch}/${path}`;
};
exports.generateRawGithubPath = generateRawGithubPath;
const writeFile = (path, data) => {
    try {
        fs_1.default.writeFileSync(path, data, 'utf-8');
    }
    catch (error) {
        console.error('Error: unable to write the file', error);
        throw error;
    }
};
exports.writeFile = writeFile;
const readFile = (path) => {
    try {
        return fs_1.default.readFileSync(path, 'utf-8');
    }
    catch (error) {
        console.error('Error: unable to read the file', error);
        throw error;
    }
};
const convertJsonToCsv = (json) => {
    return (0, json_2_csv_1.json2csv)(json);
};
exports.convertJsonToCsv = convertJsonToCsv;
const convertCsvToExcel = (csv, fileName) => {
    try {
        const wb = xlsx_1.default.read(csv, { type: "string", cellStyles: true });
        xlsx_1.default.writeFile(wb, `${fileName}.xlsx`);
    }
    catch (error) {
        console.error('Error: unable to convert csv to Excel', error);
        throw error;
    }
};
exports.convertCsvToExcel = convertCsvToExcel;
