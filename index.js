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
const sanitizeConfiguration = (configuration) => {
    var _a, _b, _c, _d, _e;
    const sanitizedConfiguration = {
        naam: (configuration === null || configuration === void 0 ? void 0 : configuration.naam) || (configuration_1.defaultConfiguration === null || configuration_1.defaultConfiguration === void 0 ? void 0 : configuration_1.defaultConfiguration.naam),
        rapport: (configuration === null || configuration === void 0 ? void 0 : configuration.rapport) || (configuration_1.defaultConfiguration === null || configuration_1.defaultConfiguration === void 0 ? void 0 : configuration_1.defaultConfiguration.rapport),
        verantwoordelijke_organisatie: !!(configuration === null || configuration === void 0 ? void 0 : configuration.verantwoordelijke_organisatie),
        identificator_organisatie: !!(configuration === null || configuration === void 0 ? void 0 : configuration.identificator_organisatie),
        publicatiedatum: !!(configuration === null || configuration === void 0 ? void 0 : configuration.publicatiedatum),
        type_toepassing: !!(configuration === null || configuration === void 0 ? void 0 : configuration.type_toepassing),
        categorie: !!(configuration === null || configuration === void 0 ? void 0 : configuration.categorie),
        beschrijving: !!(configuration === null || configuration === void 0 ? void 0 : configuration.beschrijving),
        specificatiedocument: ((_a = configuration === null || configuration === void 0 ? void 0 : configuration.specificatiedocument) === null || _a === void 0 ? void 0 : _a.length) > 0 || false,
        documentatie: ((_b = configuration === null || configuration === void 0 ? void 0 : configuration.documentatie) === null || _b === void 0 ? void 0 : _b.length) > 0 || false,
        charter: ((_c = configuration === null || configuration === void 0 ? void 0 : configuration.charter) === null || _c === void 0 ? void 0 : _c.length) > 0 || false,
        verslagen: ((_d = configuration === null || configuration === void 0 ? void 0 : configuration.verslagen) === null || _d === void 0 ? void 0 : _d.length) > 0 || false,
        presentaties: ((_e = configuration === null || configuration === void 0 ? void 0 : configuration.presentaties) === null || _e === void 0 ? void 0 : _e.length) > 0 || false,
        functioneel_toepassingsgebied: !!(configuration === null || configuration === void 0 ? void 0 : configuration.functioneel_toepassingsgebied),
        organisatorisch_werkingsgebied: !!(configuration === null || configuration === void 0 ? void 0 : configuration.organisatorisch_werkingsgebied),
        datum_van_aanmelding: !!(configuration === null || configuration === void 0 ? void 0 : configuration.datum_van_aanmelding),
        erkenning_werkgroep_datastandaarden: !!(configuration === null || configuration === void 0 ? void 0 : configuration.erkenning_werkgroep_datastandaarden),
        erkenning_stuurgroep: !!(configuration === null || configuration === void 0 ? void 0 : configuration.erkenning_stuurgroep),
    };
    return sanitizedConfiguration;
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
const sanitizeConfigurations = (configurations) => {
    try {
        if (!!(configurations === null || configurations === void 0 ? void 0 : configurations.length)) {
            return configurations === null || configurations === void 0 ? void 0 : configurations.map((configuration) => sanitizeConfiguration(configuration));
        }
    }
    catch (error) {
        console.error('Error: unable to sanitize the configurations', error);
    }
    return []; // Add a default return value in case of error or empty data
};
const generateSanitizedConfigsOverview = (configurations) => {
    const sanitizedConfigs = sanitizeConfigurations(configurations);
    const sanitizedCsvData = (0, utils_1.convertJsonToCsv)(sanitizedConfigs);
    (0, utils_1.writeFile)('report/sanitized_merged_configurations.csv', sanitizedCsvData);
    (0, utils_1.writeFile)('report/sanitized_merged_configurations.json', JSON.stringify(sanitizedConfigs, null, 4));
    (0, utils_1.convertCsvToExcel)(sanitizedCsvData, "report/sanitized_merged_configurations");
};
const generateConfigsOverview = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const promises = yield resolveConfigurations();
        const configurations = yield Promise.all(promises);
        const csvData = (0, utils_1.convertJsonToCsv)(configurations);
        (0, utils_1.writeFile)('report/merged_configurations.csv', csvData);
        (0, utils_1.writeFile)('report/merged_configurations.json', JSON.stringify(configurations, null, 4));
        generateSanitizedConfigsOverview(configurations);
        (0, utils_1.convertCsvToExcel)(csvData, "report/merged_configurations");
    }
    catch (error) {
        console.error('Error: unable to save the configuration in a file', error);
    }
});
generateConfigsOverview();
