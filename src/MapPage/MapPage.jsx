import React, { useEffect, useState } from 'react';
import PannelModal from '../SchedulePage/PannelModal';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

const MapPage = ({ url }) => {
  const [mapData, setMapData] = useState([]);
  const [dimensions, setDimensions] = useState({ rows: 0, cols: 0 });
  const [loading, setLoading] = useState(true);

  const cellStyle = {
    width: '4em', 
    minWidth: '4em',
  }

  const mapTile = {
    width: '100%',
    height: '100%',

  }

  useEffect(() => {
    const fetchCSV = async () => {
      try {
        const res = await fetch(url);
        const text = await res.text();
        const parsed = parseCSV(text)
        parsed.shift();
        const grid = buildGrid(parsed);
        setMapData(grid.grid);
        setDimensions(grid.dimensions);
      } catch (err) {
        console.error('Error loading CSV:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCSV();
  }, [url]);

  const parseCSV = (text) => {
    return text
      .trim()
      .split('\n')
      .map(row => row.split(',').map(cell => cell.trim()));
  };

  const buildGrid = (rows) => {
    const entries = rows.map(([boothNumber, r, c, rowSpan, colSpan, companyName, displayName, catagory, type, color]) => ({
      boothNumber,
      row: parseInt(r, 10),
      col: parseInt(c, 10),
      rowSpan: parseInt(rowSpan, 10),
      colSpan: parseInt(colSpan, 10),
      companyName,
      displayName,
      catagory,
      type,
      color
    }));

    // Find total dimensions
    let maxRow = 0, maxCol = 0;
    entries.forEach(entry => {
      maxRow = Math.max(maxRow, entry.row + entry.rowSpan);
      maxCol = Math.max(maxCol, entry.col + entry.colSpan);
    });

    const grid = Array.from({ length: maxRow }, () =>
      Array.from({ length: maxCol }, () => null)
    );

    // Place entries and mark skipped cells
    entries.forEach(entry => {
      grid[entry.row][entry.col] = entry;

      for (let r = entry.row; r < entry.row + entry.rowSpan; r++) {
        for (let c = entry.col; c < entry.col + entry.colSpan; c++) {
          if (r === entry.row && c === entry.col) continue; // skip origin
          grid[r][c] = 'skip';
        }
      }
    });

    return { grid, dimensions: { rows: maxRow, cols: maxCol } };
  };

  if (loading) return <p>Loading map...</p>;

  return (
    <div>
      <table border="0" cellPadding="6" style={{ borderCollapse: 'collapse'}}>
        <tbody>
          {mapData.map((row, rowIndex) => (
            <tr key={rowIndex} style={{height: '4em', maxHeight: '4em'}}>
              {row.map((cell, colIndex) => {
                if (cell === 'skip') return null;
                if (cell === null) return <td key={colIndex} style={{...cellStyle}}></td>;

                return (
                  <td
                    key={colIndex}
                    rowSpan={cell.rowSpan}
                    colSpan={cell.colSpan}
                    style={{ background: `${cell.color}`, textAlign: 'center', border: '1px solid black', position: 'relative', ...cellStyle }}
                  >
                    <div style={{...mapTile}}>
                        <div style={{float: 'right', fontSize: '8px', fontWeight: 'bold', position: 'absolute', top: 0, right: 0, padding: '4px'}}>{cell.boothNumber}</div>
                        <h6 style={{float: 'left', width: '100%', fontSize: '.8em', wordWrap: 'break-word', margin: 0}} className='LGF'>
                            {
                                cell.displayName ? 
                                    cell.displayName.length <= 33 ? cell.displayName : `${cell.displayName.slice(0, 30)}...` :
                                    cell.companyName.length <= 33 ? cell.companyName : `${cell.companyName.slice(0, 30)}...`
                            }
                        </h6>
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MapPage;