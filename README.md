# Birthday Surprise — GitHub Pages package

This is a plain static website. No build command, framework, or server is required. The complete publishable site is in `docs/`.

## Publish on GitHub Pages

1. Create a GitHub repository and upload the contents of this folder, keeping the `docs/` folder at the repository root.
2. Open **Settings → Pages** in the repository.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the branch you uploaded (usually `main`) and choose **/docs** as the folder, then click **Save**.
5. Wait for GitHub Pages to finish publishing. Its URL will appear in the Pages settings.

Serve **`docs/` from the repository root**. The HTML, CSS, JavaScript, photos, poem paper, audio, and video use relative project paths, so the site works under a repository URL such as `https://username.github.io/repository/` without a build or a custom base path.

## Preview

Open `docs/index.html` in a browser. Some browsers restrict audio on `file://` pages; GitHub Pages serves the site over HTTPS and allows the audio after the visitor presses the playback buttons.

## Project files

```text
birthday-surprise-github-pages/
├── .gitignore
├── README.md
└── docs/                 # Select this folder in GitHub Pages settings
    ├── index.html
    ├── app.js
    ├── styles.css
    └── assets/
        ├── audio/         # guitar.mp3, voice-note.mp3
        ├── images/        # backgrounds, poem paper, song cover, and 15 memories
        └── video/         # sticky-note-video.mp4
```

All included audio and video files are below GitHub's 100 MB per-file limit. The site continues to use its existing Google Fonts stylesheet for the same typography, with CSS fallback fonts if that service is unavailable.
