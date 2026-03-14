from docx import Document
import argparse
import os

def docx_to_simple_html(file):
  doc = Document(file)
  html = ""

  for para in doc.paragraphs:
    html += "<p>"

    for run in para.runs:
      text = run.text

      if run.bold:
        text = f"<b>{text}</b>"

      if run.italic:
        text = f"<i>{text}</i>"

      html += text

    html += "</p>\n"

  return html


def main():
  parser = argparse.ArgumentParser(description="Convert DOCX to simple HTML (only bold and italic).")
  parser.add_argument("input", help="Input DOCX file")
  parser.add_argument("-o", "--output", help="Output HTML file (optional)")

  args = parser.parse_args()

  input_file = args.input

  if not os.path.exists(input_file):
    print(f"Fehler: Datei '{input_file}' existiert nicht.")
    return

  if args.output:
    output_file = args.output
  else:
    output_file = os.path.splitext(input_file)[0] + ".html"

  html = docx_to_simple_html(input_file)

  with open(output_file, "w", encoding="utf-8") as f:
    f.write(html)

  print(f"Fertig: {output_file} erstellt")


if __name__ == "__main__":
  main()