import { Box, Checkbox, CheckboxProps, Stack } from "@chakra-ui/react"
import { FC, useMemo, useSyncExternalStore } from "react"

const createStores = (keys: string[]) => {
  let externalStore: Record<string, boolean> = Object.fromEntries(keys.map(key => [key, false]))
  const externalStoreTarget: Record<string, EventTarget> = Object.fromEntries(keys.map(key => [key, new EventTarget]))
  const createSubscribe = (keys: string[]) => {
    return {
      subscribe: (callback: EventListenerOrEventListenerObject) => {
        keys.map(key => {
          externalStoreTarget[key].addEventListener("change", callback)
        })
        return () => {
          keys.map(key => {
            externalStoreTarget[key].removeEventListener("change", callback)
          })
        }
      },
      setValue: (v: boolean) => {
        const updateValues = Object.fromEntries(keys.map(key => [key, v]))
        const nexExternalStore = {
          ...externalStore,
          ...updateValues,
        }
        externalStore = nexExternalStore
        console.log(keys, v, nexExternalStore)
        keys.map(key => {
          externalStoreTarget[key].dispatchEvent(new Event("change"))
        })
      },
      getSnapshot: () => {
        const checks = keys.map(key => externalStore[key])
        console.log(keys, checks)
        if (checks.every(item => item)) return 2
        if (checks.every(item => !item)) return 0
        return 1
      },
    }
  }
  return { externalStore, createSubscribe }
}

const items = Array.from({ length: 10 }).map((_, idx) => idx.toString())

const { externalStore, createSubscribe } = createStores(items)


const useCheckbox = (keys: string[]) => {
  const { subscribe, getSnapshot, setValue } = createSubscribe(keys)
  const value = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return { value, setValue }
}

const CheckboxItem: FC<{ checkboxKey: string[], label: string }> = ({ checkboxKey, label }) => {
  const { value, setValue } = useCheckbox(checkboxKey)
  const checkValue: Partial<CheckboxProps> = useMemo(() => {
    switch (value) {
      case 2: return { isChecked: true }
      case 1: return { isIndeterminate: true }
      default: return { isChecked: false }
    }
  }, [value])
  return <Box>
    <Checkbox
      {...checkValue}
      onChange={e => {
        setValue(e.target.checked)
      }}
    >
      {label}
    </Checkbox>
  </Box>
}

export const CheckboxSample = () => {
  return <Stack p={2}>
    <CheckboxItem checkboxKey={items} label={"all"} />
    <Stack p={2}>
      {items.map((idx) => {
        return <CheckboxItem key={idx} checkboxKey={[idx]} label={idx} />
      })}
    </Stack>
  </Stack>
}