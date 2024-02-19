import { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Loader, Moodle } from "../";

function Doc({ user, text, setText, setLastChanged, openToAll, setOpenToAll }) {
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [showMoodle, setShowMoodle] = useState(false);
  const logOut = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };
  console.log(text);
  return (
    <>
      {showMoodle && (
        <Moodle
          setShowMoodle={setShowMoodle}
          docId={window.location.pathname.split("/")[1]}
          user={user}
          openToAll={openToAll}
          setOpenToAll={setOpenToAll}
        />
      )}
      <div className={loading ? "hidden" : "z-0"}>
        <span
          className={
            "absolute z-10 text-sm font-editor right-8 top-4 max-[1000px]:hidden"
          }
        >
          <span
            className="mr-4 cursor-pointer"
            onClick={() => setShowMoodle(true)}
          >
            Share
          </span>
          <span className="cursor-pointer" onClick={logOut}>
            Logout
          </span>
        </span>
        <Editor
          onKeyDown={(e) => {
            setLastChanged(true);
          }}
          apiKey={process.env.REACT_APP_EDITOR_KEY}
          onInit={(evt, editor) => {
            editorRef.current = editor;
            setLoading(false);
          }}
          value={text}
          onEditorChange={(e) => {
            setText(e);
          }}
          init={{
            draggable_modal: true,
            plugins:
              "searchreplace autolink directionality visualblocks visualchars image link media codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap emoticons",
            toolbar:
              "undo redo print spellcheckdialog formatpainter | blocks fontfamily fontsize | bold italic underline forecolor backcolor | link image addcomment showcomments  | alignleft aligncenter alignright alignjustify lineheight | checklist bullist numlist indent outdent | removeformat",
            height: "100vh",
            toolbar_sticky: true,
            content_css: "fluent",
            highlight_on_focus: true,
            statusbar: false,
            mobile: {
              menubar: false,
              plugins: "lists autolink",
              toolbar:
                "undo bold italic alignleft aligncenter alignright styles",
            },
          }}
        />
      </div>
      {loading && <Loader />}
    </>
  );
}

export default Doc;
