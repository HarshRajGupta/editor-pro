import { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Loader } from '../';

function Doc({ code, setCode, setLastChanged }) {
	const editorRef = useRef(null);
	const [loading, setLoading] = useState(true);
	return (
		<>
			<div className={loading ? 'hidden' : ''}>
				<Editor
					apiKey={process.env.REACT_APP_EDITOR_KEY}
					onInit={(evt, editor) => {
						evt.target.setContent(code);
						editorRef.current = editor;
						setLoading(false);
					}}
					value={code}
					onEditorChange={(e) => {
						setCode(e);
						setLastChanged(1);
					}}
					init={{
						plugins:
							'powerpaste casechange searchreplace autolink directionality advcode visualblocks visualchars image link media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker editimage help formatpainter permanentpen charmap linkchecker emoticons advtable export print',
						toolbar:
							'undo redo print spellcheckdialog formatpainter | blocks fontfamily fontsize | bold italic underline forecolor backcolor | link image addcomment showcomments  | alignleft aligncenter alignright alignjustify lineheight | checklist bullist numlist indent outdent | removeformat',
						height: '100vh',
						toolbar_sticky: true,
						content_css: 'fluent',
						highlight_on_focus: true,
						statusbar: false,
						mobile: {
							menubar: false,
							plugins: 'lists autolink',
							toolbar: 'undo bold italic alignleft aligncenter alignright styles',
						},
					}}
				/>
			</div>
			{loading && <Loader />}
		</>
	);
}

export default Doc;
