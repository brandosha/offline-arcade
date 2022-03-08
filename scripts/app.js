const chess = new Chess()

Vue.component("scope-var", {
  render() {
    return this.$scopedSlots.default(this.$attrs)
  }
})

var app = new Vue({
  el: "#app"
})

try {
  navigator.serviceWorker.register('service-worker.js')
} catch (err) {
  console.log(err)
}
