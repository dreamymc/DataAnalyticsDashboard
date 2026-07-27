import * as XLSX from 'xlsx';

const data = [
  // COUNTA row
  [43, 43, 43, 43, 43, 43, 43, 43],
  // Headers with a broken one
  ['Serial Number', 'Lead Indicator (LOCAL)', 'Vendor', 'Brgy.Tagluno_DavaoCity', 'TCO/BAU Vendor', 'Province', 'City/Town', 'Program'],
  // Data rows
  ['SN001', '[05] CW DOING', 'Vendor A', 'Site 1', 'TCO A', 'Prov A', 'Town A', 'Prog A'],
  ['SN002', '[06] S-RFI', 'Vendor B', 'Site 2', 'TCO B', 'Prov B', 'Town B', 'Prog B'],
  ['SN003', '[07] S-RFI w/ TRS', 'Vendor C', 'Site 3', 'TCO C', 'Prov C', 'Town C', 'Prog C']
];

const ws = XLSX.utils.aoa_to_sheet(data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
XLSX.writeFile(wb, "Bernard-Sheet1.xlsx");
console.log("Mock Excel created.");
