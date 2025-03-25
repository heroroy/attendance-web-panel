import Papa from 'papaparse';

export default function readCsv(file: File):Promise<string[]> {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            complete: (result) => {
                // Extract roll numbers from the CSV data
                const data = result.data.map((row: any) => row[0] as string);
                resolve(data)
            },
            header: false, // Treat the first row as the header
            skipEmptyLines: true, // Skip empty lines in the CSV,
            error: (error, _) => reject(error)
        });
    });
}