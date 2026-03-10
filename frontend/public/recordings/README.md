# Call Recordings

Place your MP3 audio files in this directory. The filenames must match the `audioSrc` values defined in:

`src/lib/content/call-recordings.ts`

## Expected files

### Initial calls

| File | Scenario | Entry in call-recordings.ts |
|---|---|---|
| `sales-lead.mp3` | Sales — Lead Conversion | `id: "sales-lead"` |
| `support-query.mp3` | Support — Policy Query | `id: "support-query"` |
| `collections-reminder.mp3` | Collections — Payment Reminder | `id: "collections-reminder"` |

### Follow-up calls (same customer, ~1 week later)

Each scenario has an optional follow-up recording where the agent speaks with context from the previous call. Place files at:

| File | Scenario |
|---|---|
| `sales-lead-followup.mp3` | Sales follow-up |
| `support-query-followup.mp3` | Support follow-up |
| `collections-reminder-followup.mp3` | Collections follow-up |

Update the `followUp` object in each entry in `call-recordings.ts` with the correct `durationLabel` and transcript `startTime`/`endTime` values for your recordings.

## Transcript timing

After dropping in your real audio files, update the `startTime` and `endTime` values (in seconds)
for each utterance in `call-recordings.ts` to match the actual timing of your recordings.

The `durationLabel` field (e.g. `"2:41"`) should also be updated to reflect the real duration.

## Supported formats

HTML5 `<audio>` supports `.mp3`, `.ogg`, and `.wav`. MP3 is recommended for broad browser compatibility.
