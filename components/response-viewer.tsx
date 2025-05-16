"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ResponseViewerProps {
  response: {
    status: number
    statusText: string
    headers: Record<string, string>
    body: string
    time: number
    size: number
  }
}

export default function ResponseViewer({ response }: ResponseViewerProps) {
  const [bodyFormat, setBodyFormat] = useState<"raw" | "formatted">("formatted")

  const formatBody = (body: string) => {
    try {
      const parsed = JSON.parse(body)
      return JSON.stringify(parsed, null, 2)
    } catch {
      return body
    }
  }

  const isJson = () => {
    try {
      JSON.parse(response.body)
      return true
    } catch {
      return false
    }
  }
  //TODO: Handle when the response come with all fields undefined
  return (
    <Tabs defaultValue="body">
      <TabsList className="mb-4">
        <TabsTrigger value="body">Corpo</TabsTrigger>
        <TabsTrigger value="headers">Cabeçalhos</TabsTrigger>
        <TabsTrigger value="raw">Resposta Completa</TabsTrigger>
      </TabsList>
      <TabsContent value="body">
        <div className="space-y-4">
          {isJson() && (
            <div className="flex justify-end">
              <Tabs value={bodyFormat} onValueChange={(v) => setBodyFormat(v as "raw" | "formatted")}>
                <TabsList>
                  <TabsTrigger value="formatted">Formatado</TabsTrigger>
                  <TabsTrigger value="raw">Bruto</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          )}

          <ScrollArea className="overflow-x-hidden overflow-y-auto h-[400px] w-full rounded-md border p-4 font-mono text-sm">
            <pre>{bodyFormat === "formatted" && isJson() ? formatBody(response.body) : response.body}</pre>
          </ScrollArea>
        </div>
      </TabsContent>

      <TabsContent value="headers">
        <ScrollArea className="h-[400px] w-full rounded-md border">
          <div className="p-4">
            <h3 className="font-semibold mb-2">
              Status: {response.status} {response.statusText}
            </h3>
            <div className="grid gap-2">
              {Object.entries(response?.headers).map(([key, value]) => (
                <div key={key} className="grid grid-cols-[200px_1fr] gap-2 border-b pb-2">
                  <div className="font-medium text-sm">{key}</div>
                  <div className="text-sm font-mono break-all">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="raw">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="status">
            <AccordionTrigger>Status</AccordionTrigger>
            <AccordionContent>
              <div className="p-2 bg-muted rounded-md font-mono">
                HTTP/1.1 {response.status} {response.statusText}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="request-info">
            <AccordionTrigger>Informações da Requisição</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <div className="font-medium">URL:</div>
                  <div className="font-mono text-sm break-all">{response.headers["x-request-url"] || "N/A"}</div>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <div className="font-medium">Método:</div>
                  <div className="font-mono text-sm">{response.headers["x-request-method"] || "N/A"}</div>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <div className="font-medium">Tempo:</div>
                  <div className="font-mono text-sm">{response.time}ms</div>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-2">
                  <div className="font-medium">Tamanho:</div>
                  <div className="font-mono text-sm">{(response.size / 1024).toFixed(2)} KB</div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="headers">
            <AccordionTrigger>Cabeçalhos</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-1">
                {Object.entries(response.headers).map(([key, value]) => (
                  <div key={key} className="font-mono text-sm">
                    {key}: {value}
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="body">
            <AccordionTrigger>Corpo</AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[300px] w-full rounded-md border p-4 font-mono text-sm">
                <pre>{response.body}</pre>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TabsContent>
    </Tabs>
  )
}
