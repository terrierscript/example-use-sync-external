
type Listener = () => void

export const observableStore = () => {
  const state: Record<string, boolean> = {}
  const eventEmitters: Record<string, Record<string, Listener>
  > = {}
  return {
    register: (keys: string[]) => {
      const query = keys.sort().join(",")
      return {
        subscribe: (callback: Listener) => {
          keys.map(key => {
            eventEmitters[key] = {
              ...eventEmitters[key],
              [query]: callback,
            }
          })
          return () => {
            keys.map(key => {
              const { query, ...rest } = eventEmitters[key]
              eventEmitters[key] = rest
            })
          }
        },
        getSnapshotValue: () => {
          const trueCount = keys.filter(key => {
            return state[key] === true
          }).length
          if (trueCount === 0) {
            return 0
          }
          if (trueCount === keys.length) {
            return 2
          }
          // intermediate
          return 1
        },
        setValue(value: boolean) {
          keys.map(key => {
            state[key] = value
            Object.values(eventEmitters[key])
              .map(listener => {
                return listener()
              })
          })
        }
      }
    }
  }
}
