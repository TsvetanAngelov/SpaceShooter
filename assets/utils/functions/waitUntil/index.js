const waitUntil = ({condition=()=>true,pollInterval=100}) => {
  return new Promise((resolve) => {
      let interval = setInterval(() => {
          if (!condition()) {
              return
          }

          clearInterval(interval)
          resolve()
      }, pollInterval)
  })
}

export default waitUntil