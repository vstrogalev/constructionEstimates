// функция форматирования строки с разделением на разряды и возможностью выводить либо округленные значения, либо c тем количеством после запятой, что указано во втором параметре
export default function formatNumber(number: number, digitsAfterComma: number = 0) {
  return digitsAfterComma >= 1 ? number.toLocaleString('ru-RU', {
    minimumFractionDigits: digitsAfterComma,
    maximumFractionDigits: digitsAfterComma
  }) : Math.round(number).toLocaleString('ru-RU')
}
