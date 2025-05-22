"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import RequestHeaders from "@/components/request-headers"
import ResponseViewer from "@/components/response-viewer"

export default function HttpRequestViewer() {
  const [url, setUrl] = useState("http://mercotrace.hirameki.me:8000/containers/")
  const [method, setMethod] = useState("GET")
  const [requestHeaders, setRequestHeaders] = useState<{ key: string; value: string }[]>([
    { key: "Content-Type", value: "application/json" },
  ])
  const [requestBody, setRequestBody] = useState("")
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<{
    status: number
    statusText: string
    headers: Record<string, string>
    body: string
    time: number
    size: number
  } | null>(null)

  const handleAddHeader = () => {
    setRequestHeaders([...requestHeaders, { key: "", value: "" }])
  }

  const handleHeaderChange = (index: number, field: "key" | "value", value: string) => {
    const newHeaders = [...requestHeaders]
    newHeaders[index][field] = value
    setRequestHeaders(newHeaders)
  }

  const handleRemoveHeader = (index: number) => {
    const newHeaders = [...requestHeaders]
    newHeaders.splice(index, 1)
    setRequestHeaders(newHeaders)
  }

  const sendRequest = async () => {
    setLoading(true)
    setResponse(null)

    try {
      const startTime = performance.now()

      const headers: HeadersInit = {}
      requestHeaders.forEach((header) => {
        if (header.key && header.value) {
          headers[header.key] = header.value
        }
      })

      const options: RequestInit = {
        method,
        headers,
        cache: "no-store",
      }

      if (method !== "GET" && method !== "HEAD" && requestBody) {
        options.body = requestBody
      }

      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          method,
          headers: Object.fromEntries(requestHeaders.filter((h) => h.key && h.value).map((h) => [h.key, h.value])),
          body: requestBody || undefined,
        }),
      })

      const data = await res.json()
      const endTime = performance.now()

      setResponse({
        status: data.status,
        statusText: data.statusText,
        headers: data.headers,
        body: data.body,
        time: Math.round(endTime - startTime),
        size: new Blob([JSON.stringify(data)]).size,
      })
    } catch (error) {
      console.error("Error sending request:", error)
      setResponse({
        status: 0,
        statusText: "Error",
        headers: {},
        body: error instanceof Error ? error.message : "Unknown error occurred",
        time: 0,
        size: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">HTTP Request Viewer</h1>

      <div className="flex flex-col max-w-7xl p-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Requisição HTTP</CardTitle>
            <CardDescription>Configure sua requisição HTTP</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <div className="w-32">
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="HEAD">HEAD</SelectItem>
                    <SelectItem value="OPTIONS">OPTIONS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Input placeholder="URL da requisição" value={url} onChange={(e) => setUrl(e.target.value)} />
              </div>
              <Button onClick={sendRequest} disabled={loading}>
                {loading ? "Enviando..." : "Enviar"}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <Tabs defaultValue="headers">
              <TabsList className="mb-4">
                <TabsTrigger value="headers">Cabeçalhos</TabsTrigger>
                <TabsTrigger value="body">Corpo</TabsTrigger>
              </TabsList>

              <TabsContent value="headers">
                <RequestHeaders
                  headers={requestHeaders}
                  onAddHeader={handleAddHeader}
                  onHeaderChange={handleHeaderChange}
                  onRemoveHeader={handleRemoveHeader}
                />
              </TabsContent>

              <TabsContent value="body">
                <div className="space-y-2">
                  <Label htmlFor="requestBody">Corpo da Requisição</Label>
                  <Textarea
                    id="requestBody"
                    placeholder="Insira o corpo da requisição (JSON, XML, etc.)"
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="font-mono h-60"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {response && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Resposta</CardTitle>
                <CardDescription>Detalhes completos da resposta HTTP</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={response.status >= 200 && response.status < 300 ? "success" : "destructive"}>
                  {response.status} {response.statusText}
                </Badge>
                <Badge variant="outline">{response.time}ms</Badge>
                <Badge variant="outline">{(response.size / 1024).toFixed(2)} KB</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ResponseViewer response={response} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
