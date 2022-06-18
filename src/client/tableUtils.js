import settings from "../settings";
import {range} from "../utils";

function removeLastRows(table, actualRowsCount, rowsCount) {
    for (let i = rowsCount - 1; i >= actualRowsCount; i--) {
        table.deleteRow(i);
    }
}

function appendRows(table, rowsCount) {
    range(0, rowsCount).forEach(_ => addRow(table));
}

function addRow(table) {
    const row = table.insertRow();
    const usernameCell = row.insertCell();
    const radiusCell = row.insertCell();
    const usernameTextNode = document.createTextNode('');
    const radiusTextNode = document.createTextNode('');
    usernameCell.appendChild(usernameTextNode);
    radiusCell.appendChild(radiusTextNode);
}

export function resizeTable(leaderboardBody, rows, newSize) {
    if (newSize < rows.length) {
        removeLastRows(leaderboardBody, newSize, rows.length);
        return;
    }

    if (newSize > rows.length) {
        appendRows(leaderboardBody, settings.TOP_COUNT - rows.length);
    }
}

export function fillRow(row, username, radius) {
    const cells = row.getElementsByTagName('td');
    cells[0].innerHTML = username;
    cells[1].innerHTML = Math.round(radius).toString();
}