import { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { Loader, Moodle } from '../';

function Doc({ user, code, setCode, setLastChanged }) {
	const editorRef = useRef(null);
	const [loading, setLoading] = useState(true);
	const [showMoodle, setShowMoodle] = useState(false);
	const logOut = () => {
		localStorage.removeItem('token');
		window.location.reload();
	};
	return (
		<>
			{showMoodle && (
				<Moodle
					setShowMoodle={setShowMoodle}
					docId={window.location.pathname.split('/')[1]}
					user={user}
				/>
			)}
			<div className={loading ? 'hidden' : 'z-0'}>
				<span
					className={
						'absolute z-10 text-sm font-editor right-8 top-4 max-[1000px]:hidden'
					}
				>
					<span
						className="mr-4 cursor-pointer"
						onClick={() => setShowMoodle(true)}
					>
						Invite
					</span>
					<span
						className="cursor-pointer"
						onClick={logOut}
					>
						Logout
					</span>
				</span>
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
						draggable_modal: true,
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
							toolbar:
								'undo bold italic alignleft aligncenter alignright styles',
						},
					}}
				/>
			</div>
			{loading && <Loader />}
		</>
	);
}

export default Doc;
