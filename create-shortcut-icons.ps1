$base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
$bytes = [Convert]::FromBase64String($base64)

[IO.File]::WriteAllBytes("C:\Users\User\Desktop\Divarsity_pro\public\icons\briefcase.png", $bytes)
[IO.File]::WriteAllBytes("C:\Users\User\Desktop\Divarsity_pro\public\icons\users.png", $bytes)
[IO.File]::WriteAllBytes("C:\Users\User\Desktop\Divarsity_pro\public\icons\chat.png", $bytes)

Write-Host "Created shortcut icons"
dir C:\Users\User\Desktop\Divarsity_pro\public\icons\*.png