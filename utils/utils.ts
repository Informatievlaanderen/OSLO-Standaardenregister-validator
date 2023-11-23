import { json2csv } from 'json-2-csv'
import fs from 'fs'

const generateRawGithubUrl = (url: string): string => {
    return url.replace('github.com', 'raw.githubusercontent.com')
}

const generateRawGithubPath = (repository: string, branch: string, path: string): string => {
    return `${generateRawGithubUrl(repository)}/${branch}/${path}`
}

const writeFile = (path: string, data: string): void => {
    try {
        fs.writeFileSync(path, data, 'utf-8')
    } catch (error: unknown) {
        console.error('Error: unable to write the file', error)
        throw error
    }
}

const validateValue = (value: string): boolean => {
    return !!(value && value != "TBD")
}

const getFilesFromPath = (path: string, extension: string): string[] => {
    try {
        const fileObjs = fs.readdirSync(path)
        return fileObjs.filter(file => file.match(new RegExp(`.*\.(${extension})`, 'ig')))
    } catch (error: unknown) {
        console.error('Error: unable to get the files from the path', error)
        throw error
    }
}

const convertJsonToCsv = (json: Object[]): string => {
    try {
        return json2csv(json)
    } catch (error: unknown) {
        console.error('Error: unable to convert json to csv', error)
        throw error
    }
}

export { generateRawGithubUrl, generateRawGithubPath, writeFile, validateValue, getFilesFromPath, convertJsonToCsv }
