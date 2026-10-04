$sizes = 72,96,128,144,152,192,384,512
$base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
$bytes = [Convert]::FromBase64String($base64)

foreach ($size in $sizes) {
    $filename = "icon-${size}x${size}.png"
    [IO.File]::WriteAllBytes($filename, $bytes)
    Write-Host "Created: $filename"
}

dir