export function getLastDayOfWeek(dateString) {
    // Parse the input date string
    const date = new Date(dateString);

    // Calculate the last day of the week (Saturday)
    // Since Sunday is considered the first day of the week, Saturday is 6 days ahead
    const lastDayOfWeek = new Date(date);
    lastDayOfWeek.setDate(date.getDate() + 7); // Move to the next Sunday
    lastDayOfWeek.setDate(lastDayOfWeek.getDate() - 1); // Move back one day to Saturday

    // Format the date back to 'YYYY-MM-DD'
    const year = lastDayOfWeek.getFullYear();
    const month = String(lastDayOfWeek.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(lastDayOfWeek.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}