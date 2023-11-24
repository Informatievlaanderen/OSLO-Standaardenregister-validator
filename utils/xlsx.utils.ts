import ExcelJS, { Cell } from 'exceljs'
import { FALSE_FILL, MAX_COLUMN_WIDTH, TITLE_FONT, TRUE_FILL } from '../constants/constants'
import { getFilesFromPath } from './utils'

const cellFormatting = (cell: Cell): void => {
    try {
        cell.alignment = {
            horizontal: 'left',
        }
    } catch (error: unknown) {
        console.error('Error: unable to format the cell', error)
        throw error
    }
}

const conditionalFormatting = (cell: Cell): void => {
    try {
        switch (cell.value) {
            case true:
                cell.fill = TRUE_FILL
                break
            case false:
                cell.fill = FALSE_FILL
                break
            default: return
        }
    } catch (error: unknown) {
        console.error('Error: unable to conditionally format the cell', error)
        throw error
    }
}

const wsFormatting = (worksheet: ExcelJS.Worksheet, width: number = MAX_COLUMN_WIDTH): void => {
    try {
        let maxColumnLength = 0
        worksheet.columns.forEach((column) => {
            (column && column.eachCell) && column.eachCell({ includeEmpty: false }, (cell: Cell) => {
                cellFormatting(cell)
                // format cells based on boolean value from sanitizeConfiguration
                conditionalFormatting(cell)
                maxColumnLength = Math.max(
                    maxColumnLength,
                    width,
                    cell.value ? cell.value.toString().length : 0
                )
            })
            // The + 4 is to add some extra whitespace after length of the word to make it look better
            column.width = ((maxColumnLength > width) ? width : maxColumnLength) + 4
        })

        worksheet.getRow(1).font = TITLE_FONT
    } catch (error: unknown) {
        console.error('Error: unable to format the worksheet', error)
        throw error
    }
}

const convertCsvsToExcel = async (path: string, fileName: string): Promise<void> => {
    try {
        let wb = new ExcelJS.Workbook()
        const files: string[] = getFilesFromPath(path, 'csv')
        console.log(`Found these files to convert into one Excel: ${files}`)
        const promises = files?.map(async (file: string) => {
            let ws = await wb.csv.readFile(`${path}${file}`)
            ws.name = file.replace('.csv', '')
            // format the worksheet to be more human readable
            wsFormatting(ws)
            return ws
        })
        await Promise.all(promises)

        await wb.xlsx.writeFile(`${path}${fileName}.xlsx`)
    } catch (error: unknown) {
        console.error('Error: unable to convert csv to Excel', error)
        throw error
    }
}

export { convertCsvsToExcel }