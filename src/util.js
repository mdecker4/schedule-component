export  const convertMilitaryTime = (time) => {
    const h = time.split(':')[0];
    const m = time.split(':')[1];
    return `${h > 12 ? h - 12 : h}:${m} ${h > 12 ? 'PM' : 'AM'}`;
  }