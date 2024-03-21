document.addEventListener("DOMContentLoaded", async function () {
    const employeeIDInput = document.getElementById("employeeID");
    const fromDateInput = document.getElementById("fromDateInput");
    const toDateInput = document.getElementById("toDateInput");
    const searchBtn = document.getElementById("searchBtn");
    const timesheetTableBody = document.getElementById("timesheetTableBody");

    // Function to fetch timesheet data based on employee ID and date range
    async function fetchTimesheetData() {
        const selectedEmployeeID = employeeIDInput.value;
        const fromDate = new Date(fromDateInput.value);
        const toDate = new Date(toDateInput.value);

        // Adjust fromDate to include the entire day
        fromDate.setHours(0, 0, 0, 0);

        // Adjust toDate to include the entire day
        toDate.setHours(23, 59, 59, 999);

        if (fromDate > toDate) {
            alert("From Date should be before or the same as To Date.");
            return;
        }

        try {
            const response = await fetch('../database/timesheet.csv');
            if (!response.ok) {
                throw new Error('Failed to fetch timesheet.csv');
            }
            const data = await response.text();
            const rows = data.trim().split('\n');

            // Clear previous data
            timesheetTableBody.innerHTML = '';

            let dataFound = false;

            // Create table structure dynamically
            const table = document.createElement('table');
            const headerRow = document.createElement('tr');
            const headerColumns = ['Employee ID', 'Date', 'Time In', 'Time Out'];
            headerColumns.forEach(column => {
                const th = document.createElement('th');
                th.textContent = column;
                headerRow.appendChild(th);
            });
            table.appendChild(headerRow);

            rows.forEach(row => {
                const columns = row.split(',');
                const employeeID = columns[0].trim();
                const date = new Date(columns[1].trim()); // Parse date as Date object
                const timeIn = columns[2].trim();
                const timeOut = columns[3].trim();

                // Check if the row belongs to the selected employee and falls within the date range
                if (employeeID === selectedEmployeeID && date >= fromDate && date <= toDate) {
                    dataFound = true;
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${employeeID}</td>
                        <td>${date.toLocaleDateString()}</td>
                        <td>${timeIn}</td>
                        <td>${timeOut}</td>
                    `;
                    table.appendChild(row);
                }
            });

            // Append the table to the table body
            timesheetTableBody.appendChild(table);

            // Show message if no data found
            if (!dataFound) {
                alert('No data available for the selected date range.');
            }
        } catch (error) {
            console.error('Error fetching or parsing CSV:', error);
            alert('An error occurred. Please try again later.');
        }
    }

    // Event listener for search button
    searchBtn.addEventListener('click', fetchTimesheetData);
});
