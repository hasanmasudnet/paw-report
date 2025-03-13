import * as XLSX from "xlsx";

export interface ExportOptions {
  fileName?: string;
  sheetName?: string;
  fileType?: "xlsx" | "csv";
}

/**
 * Export data to Excel/CSV file
 * @param data Array of objects to export
 * @param options Export options (fileName, sheetName, fileType)
 */
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  options: ExportOptions = {},
) {
  const {
    fileName = "export",
    sheetName = "Sheet1",
    fileType = "xlsx",
  } = options;

  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // Convert data to worksheet
  const ws = XLSX.utils.json_to_sheet(data);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Generate the file and trigger download
  XLSX.writeFile(wb, `${fileName}.${fileType}`);
}
