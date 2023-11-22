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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const configuration_1 = require("./types/configuration");
const utils_1 = require("./utils/utils");
const options = {
    method: 'GET',
};
const getStandardRegistry = () => __awaiter(void 0, void 0, void 0, function* () {
    const url = 'https://raw.githubusercontent.com/Informatievlaanderen/OSLO-Standaarden/configuratie/standaardenregister.json';
    try {
        const response = yield (0, axios_1.default)(url, options);
        const data = response === null || response === void 0 ? void 0 : response.data;
        return data || []; // Add a default return value in case of error or empty data
    }
    catch (error) {
        console.error('Error: unable to fetch the standards registry', error);
        return []; // Add a default return value in case of error or empty data
    }
});
const getConfiguration = (url) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, axios_1.default)(url, options);
        const data = response === null || response === void 0 ? void 0 : response.data;
        return data || {}; // Add a default return value in case of error or empty data
    }
    catch (error) {
        console.error('Error: unable to fetch the configuration', error);
        return configuration_1.defaultConfiguration; // Add a default return value in case of error or empty data
    }
});
const resolveConfigurations = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const standards = yield getStandardRegistry();
        return standards.map((standard) => __awaiter(void 0, void 0, void 0, function* () {
            const rawUrl = (0, utils_1.generateRawGithubPath)(standard === null || standard === void 0 ? void 0 : standard.repository, 'standaardenregister', standard === null || standard === void 0 ? void 0 : standard.configuration);
            return getConfiguration(rawUrl);
        }));
    }
    catch (error) {
        console.error('Error: unable to resolve the configurations', error);
        return []; // Add a default return value in case of error or empty data
    }
});
const saveConfigurations = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promises = yield resolveConfigurations();
        const configurations = yield Promise.all(promises);
        const csvData = (0, utils_1.convertJsonToCsv)(configurations);
        (0, utils_1.writeFile)('report/merged_configurations.csv', csvData);
        (0, utils_1.convertCsvToExcel)(csvData, "report/merged_configurations");
    }
    catch (error) {
        console.error('Error: unable to save the configuration in a file', error);
    }
});
saveConfigurations();
