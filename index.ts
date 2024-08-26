import axios from "axios";
import path from "path";

import {
  Configuration,
  SanitizedConfiguration,
  defaultConfiguration,
} from "./types/configuration";
import { Standard } from "./types/standard";
import {
  generateRawGithubPath,
  writeFile,
  convertJsonToCsv,
  validateValue,
} from "./utils/utils";
import { convertCsvsToExcel } from "./utils/xlsx.utils";
import { GET_OPTIONS, STANDARDS_REGISTRY_URL } from "./constants/constants";

// Convert values into TRUE/FALSE statements for validation of the fields
// TODO: Can this be done cleaner?
const sanitizeConfiguration = (
  configuration: Configuration
): SanitizedConfiguration => {
  const sanitizedConfiguration: SanitizedConfiguration = {
    title: configuration?.title || defaultConfiguration?.title,
    responsibleOrganisation: !!configuration.responsibleOrganisation?.length,
    publicationDate: validateValue(configuration?.publicationDate),
    category: validateValue(configuration?.category),
    descriptionFileName: !!configuration.descriptionFileName,
    specificationDocuments: !!configuration?.specificationDocuments?.length,
    documentation: !!configuration?.documentation?.length,
    charter: !!configuration?.charter,
    reports: !!configuration?.reports?.length,
    presentations: !!configuration?.presentations?.length,
    dateOfRegistration: validateValue(configuration?.dateOfRegistration),
    dateOfAcknowledgementByWorkingGroup: validateValue(
      configuration?.dateOfAcknowledgementByWorkingGroup
    ),
    dateOfAcknowledgementBySteeringCommittee: validateValue(
      configuration?.dateOfAcknowledgementBySteeringCommittee
    ),
    datePublicReviewStart: validateValue(configuration?.datePublicReviewStart),
    datePublicReviewEnd: validateValue(configuration?.datePublicReviewEnd),
    endOfPublicationDate: validateValue(configuration?.endOfPublicationDate),
    usage: validateValue(configuration?.usage),
    status: validateValue(configuration?.status),
  };
  return sanitizedConfiguration;
};

const getStandardRegistry = async (): Promise<Array<Standard>> => {
  try {
    const response = await axios<Array<Standard>>(
      STANDARDS_REGISTRY_URL,
      GET_OPTIONS
    );
    const data = response?.data;
    return data || []; // Add a default return value in case of error or empty data
  } catch (error: unknown) {
    console.error("Error: unable to fetch the standards registry", error);
    return []; // Add a default return value in case of error or empty data
  }
};

const getConfiguration = async (url: string): Promise<Configuration> => {
  try {
    const response = await axios<Configuration>(url, GET_OPTIONS);
    const data = response?.data;
    return data || {}; // Add a default return value in case of error or empty data
  } catch (error: unknown) {
    console.error("Error: unable to fetch the configuration", error);
    return defaultConfiguration; // Add a default return value in case of error or empty data
  }
};

const resolveConfigurations = async (): Promise<Promise<Configuration>[]> => {
  try {
    const standards: Array<Standard> = await getStandardRegistry();
    return standards.map(async (standard: Standard) => {
      const rawUrl = generateRawGithubPath(
        standard?.repository,
        "standaardenregister",
        standard?.configuration
      );
      return getConfiguration(rawUrl);
    });
  } catch (error: unknown) {
    console.error("Error: unable to resolve the configurations", error);
    return []; // Add a default return value in case of error or empty data
  }
};

const sanitizeConfigurations = (
  configurations: Array<Configuration>
): Array<SanitizedConfiguration> => {
  try {
    if (!!configurations?.length) {
      return configurations?.map((configuration: Configuration) =>
        sanitizeConfiguration(configuration)
      );
    }
  } catch (error: unknown) {
    console.error("Error: unable to sanitize the configurations", error);
    throw error;
  }
  return []; // Add a default return value in case of error or empty data
};

const generateSanitizedConfigsOverview = (
  configurations: Array<Configuration>
): void => {
  const sanitizedConfigs = sanitizeConfigurations(configurations);
  const sanitizedCsvData = convertJsonToCsv(sanitizedConfigs);
  writeFile("report/sanitized_merged_configurations.csv", sanitizedCsvData);
  writeFile(
    "report/sanitized_merged_configurations.json",
    JSON.stringify(sanitizedConfigs, null, 4)
  );
};

const generateConfigsOverview = async (): Promise<void> => {
  try {
    const promises = await resolveConfigurations();
    const configurations = await Promise.all(promises);
    console.log(
      `Fetched all configuration files: ${configurations?.length} in total.`
    );

    const csvData = convertJsonToCsv(configurations);
    console.log("converted the configurations into one CSV");

    writeFile("report/merged_configurations.csv", csvData);
    console.log("Saved this csv in a file");

    writeFile(
      "report/merged_configurations.json",
      JSON.stringify(configurations, null, 4)
    );
    console.log("Saved the configurations as JSON in a file");

    console.log("Gnerating sanitized configurations...");
    generateSanitizedConfigsOverview(configurations);
    console.log("Generating sanitized configurations DONE");

    console.log("Generating Excel file...");
    convertCsvsToExcel(
      path.join(__dirname, "/report/"),
      "merged_configurations"
    );
    console.log("Excel file created!");
  } catch (error: unknown) {
    console.error("Error: unable to save the configuration in a file", error);
    throw error;
  }
};

generateConfigsOverview();
