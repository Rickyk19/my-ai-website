import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start typing your content...",
  height = 500
}) => {
  return (
    <div className="rich-text-editor w-full border rounded-lg overflow-hidden">
      <Editor
        apiKey="0bmeoo8c1lcuijai1qsk7223q29cdx8mbqdwpvh4jj858422"
        value={value}
        onEditorChange={onChange}
        init={{
          height: height,
          menubar: 'file edit view insert format tools table help',
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount', 'paste',
            'importcss', 'autosave', 'save', 'directionality', 'emoticons',
            'template', 'codesample', 'hr', 'pagebreak', 'nonbreaking',
            'toc', 'imagetools', 'textpattern', 'quickbars'
          ],
          toolbar: 'undo redo | formatselect | bold italic underline strikethrough | fontselect fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | removeformat | pagebreak | charmap emoticons | fullscreen preview save print | insertfile image media template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment',
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', sans-serif; 
              font-size: 14px;
              line-height: 1.6;
              color: #333;
              background-color: #fff;
              padding: 20px;
              max-width: none;
            }
            h1, h2, h3, h4, h5, h6 {
              margin-top: 1.5em;
              margin-bottom: 0.5em;
              font-weight: bold;
            }
            h1 { font-size: 2.5em; color: #2c3e50; }
            h2 { font-size: 2em; color: #34495e; }
            h3 { font-size: 1.7em; color: #34495e; }
            h4 { font-size: 1.4em; color: #34495e; }
            h5 { font-size: 1.2em; color: #34495e; }
            h6 { font-size: 1em; color: #34495e; }
            p { margin-bottom: 1em; }
            blockquote {
              border-left: 4px solid #3498db;
              margin: 1.5em 0;
              font-style: italic;
              background-color: #f8f9fa;
              padding: 15px 20px;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 1em 0;
            }
            table, th, td {
              border: 1px solid #ddd;
            }
            th, td {
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
            }
            code {
              background-color: #f4f4f4;
              padding: 2px 6px;
              border-radius: 3px;
              font-family: 'Courier New', monospace;
            }
            pre {
              background-color: #f4f4f4;
              padding: 15px;
              border-radius: 5px;
              overflow-x: auto;
              margin: 1em 0;
            }
            ul, ol {
              padding-left: 30px;
              margin: 1em 0;
            }
            li {
              margin-bottom: 0.5em;
            }
          `,
          fontsize_formats: '8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 26pt 28pt 30pt 32pt 34pt 36pt 38pt 40pt 42pt 44pt 46pt 48pt 50pt 60pt 70pt 80pt 90pt 100pt',
          font_formats: 'Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
          formats: {
            alignleft: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', styles: { textAlign: 'left' } },
            aligncenter: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', styles: { textAlign: 'center' } },
            alignright: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', styles: { textAlign: 'right' } },
            alignjustify: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', styles: { textAlign: 'justify' } },
            bold: { inline: 'strong', 'remove': 'all' },
            italic: { inline: 'em', 'remove': 'all' },
            underline: { inline: 'span', 'styles': { textDecoration: 'underline' }, exact: true },
            strikethrough: { inline: 'span', 'styles': { textDecoration: 'line-through' }, exact: true }
          },
          paste_data_images: true,
          paste_as_text: false,
          automatic_uploads: true,
          file_picker_types: 'image',
          placeholder: placeholder,
          branding: false,
          statusbar: true,
          elementpath: true,
          resize: 'both',
          contextmenu: 'link image table',
          quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
          quickbars_insert_toolbar: 'quickimage quicktable',
          toolbar_mode: 'sliding',
          skin: 'oxide',
          theme: 'silver'
        }}
      />
    </div>
  );
};

export default RichTextEditor; 