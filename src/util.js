export  const convertMilitaryTime = (time) => {
    const h = time.split(':')[0];
    const m = time.split(':')[1];
    return `${h > 12 ? h - 12 : h}:${m} ${(h > 12 || h == 12) && h != 24 ? 'PM' : 'AM'}`;
  }

export  const getPreviousTimeSlot = (time) => {
  const h = time.split(':')[0];
  const m = time.split(':')[1];
  return `${m == '00' ? h - 1 : h}:${m == '00' ? '30' : '00'}`;
}


export const getCurrentDay = () => {
  const currentDate = new Date();
  const dayOfWeekNumber = currentDate.getDay(); 

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dayOfWeekNumber];
}