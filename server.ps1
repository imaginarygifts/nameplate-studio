param (
    [int]$Port = 5000
)

$endpoint = New-Object System.Net.IPEndPoint ([System.Net.IPAddress]::Loopback, $Port)
$listener = New-Object System.Net.Sockets.TcpListener $endpoint

try {
    $listener.Start()
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "  ✨ ArtisansPlate Studio Server Running! ✨" -ForegroundColor Yellow
    Write-Host "  👉 Localhost: http://localhost:$Port/" -ForegroundColor Green
    Write-Host "  👉 IP Link:   http://127.0.0.1:$Port/" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Cyan
} catch {
    Write-Error "Could not start server on port $Port : $_"
    exit 1
}

$root = $PSScriptRoot
if (-not $root) { $root = (Get-Location).Path }

while ($true) {
    try {
        $client = $listener.AcceptTcpClient()
        $stream = $client.GetStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $line = $reader.ReadLine()
        
        if ($line) {
            $parts = $line.Split(' ')
            if ($parts.Length -ge 2) {
                $rawPath = $parts[1]
                $cleanPath = $rawPath.Split('?')[0].TrimStart('/')
                if ([string]::IsNullOrWhiteSpace($cleanPath)) {
                    $cleanPath = "index.html"
                }

                $filePath = Join-Path $root $cleanPath
                
                if (Test-Path $filePath -PathType Leaf) {
                    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                    $mime = switch ($ext) {
                        ".html" { "text/html; charset=utf-8" }
                        ".css"  { "text/css; charset=utf-8" }
                        ".js"   { "application/javascript; charset=utf-8" }
                        ".json" { "application/json; charset=utf-8" }
                        ".png"  { "image/png" }
                        ".jpg"  { "image/jpeg" }
                        ".svg"  { "image/svg+xml" }
                        default { "application/octet-stream" }
                    }
                    
                    $bytes = [System.IO.File]::ReadAllBytes($filePath)
                    $header = "HTTP/1.1 200 OK`r`nContent-Type: $mime`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
                    $stream.Write($headerBytes, 0, $headerBytes.Length)
                    $stream.Write($bytes, 0, $bytes.Length)
                } else {
                    $notFoundBody = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $cleanPath")
                    $header = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain`r`nContent-Length: $($notFoundBody.Length)`r`nConnection: close`r`n`r`n"
                    $headerBytes = [System.Text.Encoding]::UTF8.GetBytes($header)
                    $stream.Write($headerBytes, 0, $headerBytes.Length)
                    $stream.Write($notFoundBody, 0, $notFoundBody.Length)
                }
            }
        }
        
        $stream.Flush()
        $stream.Close()
        $client.Close()
    } catch {
        # Continue loop on transient error
    }
}
