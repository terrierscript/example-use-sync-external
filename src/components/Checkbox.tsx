import { Box, Checkbox, CheckboxProps, UseCheckboxProps } from "@chakra-ui/react"
import { FC, useMemo, useSyncExternalStore } from "react"

let externalStore: Record<string, boolean> = {}


const createSubscribe = (keys: string[]) => {
  const target = new EventTarget()
  return {
    subscribe: (callback: EventListenerOrEventListenerObject) => {
      target.addEventListener("change", callback)
      return () => {
        target.removeEventListener("change", callback)
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
      target.dispatchEvent(new Event("change"))
    },
    getSnapshot: () => {
      const checks = keys.map(key => externalStore[key])
      console.log(keys, checks)
      if (checks.every(item => item)) {
        return 2
      }
      if (checks.every(item => !item)) {
        return 0
      }
      return 1
    },
  }
}

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
  const items = Array.from({ length: 10 }).map((_, idx) => idx.toString())
  return <>
    <CheckboxItem checkboxKey={items} label={"all"} />
    {items.map((idx) => {
      return <CheckboxItem key={idx} checkboxKey={[idx]} label={idx} />
    })}
  </>
}