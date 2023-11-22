import { json2csv } from 'json-2-csv';
import fs from 'fs';
import xlsx from 'xlsx';

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
        throw error;
    }
}

const readFile = (path: string): string => {
    try {
        return fs.readFileSync(path, 'utf-8')
    } catch (error: unknown) {
        console.error('Error: unable to read the file', error)
        throw error;
    }
}

const convertJsonToCsv = (json: Object[]): string => {
    return json2csv(json);
}

const convertCsvToExcel = (csv: string, fileName: string): void => {
    try {
        const wb = xlsx.read(csv, { type: "string", cellStyles: true });
        xlsx.writeFile(wb, `${fileName}.xlsx`);
    } catch (error: unknown) {
        console.error('Error: unable to convert csv to Excel', error)
        throw error;
    }
}


export { generateRawGithubUrl, generateRawGithubPath, writeFile, convertJsonToCsv, convertCsvToExcel }
