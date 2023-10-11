let nowButton = document.getElementById(`nowButton`)
let differenceParagraph = document.getElementById(`differenceParagraph`)

let pageLoadedTimestamp

callNow(1)

function callNow(sectionNum) {
  let section = document.getElementById(`section${sectionNum}`)
  let nowParagraph = document.getElementById(`nowParagraph${sectionNum}`)
  let timeSpanParagraph = document.getElementById(`timeSpanParagraph${sectionNum}`)

  // get the number of milliseconds that have elapsed since midnight January 1, 1970 UTC
  let now = Date.now()

  // show the raw number of milliseconds and formatted time span
  section.style.display = `block`
  nowParagraph.innerHTML = now
  timeSpanParagraph.innerHTML = timeSpan(now, true)

  if (sectionNum == 1) {
    // record the timestamp of when the page loaded and activate the button
    pageLoadedTimestamp = now
    nowButton.addEventListener(`click`, () => callNow(2))
  } else if (sectionNum == 2) {
    // show the difference between when the button was clicked and when the page loaded
    let difference = now - pageLoadedTimestamp
    differenceParagraph.innerHTML = timeSpan(difference)
  }
}

function timeSpan(milliseconds, fromEpoch) {
  // get time parts as formatted strings and filter out zero values
  let parts = getParts(milliseconds, fromEpoch).filter(part => part != null)

  if (parts.length == 1) {
    return parts[0]
  }

  if (parts.length == 2) {
    return parts.join(` and `)
  }

  parts[parts.length - 1] = `and ${parts[parts.length - 1]}`

  return parts.join(`, `)
}

function getParts(milliseconds, fromEpoch) {
  let seconds
  let minutes
  let hours
  let days
  let months
  let years

  if (fromEpoch) {
    let date = new Date(milliseconds)

    // get time parts relative to midnight January 1, 1970 UTC
    milliseconds = date.getUTCMilliseconds()
    seconds = date.getUTCSeconds()
    minutes = date.getUTCMinutes()
    hours = date.getUTCHours()
    days = date.getUTCDate() - 1
    months = date.getUTCMonth()
    years = date.getUTCFullYear() - 1970
  } else {
    // get time parts as entire values
    seconds = milliseconds / 1000
    minutes = seconds / 60
    hours = minutes / 60
    days = hours / 24

    // get time parts as normalized values
    milliseconds = decimalPortion(seconds) * 1000
    seconds = decimalPortion(minutes) * 60
    minutes = decimalPortion(hours) * 60
    hours = decimalPortion(days) * 24
  }

  // return time parts as formatted strings
  return [
    formatPart(years, `year`),
    formatPart(months, `month`),
    formatPart(days, `day`),
    formatPart(hours, `hour`),
    formatPart(minutes, `minute`),
    formatPart(seconds, `second`),
    formatPart(milliseconds, `millisecond`),
  ]
}

function decimalPortion(value) {
  let valuePortions = String(value).split(`.`)

  if (valuePortions.length == 1) {
    return 0
  }

  return Number(`.${valuePortions[1]}`)
}

function formatPart(value, unit) {
  value = Math.floor(value)

  if (!value) {
    return null
  }

  if (value == 1) {
    return `${value} ${unit}`
  }

  return `${value} ${unit}s`
}
