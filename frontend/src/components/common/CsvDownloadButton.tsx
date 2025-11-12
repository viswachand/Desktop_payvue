import type { ReactNode } from "react";
import DownloadRounded from "@mui/icons-material/DownloadRounded";
import Button from "./button";

export interface CsvColumn<T> {
  header: string;
  accessor: (row: T) => string | number | boolean | null | undefined;
}

interface CsvDownloadButtonProps<T> {
  data: T[];
  columns: CsvColumn<T>[];
  fileName?: string;
  label?: ReactNode;
  disabled?: boolean;
}

export default function CsvDownloadButton<T>({
  data,
  columns,
  fileName = "export",
  label = "Download CSV",
  disabled,
}: CsvDownloadButtonProps<T>) {
  const handleDownload = () => {
    if (!data.length || !columns.length) return;

    const escapeCell = (value: string | number | boolean | null | undefined) => {
      if (value === null || value === undefined) return '""';
      const stringValue = String(value);
      return `"${stringValue.replace(/"/g, '""')}"`;
    };

    const headerRow = columns.map((col) => escapeCell(col.header)).join(",");
    const bodyRows = data
      .map((row) =>
        columns.map((col) => escapeCell(col.accessor(row))).join(",")
      )
      .join("\n");

    const csvContent = [headerRow, bodyRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="outlined"
      color="primary"
      startIcon={<DownloadRounded />}
      onClick={handleDownload}
      disabled={disabled || !data.length}
      sx={{ height: 40 }}
    >
      {label}
    </Button>
  );
}
