/* eslint-disable */

class Reporter {
  constructor() {
    this.setAt = 0
  }

  clearState() {
    if (this.state) {
      this.state = this.node = null
      this.setAt = 0
    }
  }

  failure(err) {
    console.error("fail", err.toString())
  }

  delay(err) {
    if (this.state == "fail") return
    console.info("delay", err.toString())
  }

  show(type, message) {
    this.clearState()
    this.state = type
    this.setAt = Date.now()
  }

  success() {
    if (this.state == "fail" && this.setAt > Date.now() - 1000 * 10)
      setTimeout(() => this.success(), 5000)
    else
      this.clearState()
  }
}

export default Reporter;