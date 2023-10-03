let timeLocalParagraph = document.getElementById(`timeLocalParagraph`)
let nowButton = document.getElementById(`nowButton`)
let differenceParagraph = document.getElementById(`differenceParagraph`)

let pageLoadedTimestamp

callNow(1)

function callNow(sectionNum) {
  let section = document.getElementById(`section${sectionNum}`)
  let nowParagraph = document.getElementById(`nowParagraph${sectionNum}`)
  let timeSpanParagraph = document.getElementById(`timeSpanParagraph${sectionNum}`)
  let timeUtcParagraph = document.getElementById(`timeUtcParagraph${sectionNum}`)

  // get the number of milliseconds that have elapsed since midnight January 1, 1970 UTC
  let now = Date.now()

  // show the raw number of milliseconds, formatted time span, and current time in UTC
  section.style.display = `block`
  nowParagraph.innerHTML = now
  timeSpanParagraph.innerHTML = timeSpan(now)
  timeUtcParagraph.innerHTML = timeUtc(now)

  if (sectionNum == 1) {
    // show current time in local time
    timeLocalParagraph.innerHTML = timeLocal(now)

    // record the timestamp of when the page loaded and activate the button
    pageLoadedTimestamp = now
    nowButton.addEventListener(`click`, () => callNow(2))
  } else if (sectionNum == 2) {
    // show the difference between when the button was clicked and when the page loaded
    let difference = now - pageLoadedTimestamp
    differenceParagraph.innerHTML = timeSpan(difference)
  }
}

function timeSpan(milliseconds) {
  // get time parts as formatted strings and filter out zero values
  let parts = getParts(milliseconds).filter(part => part != null)

  if (parts.length == 1) {
    return parts[0]
  }

  if (parts.length == 2) {
    return parts.join(` and `)
  }

  parts[parts.length - 1] = `and ${parts[parts.length - 1]}`

  return parts.join(`, `)
}

function getParts(milliseconds) {
  // get time parts as entire values
  let seconds = milliseconds / 1000
  let minutes = seconds / 60
  let hours = minutes / 60
  let days = hours / 24
  let months = days / 30.436875
  let years = months / 12

  // get time parts as normalized values
  milliseconds = decimalPortion(seconds) * 1000
  seconds = decimalPortion(minutes) * 60
  minutes = decimalPortion(hours) * 60
  hours = decimalPortion(days) * 24
  days = decimalPortion(months) * 30.436875
  months = decimalPortion(years) * 12

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

  if (value == 0) {
    return null
  }

  if (value == 1) {
    return `${value} ${unit}`
  }

  return `${value} ${unit}s`
}

function timeUtc(milliseconds) {
  let timeString = new Date(milliseconds).toLocaleString([], {
    year: `numeric`,
    month: `long`,
    day: `numeric`,
    hour: `numeric`,
    minute: `numeric`,
    second: `numeric`,
    fractionalSecondDigits: 3,
    hour12: false,
    timeZone: `UTC`,
  })

  return `${timeString} UTC`
}

function timeLocal(milliseconds) {
  let timeString = new Date(milliseconds).toLocaleString([], {
    year: `numeric`,
    month: `long`,
    day: `numeric`,
    hour: `numeric`,
    minute: `numeric`,
    second: `numeric`,
    fractionalSecondDigits: 3,
  })

  return timeString
}