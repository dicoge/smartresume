# Maintaining the public resume

`ref_src/main.md` is the source of truth. When identity or employment details change, synchronize:

- `ref_src/resume_zh.md` and `ref_src/resume_en.md`
- `src/i18n/zh-TW.ts` and `src/i18n/en.ts`
- `index.html` search/social metadata and Person structured data
- `vite.config.ts` PWA name and description
- `public/resume_zh.pdf` and `public/resume_en.pdf`

Do not describe a former employer as a current `worksFor` relationship. Keep exact employment dates and the formal job title consistent in both languages. Include education dates and quantitative results only when confirmed.

## Regenerate the PDFs

The generator requires Python 3, ReportLab, FontTools, and a Traditional Chinese TrueType font. It embeds the used glyphs in each searchable PDF and does not access remote pages or publish anything.

Install ReportLab with `python3 -m pip install reportlab fonttools`. Obtain a Noto Sans TC TrueType font from the official [Noto CJK font collection](https://github.com/notofonts/noto-cjk/blob/main/Sans/README.md). Set `RESUME_FONT` to its local path; optionally set `RESUME_FONT_BOLD` to a matching bold font.

```bash
RESUME_FONT=/path/to/NotoSansTC-VF.ttf npm run resume:pdf
```

The renderer supports the Markdown subset used by the resumes: headings, paragraphs, bold text, links, and unordered lists. The font and Python package are not required for the website build when the committed PDFs are already current.

## Validate before release

```bash
npm test
npm run build
pdftotext public/resume_zh.pdf -
pdftotext public/resume_en.pdf -
pdftoppm -png -r 120 public/resume_zh.pdf /tmp/resume-zh
pdftoppm -png -r 120 public/resume_en.pdf /tmp/resume-en
```

Inspect every rendered page for missing characters, overflow, unexpected page breaks, and link correctness. Confirm that both website download buttons serve the newly generated language-specific PDF. Commit the synchronized source and PDFs together; deployment is a separate step.
