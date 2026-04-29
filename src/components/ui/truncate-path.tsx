import { cn } from "@/lib/utils"

/**
 * Muestra una ruta truncando el prefijo (directorio) y dejando visible el sufijo (nombre de archivo).
 * Útil para rutas largas en tablas donde lo importante está al final.
 *
 * @example <TruncatePath path="org/customer/docs/factura-2024.pdf" />
 * → org/customer/docs/  [truncado]  factura-2024.pdf
 */
export function TruncatePath({
  path,
  separator = '/',
  className,
}: {
  path: string
  separator?: string
  className?: string
}) {
  const lastIndex = path.lastIndexOf(separator)

  if (lastIndex === -1) {
    return <span className={cn('truncate font-mono text-xs', className)}>{path}</span>
  }

  const prefix = path.slice(0, lastIndex + 1)
  const suffix = path.slice(lastIndex + 1)

  return (
    <span className={cn('flex min-w-0 font-mono text-xs', className)}>
      <span className="min-w-0 truncate opacity-50">{prefix}</span>
      <span className="shrink-0">{suffix}</span>
    </span>
  )
}
