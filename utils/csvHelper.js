import Papa from 'papaparse'

/**
 * Shared CSV Utility helper for handling Import and Export functionalities.
 */
export const CSVHelper = {
    /**
     * Exports data to a CSV file.
     * @param {Array} data - The array of objects to export.
     * @param {string} filename - The name of the file to download (without extension).
     */
    exportToCSV: (data, filename) => {
        if (!data || !data.length) {
            console.warn('No data to export');
            return;
        }

        const csv = Papa.unparse(data)
        const blob = new Blob([ csv ], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[ 0 ]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    },

    /**
     * Imports data from a CSV file.
     * @param {File} file - The file object from the input.
     * @param {Function} onComplete - Callback function receiving the parsed data.
     * @param {Function} onError - Callback function for errors.
     */
    importFromCSV: (file, onComplete, onError) => {
        if (!file) return

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.errors && results.errors.length > 0) {
                    console.error('CSV Parsing Errors:', results.errors);
                    if (onError) onError(results.errors);
                }
                if (onComplete) onComplete(results);
            },
            error: (error) => {
                console.error('CSV Import Error:', error);
                if (onError) onError(error);
            }
        })
    }
}
