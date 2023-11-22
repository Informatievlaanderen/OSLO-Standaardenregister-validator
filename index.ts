import axios from 'axios'

import { FetchOptions } from './types/fetchOptions'
import { Configuration, defaultConfiguration } from './types/configuration'
import { Standard } from './types/standard'
import { generateRawGithubPath, writeFile, convertJsonToCsv, convertCsvToExcel } from './utils/utils'

const options: FetchOptions = {
    method: 'GET',
}

const getStandardRegistry = async (): Promise<Array<Standard>> => {
    const url: string = 'https://raw.githubusercontent.com/Informatievlaanderen/OSLO-Standaarden/configuratie/standaardenregister.json'

    try {
        const response = await axios<Array<Standard>>(url, options)
        const data = response?.data
        return data || [] // Add a default return value in case of error or empty data
    } catch (error: unknown) {
        console.error('Error: unable to fetch the standards registry', error)
        return [] // Add a default return value in case of error or empty data
    }
}

const getConfiguration = async (url: string): Promise<Configuration> => {
    try {
        const response = await axios<Configuration>(url, options)
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

const saveConfigurations = async (): Promise<void> => {
    try {
        const promises = await resolveConfigurations()
        const configurations = await Promise.all(promises)
        const csvData = convertJsonToCsv(configurations)
        writeFile('report/merged_configurations.csv', csvData)
        convertCsvToExcel(csvData, "report/merged_configurations")
    } catch (error: unknown) {
        console.error('Error: unable to save the configuration in a file', error)
    }
}

saveConfigurations()
