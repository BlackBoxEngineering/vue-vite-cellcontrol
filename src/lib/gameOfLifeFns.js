export const countNeighbours = (_cellArray, _rowIndex, _colIndex, _columns, _rows) => {
    let neighbours = 0;
    for (let row = _rowIndex - 1; row <= _rowIndex + 1; row++) {
        for (let col = _colIndex - 1; col <= _colIndex + 1; col++) {
            if (row === _rowIndex && col === _colIndex) continue;
            if (row >= 0 && col >= 0 && row < _rows && col < _columns) {
                const index = row * _columns + col;
                if (_cellArray[index]) neighbours++;
            }
        }
    }
    return neighbours;
};
export const runActiveCellRules = (_cellArray, _index, _columns, _rows) => {
    const rowIndex = Math.floor(_index / _columns);
    const colIndex = _index % _columns;
    const underpopulation = rule_underpopulation(_cellArray, rowIndex, colIndex, _columns, _rows);
    if (underpopulation) return 0;
    const survival = rule_survival(_cellArray, rowIndex, colIndex, _columns, _rows);
    if (!survival) return 0;
    const crowding = rule_crowding(_cellArray, rowIndex, colIndex, _columns, _rows);
    if (crowding) return 0;
    return 1;
};

export const runDeadCellRules = (_cellArray, _index, _columns, _rows) => {
    const rowIndex = Math.floor(_index / _columns);
    const colIndex = _index % _columns;
    const reproduction = rule_reproduction(_cellArray, rowIndex, colIndex, _columns, _rows);
    return reproduction;
};

export const runLiveSweep = (_cellArray, _rows, _columns) => {
    const copiedCellArray = _cellArray.concat();
    for (let index = 0; index < copiedCellArray.length; index++) {
        if (_cellArray[index]) {
            const result = runActiveCellRules(copiedCellArray, index, _columns, _rows);
            copiedCellArray[index] = result;
        }
    }
    return copiedCellArray;
};

export const runDeadSweep = (_cellArray, _rows, _columns) => {
    const copiedCellArray = _cellArray.concat();
    for (let index = 0; index < copiedCellArray.length; index++) {
        if (!_cellArray[index]) {
            const result = runDeadCellRules(copiedCellArray, index, _columns, _rows);
            copiedCellArray[index] = result;
        }
    }
    return copiedCellArray;
};

export const rule_underpopulation = (_cellArray, _rowIndex, _colIndex, _columns, _rows) => {
    const neighbours = countNeighbours(_cellArray, _rowIndex, _colIndex, _columns, _rows);
    return neighbours < 2 ? 1 : 0;
};

export const rule_survival = (_cellArray, _rowIndex, _colIndex, _columns, _rows) => {
    const neighbours = countNeighbours(_cellArray, _rowIndex, _colIndex, _columns, _rows);
    return neighbours === 2 || neighbours === 3 ? 1 : 0;
};

export const rule_crowding = (_cellArray, _rowIndex, _colIndex, _columns, _rows) => {
    const neighbours = countNeighbours(_cellArray, _rowIndex, _colIndex, _columns, _rows);
    return neighbours > 3 ? 1 : 0;
};

export const rule_reproduction = (_cellArray, _rowIndex, _colIndex, _columns, _rows) => {
    const neighbours = countNeighbours(_cellArray, _rowIndex, _colIndex, _columns, _rows);
    return neighbours === 3 ? 1 : 0;
};