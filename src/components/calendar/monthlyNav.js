import { useMonthlyCalendar } from '@zach.codes/react-calendar';
import { format, getYear, subMonths, addMonths } from 'date-fns';
import ru from "date-fns/locale/ru";

export default function MonthlyNav() {
  let { currentMonth, onCurrentMonthChange } = useMonthlyCalendar();

  return (
    <div className="flex justify-end mb-4">
      <button
        onClick={() => onCurrentMonthChange(subMonths(currentMonth, 1))}
        className="cursor-pointer"
      >
        Предыдущий
      </button>
      <div className="ml-4 mr-4 w-32 text-center">
        {format(
          currentMonth,
          getYear(currentMonth) === getYear(new Date()) ? 'LLLL' : 'LLLL yyyy',
          {locale: ru}
        ).toLocaleUpperCase()}
      </div>
      <button
        onClick={() => onCurrentMonthChange(addMonths(currentMonth, 1))}
        className="cursor-pointer"
      >
        Следующий
      </button>
    </div>
  );
};