import SunCalc from 'suncalc';
import Schedule from 'node-schedule';
import { parse, isPast, endOfTomorrow } from 'date-fns';

type Position = {
  lat: number;
  lng: number;
}

type Event = {
  trigger: string | Date;
  handler: () => unknown;
}

type Options = {
  position: Position;
  events: Event[];
}

const SUN_TIMES = ['dawn', 'dusk', 'goldenHour', 'goldenHourEnd', 'nadir', 'nauticalDawn', 'nauticalDusk', 'night', 'nightEnd', 'solarNoon', 'sunrise', 'sunriseEnd', 'sunset', 'sunsetStart' ] as const;
type SunTime = typeof SUN_TIMES[number];
const isSunTime = (s: string): s is SunTime => (SUN_TIMES as ReadonlyArray<string>).includes(s);

let cronTask: Schedule.Job;

const parseTriggerExpr = (refDate: Date, inp: string | Date, position: Position) => {
  if (typeof inp === 'object' && inp instanceof Date) {
    return inp;
  } else if (isSunTime(inp)) {
    return SunCalc.getTimes(refDate, position.lat, position.lng)[inp];
  } else if (/^\d\d:\d\d$/.test(inp)) {
    return parse(inp, 'H:m', refDate);
  } else {
    throw new Error("Invalid trigger expression");
  }
}

export default ({ position, events }: Options) => {

  if (cronTask) cronTask.cancel();

  const scheduleEvents = (isStartup: boolean) => {
    const refDate = isStartup ? new Date() : endOfTomorrow();
    console.log('Performing scheduling with reference date', refDate);
    events.forEach(({ trigger, handler }) => {
      const moment = parseTriggerExpr(refDate, trigger, position);
      if (!isPast(moment)) {
        console.log('Scheduling job for ', moment);
        Schedule.scheduleJob(moment, () => {
          console.log('Running job scheduled for ', moment);
          handler();
        });
      } else {
        if (isStartup) console.log('Already past', moment);
      }
    });
  }

  // Immediately schedule events covering the rest of today
  console.log('Performing startup scheduling');
  scheduleEvents(true);

  // Every day just before midnight, schedule the tasks for the following day
  cronTask = Schedule.scheduleJob('0 55 23 * * *', () => {
    console.log('Performing daily scheduling');
    scheduleEvents(false);
    console.log("Daily scheduling complete.");
  });
}

