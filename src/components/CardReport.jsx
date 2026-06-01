import { Badge } from './ui/badge.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card.jsx'
import { Progress } from './ui/progress.jsx'

function parseConfig(fieldMapping) {
    return Object.fromEntries((fieldMapping ?? []).map((f) => [f.Name, f.Value]))
}

function formatValue(value, config) {
    if (value == null) return '—'
    const decimals = parseInt(config.DecimalPoints ?? '0', 10)
    if (config.ValueFormat === 'CURRENCY') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
        }).format(value)
    }
    return Number(value).toFixed(decimals)
}

export function CardReport({ data }) {
    if (!data) return null

    const { FieldMapping, Values = [], Data = [] } = data
    const config = parseConfig(FieldMapping)
    const row = Data[0] ?? {}

    const actualField = Values.find((v) => v.ValueType === 'Actual')
    const targetField = Values.find((v) => v.ValueType === 'Target')

    const actualValue = actualField ? row[actualField.Id] : null
    const targetValue = targetField ? row[targetField.Id] : null

    const progressPct =
        targetValue && actualValue != null
            ? Math.min(100, Math.round((actualValue / targetValue) * 100))
            : null

    const isOnTarget = progressPct != null && progressPct >= 100

    return (
        <Card className="w-72">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {config.ActualLabel ?? actualField?.Name ?? 'Actual'}
                    </CardTitle>
                    {progressPct != null && (
                        <Badge variant={isOnTarget ? 'default' : 'destructive'}>
                            {progressPct}%
                        </Badge>
                    )}
                </div>
                <div className="text-3xl font-bold tracking-tight">
                    {formatValue(actualValue, config)}
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {progressPct != null && (
                    <Progress
                        value={progressPct}
                        className={isOnTarget ? '' : '[&>[data-slot=progress-indicator]]:bg-destructive'}
                    />
                )}
                {targetField && (
                    <CardDescription className="flex justify-between text-xs">
                        <span>{config.TargetLabel ?? targetField.Name}</span>
                        <span className="font-medium text-foreground">
                            {formatValue(targetValue, config)}
                        </span>
                    </CardDescription>
                )}
            </CardContent>
        </Card>
    )
}
