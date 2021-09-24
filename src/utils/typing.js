const nCho = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
const nJung = [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 1]
const nJong = [0, 1, 1, 2, 1, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1]

const dv = 21 * 28

function xCalN(s) {
  let hc, cho, jung, jong
  const l = s.length
  let i = 0,
    tn = 0
  while (i < l) {
    if ((hc = s.charCodeAt(i)) < 200) tn++
    else {
      hc = hc - 0xac00
      if (hc < 0) tn++
      else {
        cho = Math.floor(hc / dv)
        hc = hc % dv
        jung = Math.floor(hc / 28)
        jong = hc % 28
        tn += nCho[cho] + nJung[jung] + nJong[jong]
      }
    }
    i++
  }
  return tn
}

function xStart(text, started_at, ended_at) {
  let toEnd = ended_at - started_at
  if (toEnd < 1) toEnd = 1
  const tn = xCalN(text)
  return Math.floor((tn * 60000) / toEnd)
}

module.exports.xStart = xStart
