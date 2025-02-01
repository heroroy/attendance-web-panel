import Papa from 'papaparse';

export default function readCsv(file: File):Promise<string[]> {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            complete: (result) => {
                console.log("result >>", result.data)
                // Extract roll numbers from the CSV data
                const data = result.data.map((row: any) => row['Roll Number'] as string);
                resolve(data)
            },
            header: true, // Treat the first row as the header
            skipEmptyLines: true, // Skip empty lines in the CSV,
            error: (error, _) => reject(error)
        });
    });
}