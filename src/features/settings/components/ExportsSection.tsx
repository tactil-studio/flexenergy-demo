import { format, parseISO } from "date-fns";
import { Download, FileText, Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getClient } from "@/lib/smartsphere";
import type { ExportItemDto } from "@/lib/smartsphere/modules/file-manager";

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ExportsSection() {
  const [exports, setExports] = useState<ExportItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setIsLoading(true);
    setError(null);
    getClient()
      .fileManager.listExports({ pageSize: 10, sortDesc: true })
      .then((res) => setExports(res.items ?? []))
      .catch(() => setError("Could not load exports."))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDownload = async (item: ExportItemDto) => {
    if (!item.id) return;
    setDownloadingId(item.id);
    try {
      const response = await getClient().fileManager.downloadExport(item.id);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = item.fileName ?? `export-${item.id}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silent – user sees no feedback, non-critical
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <section className="mb-4 md:mb-10">
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Data Exports
        </h3>
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs h-7" onClick={load} disabled={isLoading}>
          <RefreshCw className={`size-3 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="bg-card rounded-[20px] md:rounded-[28px] border border-border shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <p className="text-xs text-destructive text-center py-8 px-4">{error}</p>
        ) : exports.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center px-4">
            <FileText className="size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No exports available</p>
            <p className="text-xs text-muted-foreground/60">Exports will appear here once generated.</p>
          </div>
        ) : (
          exports.map((item, i) => (
            <div key={item.id ?? i}>
              {i > 0 && <Separator />}
              <div className="flex items-center gap-3 px-4 py-3.5">
                <FileText className="size-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item.fileName ?? `Export ${i + 1}`}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {format(parseISO(item.createdAtUtc as string), "d MMM yyyy")}
                    {" · "}
                    {formatBytes(item.contentLength)}
                    {item.fileFormat ? ` · ${item.fileFormat.toUpperCase()}` : ""}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 gap-1.5 text-xs"
                  onClick={() => handleDownload(item)}
                  disabled={downloadingId === item.id}
                >
                  {downloadingId === item.id ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Download className="size-3.5" />
                  )}
                  Download
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
