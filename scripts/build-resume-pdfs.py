#!/usr/bin/env python3
"""Render both resume Markdown files to searchable PDFs with embedded CJK fonts."""
import html
import io
import os
import re
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate
from fontTools.ttLib import TTFont as SourceFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parent.parent
FONT = os.environ.get('RESUME_FONT')
BOLD = os.environ.get('RESUME_FONT_BOLD', FONT)
if not FONT or not Path(FONT).is_file():
    raise SystemExit('Set RESUME_FONT to a Traditional Chinese TrueType font, e.g. NotoSansTC-VF.ttf.')
def embedded_font(path, weight):
    source = SourceFont(path)
    if 'fvar' in source:
        source = instantiateVariableFont(source, {'wght': weight}, inplace=True)
    buffer = io.BytesIO()
    source.save(buffer)
    buffer.seek(0)
    return buffer

pdfmetrics.registerFont(TTFont('Resume', embedded_font(FONT, 400)))
pdfmetrics.registerFont(TTFont('ResumeBold', embedded_font(BOLD, 700)))
pdfmetrics.registerFontFamily('Resume', normal='Resume', bold='ResumeBold', italic='Resume', boldItalic='ResumeBold')

STYLES = {
    'body': ParagraphStyle('body', fontName='Resume', fontSize=9.2, leading=13.5, textColor=HexColor('#233342'), spaceAfter=5, wordWrap='CJK', alignment=TA_LEFT),
    'h1': ParagraphStyle('h1', fontName='ResumeBold', fontSize=23, leading=28, textColor=HexColor('#264653'), spaceAfter=9, keepWithNext=True),
    'h2': ParagraphStyle('h2', fontName='ResumeBold', fontSize=11.3, leading=15.5, textColor=HexColor('#264653'), spaceBefore=11, spaceAfter=5, keepWithNext=True),
    'h3': ParagraphStyle('h3', fontName='ResumeBold', fontSize=10, leading=14, textColor=HexColor('#233342'), spaceBefore=6, spaceAfter=3, keepWithNext=True),
    'bullet': ParagraphStyle('bullet', fontName='Resume', fontSize=9.2, leading=13.5, textColor=HexColor('#233342'), leftIndent=9, firstLineIndent=-7, spaceAfter=3, wordWrap='CJK'),
}

def inline(text):
    value = html.escape(text)
    value = re.sub(r'\[([^\]]+)\]\(((?:https://|mailto:)[^)]+)\)', r'<link href="\2" color="#365f68">\1</link>', value)
    return re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', value)

for lang in ('zh', 'en'):
    source = (ROOT / f'ref_src/resume_{lang}.md').read_text()
    story = []
    for block in re.split(r'\n\s*\n', source.strip()):
        match = re.fullmatch(r'(#{1,3}) (.+)', block)
        if match:
            story.append(Paragraph(inline(match[2]), STYLES[f'h{len(match[1])}']))
        elif all(line.startswith('- ') for line in block.splitlines()):
            story.extend(Paragraph('- ' + inline(line[2:]), STYLES['bullet']) for line in block.splitlines())
        else:
            story.append(Paragraph(inline(block.replace('\n', ' ')), STYLES['body']))
    output = ROOT / f'public/resume_{lang}.pdf'
    doc = SimpleDocTemplate(str(output), pagesize=A4, rightMargin=17*mm, leftMargin=17*mm, topMargin=14*mm, bottomMargin=14*mm, title='石少斌 SHIH SHAO-PIN - 履歷' if lang == 'zh' else 'SHIH SHAO-PIN - Resume', author='SHIH SHAO-PIN', subject='Software Frontend Engineer | Unity / C#')
    doc.build(story)
    print(f'Generated {output.relative_to(ROOT)}')
