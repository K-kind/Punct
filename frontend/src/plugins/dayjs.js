import 'dayjs/locale/ja'
import dayjs from 'dayjs'
import ja from 'dayjs/locale/ja'
import weekday from 'dayjs/plugin/weekday'
dayjs.extend(weekday)

dayjs.locale({
  ...ja,
  weekStart: 1,
})

export default dayjs
