# Tiny static file server for local previews (no Python/Node needed).
# Usage:  powershell -ExecutionPolicy Bypass -File serve.ps1 [-Port 8000]
# Then open http://localhost:8000/
param([int]$Port = 8000)

$root = $PSScriptRoot
$types = @{
  ".html" = "text/html; charset=utf-8"; ".css" = "text/css; charset=utf-8"; ".js" = "text/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"; ".webp" = "image/webp"; ".png" = "image/png"; ".jpg" = "image/jpeg"
  ".svg" = "image/svg+xml"; ".mp4" = "video/mp4"; ".webm" = "video/webm"; ".ico" = "image/x-icon"; ".txt" = "text/plain; charset=utf-8"
}
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "Serving $root at http://localhost:$Port/  (Ctrl+C to stop)"

try {
  while ($listener.IsListening) {
    $ctx = $listener.GetContext()
    $res = $ctx.Response
    try {
      $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart("/")
      if ($rel -eq "" -or $rel.EndsWith("/")) { $rel += "index.html" }
      $path = [IO.Path]::GetFullPath((Join-Path $root $rel))
      if (-not $path.StartsWith($root) -or $rel -like "source-art*" -or -not (Test-Path $path -PathType Leaf)) {
        $res.StatusCode = 404
      } else {
        $ext = [IO.Path]::GetExtension($path).ToLower()
        $res.ContentType = if ($types.ContainsKey($ext)) { $types[$ext] } else { "application/octet-stream" }
        $res.Headers.Add("Cache-Control", "no-cache")
        $bytes = [IO.File]::ReadAllBytes($path)
        $res.ContentLength64 = $bytes.Length
        $res.OutputStream.Write($bytes, 0, $bytes.Length)
      }
    } catch { $res.StatusCode = 500 } finally { $res.Close() }
  }
} finally { $listener.Stop() }
