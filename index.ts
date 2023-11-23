import axios from 'axios'
import path from 'path'

import { Configuration, SanitizedConfiguration, defaultConfiguration } from './types/configuration'
import { Standard } from './types/standard'
import { generateRawGithubPath, writeFile, convertJsonToCsv } from './utils/utils'
import { convertCsvsToExcel } from './utils/xlsx.utils'
import { GET_OPTIONS, STANDARDS_REGISTRY_URL } from './constants/constants'


// Convert values into TRUE/FALSE statements for validation of the fields
// TODO: Can this be done cleaner?
const sanitizeConfiguration = (configuration: Configuration): SanitizedConfiguration => {
    const sanitizedConfiguration: SanitizedConfiguration = {
        naam: configuration?.naam || defaultConfiguration?.naam,
        rapport: configuration?.rapport || defaultConfiguration?.rapport,
        verantwoordelijke_organisatie: !!configuration?.verantwoordelijke_organisatie,
        identificator_organisatie: !!configuration?.identificator_organisatie,
        publicatiedatum: !!configuration?.publicatiedatum,
        type_toepassing: !!configuration?.type_toepassing,
        categorie: !!configuration?.categorie,
        beschrijving: !!configuration?.beschrijving,
        specificatiedocument: !!configuration?.specificatiedocument?.length,
        documentatie: !!configuration?.documentatie?.length,
        charter: !!configuration?.charter?.length,
        verslagen: !!configuration?.verslagen?.length,
        presentaties: !!configuration?.presentaties?.length,
        functioneel_toepassingsgebied: !!configuration?.functioneel_toepassingsgebied,
        organisatorisch_werkingsgebied: !!configuration?.organisatorisch_werkingsgebied,
        datum_van_aanmelding: !!configuration?.datum_van_aanmelding,
        erkenning_werkgroep_datastandaarden: !!configuration?.erkenning_werkgroep_datastandaarden,
        erkenning_stuurgroep: !!configuration?.erkenning_stuurgroep,
    }
    return sanitizedConfiguration
}

const getStandardRegistry = async (): Promise<Array<Standard>> => {
    try {
        const response = await axios<Array<Standard>>(STANDARDS_REGISTRY_URL, GET_OPTIONS)
        const data = response?.data
        return data || [] // Add a default return value in case of error or empty data
    } catch (error: unknown) {
        console.error('Error: unable to fetch the standards registry', error)
        return [] // Add a default return value in case of error or empty data
    }
}

const getConfiguration = async (url: string): Promise<Configuration> => {
    try {
        const response = await axios<Configuration>(url, GET_OPTIONS)
        const data = response?.data
        return data || {} // Add a default return value in case of error or empty data
    } catch (error: unknown) {
        console.error('Error: unable to fetch the configuration', error)
        return defaultConfiguration // Add a default return value in case of error or empty data
    }
}

const resolveConfigurations = async (): Promise<Promise<Configuration>[]> => {
    try {
        const standards: Array<Standard> = await getStandardRegistry()
        return standards.map(async (standard: Standard) => {
            const rawUrl = generateRawGithubPath(standard?.repository, 'standaardenregister', standard?.configuration)
            return getConfiguration(rawUrl)
        })
    } catch (error: unknown) {
        console.error('Error: unable to resolve the configurations', error)
        return [] // Add a default return value in case of error or empty data
    }
}

const sanitizeConfigurations = (configurations: Array<Configuration>): Array<SanitizedConfiguration> => {
    try {
        if (!!configurations?.length) {
            return configurations?.map((configuration: Configuration) => sanitizeConfiguration(configuration))
        }
    } catch (error: unknown) {
        console.error('Error: unable to sanitize the configurations', error)
    }
    return [] // Add a default return value in case of error or empty data
}

const generateSanitizedConfigsOverview = (configurations: Array<Configuration>): void => {
    const sanitizedConfigs = sanitizeConfigurations(configurations)
    const sanitizedCsvData = convertJsonToCsv(sanitizedConfigs)
    writeFile('report/sanitized_merged_configurations.csv', sanitizedCsvData)
    writeFile('report/sanitized_merged_configurations.json', JSON.stringify(sanitizedConfigs, null, 4))
}

const generateConfigsOverview = async (): Promise<void> => {
    try {
        const promises = await resolveConfigurations()
        const configurations = await Promise.all(promises)
        const csvData = convertJsonToCsv(configurations)

        writeFile('report/merged_configurations.csv', csvData)
        writeFile('report/merged_configurations.json', JSON.stringify(configurations, null, 4))

        generateSanitizedConfigsOverview(configurations)

        convertCsvsToExcel(path.join(__dirname, '/report/'), 'merged_configurations')
    } catch (error: unknown) {
        console.error('Error: unable to save the configuration in a file', error)
    }
}

generateConfigsOverview()