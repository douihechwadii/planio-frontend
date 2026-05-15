import { useState, useRef, useEffect } from 'react'
import { TextField } from '@mui/material'
import { useSetAbsence } from '@/hooks/useResources'

interface AbsenceCellProps {
    resourceId: number
    month: string
    currentDays: number
    year: string
    onDone: () => void
}

export function AbsenceCell({
                                resourceId,
                                month,
                                currentDays,
                                year,
                                onDone,
                            }: AbsenceCellProps) {
    const [value, setValue] = useState(String(currentDays))
    const inputRef = useRef<HTMLInputElement>(null)
    const setAbsence = useSetAbsence(resourceId, year)

    useEffect(() => {
        inputRef.current?.focus()
    }, [])

    const save = async () => {
        const days = parseInt(value, 10)

        if (!isNaN(days) && days >= 0) {
            try {
                await setAbsence.mutateAsync({
                    month,
                    absenceDays: days,
                })
            } catch {
                // ignore error
            }
        }

        onDone()
    }

    return (
        <TextField
            inputRef={inputRef}
            type="number"
            value={value}
            size="small"
            onChange={(e) => setValue(e.target.value)}
            onBlur={save}
            onKeyDown={(e) => {
                if (e.key === 'Enter') save()
                if (e.key === 'Escape') onDone()
            }}
            slotProps={{
                htmlInput: {
                    min: 0,
                },
            }}
            sx={{
                width: 70,
                '& input': {
                    textAlign: 'center',
                    py: 0.5,
                },
            }}
        />
    )
}