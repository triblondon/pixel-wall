import SunCalc from 'suncalc';
import Schedule from 'node-schedule';
import { parse, isPast } from 'date-fns';

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

const parseTriggerExpr = (inp: string | Date, position: Position) => {
  if (typeof inp === 'object' && inp instanceof Date) {
    return inp;
  } else if (isSunTime(inp)) {
    return SunCalc.getTimes(new Date(), position.lat, position.lng)[inp];
  } else if (/^\d\d:\d\d$/.test(inp)) {
    return parse(inp, 'H:m', new Date());
  } else {
    throw new Error("Invalid trigger expression");
  }
}

export default ({ position, events }: Options) => {

  if (cronTask) cronTask.cancel();

  const scheduleEvents = () => {
    events.forEach(({ trigger, handler }) => {
      const moment = parseTriggerExpr(trigger, position);
      if (!isPast(moment)) {
        console.log('Scheduling job for ', moment);
        Schedule.scheduleJob(moment, () => {
          console.log('Running job scheduled for ', moment);
          handler();
        });
      } else {
        console.log('Already past', moment);
      }
    });
  }

  // Every day at midnight, schedule the tasks for today
  cronTask = Schedule.scheduleJob('0 0 0 * *', scheduleEvents);

  // And do it immediately on startup for the remainder of today
  scheduleEvents();
}

