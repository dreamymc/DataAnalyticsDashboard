import * as XLSX from 'xlsx';
import { detectHeaderRowIndex, isBrokenHeader } from './src/lib/header-detector';

// read Excel
const workbook = XLSX.readFile('./Bernard-Sheet1.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

console.log('Total rows:', data.length);
const headerIdx = detectHeaderRowIndex(data as any[][]);
console.log('Detected header row index:', headerIdx);
console.log('Headers:', data[headerIdx]);

// check broken header
console.log('Is "Brgy.Tagluno_DavaoCity" broken?', isBrokenHeader('Brgy.Tagluno_DavaoCity'));
