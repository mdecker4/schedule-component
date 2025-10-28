export const fetchAndParseScheduleData = async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const text = await response.text();
        const parsed = parseCSV(text);
        return buildScheduleArray(parsed);
      } catch (err) {
        throw(err.message);
      }
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
                description: p[1].replace(/{\*}/g, ","),
                panelRunner: p[2],
                startTime: p[3],
                duration: p[4],
                location: p[5],
                ageRating: p[6],
                displayColor: p[7],
                spanAll: p[8],
                scheduleDay: p[9].trim(),
                catagory: p[10].trim()
            })
        });
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
