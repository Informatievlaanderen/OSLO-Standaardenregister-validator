import { Cell, Row } from 'exceljs'
import { FetchOptions } from '../types/fetchOptions'

const STANDARDS_REGISTRY_URL: string = 'https://raw.githubusercontent.com/Informatievlaanderen/OSLO-Standaarden/configuratie/standaardenregister.json'

//Excel constants
const TITLE_FONT: Row["font"] = { family: 4, size: 16, bold: true }
const FALSE_FILL: Cell['fill'] = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'ed1515' } }
const TRUE_FILL: Cell['fill'] = { type: 'pattern', pattern: 'solid', fgColor: { argb: '28bf4d' } }
const MAX_COLUMN_WIDTH: number = 40

//Axios constants
const GET_OPTIONS: FetchOptions = { method: 'GET' }

export { STANDARDS_REGISTRY_URL, TITLE_FONT, MAX_COLUMN_WIDTH, FALSE_FILL, TRUE_FILL, GET_OPTIONS }