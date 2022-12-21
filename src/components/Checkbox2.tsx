import { Box, Checkbox, CheckboxProps, Stack } from "@chakra-ui/react"
import { FC, useMemo, useSyncExternalStore } from "react"
import { observableStore } from "./observableStore2"

const checkboxStore = observableStore()


const useCheckbox = (keys: string[]) => {
  const { subscribe, getSnapshotValue, setValue } = checkboxStore.register(keys)
  const value = useSyncExternalStore(subscribe, getSnapshotValue, getSnapshotValue)
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

export const CheckboxSample2 = () => {
  const items = Array.from({ length: 10 }).map((_, idx) => idx.toString())

  return <Stack p={2}>
    <CheckboxItem checkboxKey={items} label={"all"} />
    <Stack p={2}>
      {items.map((idx) => {
        return <CheckboxItem key={idx} checkboxKey={[idx]} label={idx} />
      })}
    </Stack>
  </Stack>
}