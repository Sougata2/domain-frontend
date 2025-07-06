import { CheckIcon, ChevronsUpDownIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Badge } from "@/components/ui/badge"

const MultiSelectContext = createContext(null)

export function MultiSelect({
  children,
  values,
  defaultValues,
  onValuesChange
}) {
  const [open, setOpen] = useState(false)
  const [selectedValues, setSelectedValues] = useState(new Set(values ?? defaultValues))
  const [items, setItems] = useState(new Map())

  function toggleValue(value) {
    setSelectedValues(prev => {
      const newSet = new Set(prev)
      if (newSet.has(value)) {
        newSet.delete(value)
      } else {
        newSet.add(value)
      }

      onValuesChange?.([...newSet])
      return newSet
    })
  }

  const onItemAdded = useCallback((value, label) => {
    setItems(prev => {
      if (prev.get(value) === label) return prev
      return new Map(prev).set(value, label);
    })
  }, [])

  return (
    <MultiSelectContext
      value={{
        open,
        setOpen,
        selectedValues: values ? new Set(values) : selectedValues,
        toggleValue,
        items,
        onItemAdded,
      }}>
      <Popover open={open} onOpenChange={setOpen}>
        {children}
      </Popover>
    </MultiSelectContext>
  );
}

export function MultiSelectTrigger({
  className,
  children,
  ...props
}) {
  const { open } = useMultiSelectContext()

  return (
    <PopoverTrigger asChild>
      <Button
        {...props}
        variant={props.variant ?? "outline"}
        role={props.role ?? "combobox"}
        aria-expanded={props["aria-expanded"] ?? open}
        className={cn(
          "flex h-auto min-h-9 w-fit items-center justify-between gap-2 overflow-hidden rounded-md border border-input bg-transparent px-3 py-1.5 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[placeholder]:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
          className
        )}>
        {children}
        <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
      </Button>
    </PopoverTrigger>
  );
}

export function MultiSelectValue({
  placeholder,
  clickToRemove = true,
  className,
  overflowBehavior = "wrap-when-open",
  overflowContent = (overflowAmount) => `+${overflowAmount}`,
  ...props
}) {
  const { selectedValues, toggleValue, items, open } = useMultiSelectContext()
  const [overflowAmount, setOverflowAmount] = useState(0)
  const valueRef = useRef(null)
  const overflowRef = useRef(null)
  const itemsRef = useRef(new Set())

  const shouldWrap =
    overflowBehavior === "wrap" ||
    (overflowBehavior === "wrap-when-open" && open)

  const checkOverflow = useCallback(() => {
    if (valueRef.current == null) return

    const containerElement = valueRef.current
    const overflowElement = overflowRef.current

    if (overflowElement != null) overflowElement.style.display = "none"
    itemsRef.current.forEach(child => child.style.removeProperty("display"))
    let amount = 0
    for (let i = itemsRef.current.size - 1; i >= 0; i--) {
      const child = [...itemsRef.current][i]
      if (containerElement.scrollWidth <= containerElement.clientWidth) {
        break
      }
      amount = itemsRef.current.size - i
      child.style.display = "none"
      overflowElement?.style.removeProperty("display")
    }
    setOverflowAmount(amount)
  }, [])

  useEffect(() => {
    if (valueRef.current == null) return

    const observer = new ResizeObserver(checkOverflow)
    observer.observe(valueRef.current)

    return () => observer.disconnect();
  }, [checkOverflow])

  useLayoutEffect(() => {
    checkOverflow()
  }, [selectedValues, open, checkOverflow])

  if (selectedValues.size === 0 && placeholder) {
    return (<span className="font-normal text-muted-foreground">{placeholder}</span>);
  }

  return (
    <div
      {...props}
      ref={valueRef}
      className={cn(
        "flex w-full gap-1.5 overflow-hidden",
        shouldWrap && "h-full flex-wrap",
        className
      )}>
      {[...selectedValues]
        .filter(value => items.has(value))
        .map(value => (
          <Badge
            ref={el => {
              if (el == null) return

              itemsRef.current.add(el)
              return () => {
                itemsRef.current.delete(el)
              };
            }}
            variant="outline"
            className="group flex items-center gap-1"
            key={value}
            onClick={
              clickToRemove
                ? e => {
                    e.stopPropagation()
                    toggleValue(value)
                  }
                : undefined
            }>
            {items.get(value)}
            {clickToRemove && (
              <XIcon className="size-2 text-muted-foreground group-hover:text-destructive" />
            )}
          </Badge>
        ))}
      <Badge
        style={{
          display: overflowAmount > 0 && !shouldWrap ? "block" : "none",
        }}
        variant="outline"
        ref={overflowRef}>
        {overflowContent(overflowAmount)}
      </Badge>
    </div>
  );
}

export function MultiSelectContent({
  search = true,
  children,
  ...props
}) {
  const canSearch = typeof search === "object" ? true : search

  return (
    <>
      <div style={{ display: "none" }}>
        <Command>
          <CommandList>{children}</CommandList>
        </Command>
      </div>
      <PopoverContent className="min-w-[var(--radix-popover-trigger-width)] p-0">
        <Command {...props}>
          {canSearch ? (
            <CommandInput
              placeholder={
                typeof search === "object" ? search.placeholder : undefined
              } />
          ) : (
            <button autoFocus aria-hidden="true" className="sr-only" />
          )}
          <CommandList>
            {canSearch && (
              <CommandEmpty>
                {typeof search === "object" ? search.emptyMessage : undefined}
              </CommandEmpty>
            )}
            {children}
          </CommandList>
        </Command>
      </PopoverContent>
    </>
  );
}

export function MultiSelectItem({
  value,
  children,
  badgeLabel,
  onSelect,
  ...props
}) {
  const { toggleValue, selectedValues, onItemAdded } = useMultiSelectContext()
  const isSelected = selectedValues.has(value)

  useEffect(() => {
    onItemAdded(value, badgeLabel ?? children)
  }, [value, children, onItemAdded, badgeLabel])

  return (
    <CommandItem
      {...props}
      value={value}
      onSelect={v => {
        toggleValue(v)
        onSelect?.(v)
      }}>
      <CheckIcon className={cn("mr-2 size-4", isSelected ? "opacity-100" : "opacity-0")} />
      {children}
    </CommandItem>
  );
}

export function MultiSelectGroup(
  props,
) {
  return <CommandGroup {...props} />;
}

export function MultiSelectSeparator(
  props,
) {
  return <CommandSeparator {...props} />;
}

function useMultiSelectContext() {
  const context = useContext(MultiSelectContext)
  if (context == null) {
    throw new Error("useMultiSelectContext must be used within a MultiSelectContext")
  }
  return context
}
