export const fetchAndParseScheduleData = async (url) => {
      const responseText = await fetch(url)
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
          return res.text();
        })
        .then(csvText => {
          const parsed = parseCSV(csvText);
          return parsed;
        })
        .catch(err => {
          console.error("Fetch failed:", err);
        });
      return buildScheduleArray(responseText)
    };

const parseCSV = (csvText) => {
    return csvText
      .trim()
      .split('\n')
      .map(row => row.split(','));      
  };

const buildScheduleArray = (csvArray) => {
    if(csvArray.length > 0)
    {
      const scheduleArray = [];        
      csvArray.forEach(p => {
        scheduleArray.push({
          panelName: p[0],
          description: p[1],
          panelRunner: p[2],
          startTime: p[3],
          duration: p[4],
          location: p[5],
          ageRating: p[6],
          displayColor: p[7],
          spanAll: p[8],
          scheduleDay: p[9],
          catagory: p[10],
          ribbon: p[11]
          })
        });
        // scheduleArray.forEach(s => s.description = s.description.replace('+|+', ','))
        return scheduleArray;
    }
    return [];
}

export const emptyPanel = {
    panelName: null,
    description: null,
    panelRunner: null,
    startTime: null,
    duration: null,
    location: null,
    ageRating: null,
    displayColor: null,
    spanAll: null
}
