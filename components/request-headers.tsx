"use client"

import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface RequestHeadersProps {
  headers: { key: string; value: string }[]
  onAddHeader: () => void
  onHeaderChange: (index: number, field: "key" | "value", value: string) => void
  onRemoveHeader: (index: number) => void
}

export default function RequestHeaders({ headers, onAddHeader, onHeaderChange, onRemoveHeader }: RequestHeadersProps) {
  return (
    <div className="space-y-2">
      {headers.map((header, index) => (
        <div key={index} className="flex gap-2 items-center">
          <Input
            placeholder="Nome do cabeçalho"
            value={header.key}
            onChange={(e) => onHeaderChange(index, "key", e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Valor do cabeçalho"
            value={header.value}
            onChange={(e) => onHeaderChange(index, "value", e.target.value)}
            className="flex-1"
          />
          <Button variant="ghost" size="icon" onClick={() => onRemoveHeader(index)} className="h-10 w-10">
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" onClick={onAddHeader} className="w-full">
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Cabeçalho
      </Button>
    </div>
  )
}
