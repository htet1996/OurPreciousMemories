Put up to 3 background songs here, named EXACTLY:

    song1.mp3
    song2.mp3
    song3.mp3

For example:
    .../Our Memory Garden/public/music/song1.mp3
    .../Our Memory Garden/public/music/song2.mp3
    .../Our Memory Garden/public/music/song3.mp3

- The player auto-advances: song1 -> song2 -> song3 -> song1 ...
- Prev / Play / Next controls are in the ☰ menu (top-left).
- You don't need all 3 — missing files are skipped automatically.
- Supported: .mp3 (recommended), .m4a, .ogg. Keep each under ~8MB.

To use different names, external URLs, or more/fewer songs, edit the
SONGS array in:
    src/components/MusicProvider.tsx
