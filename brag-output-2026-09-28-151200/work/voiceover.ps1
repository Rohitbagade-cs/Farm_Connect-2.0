Add-Type -AssemblyName System.Speech
$lines = @(
  'FarmConnect is a role-based farm management app built to connect farm owners with suppliers and administrators.',
  'Owners can register livestock, recording details such as species, health, location, and vaccination status.',
  'They can browse available feeds and medicines, search listings, and choose what they need.',
  'A request links the selected product to livestock and a quantity, then submits it to the supplier.',
  'From My Requests, owners can follow each request as it moves through pending, approved, or rejected status.',
  'On the supplier side, teams manage feed and medicine listings, review incoming requests, and approve or reject them. Owners can also leave feedback, giving both roles a shared workflow.',
  'The frontend uses Angular and TypeScript. It talks to an ASP.NET Core Web API, with Entity Framework Core and SQL Server for data, plus JWT authentication and role-based route protection.',
  'The outcome is a full-stack application that brings livestock records, supply browsing, requests, inventory, and feedback into one connected process. FarmConnect: connecting farmers with quality suppliers.'
)
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$speaker = New-Object System.Speech.Synthesis.SpeechSynthesizer
$speaker.SelectVoice('Microsoft Zira Desktop')
$speaker.Rate = -1
$speaker.Volume = 92
for ($i = 0; $i -lt $lines.Count; $i++) {
  $speaker.SetOutputToWaveFile((Join-Path $dir ('voice-{0:D2}.wav' -f ($i + 1))))
  $speaker.Speak($lines[$i])
  $speaker.SetOutputToNull()
}
$speaker.Dispose()
