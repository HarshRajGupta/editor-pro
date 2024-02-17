import MDEditor from '@uiw/react-md-editor';

function Markdown({ code, setCode, setLastChanged }) {
    return (
        <div className="md w-full h-[calc(100vh-62px)]" data-color-mode="light">
            <MDEditor
                value={code}
                onChange={setCode}
                className='w-full h-fullscreen'
                onKeyDown={() => {
                    setLastChanged(true)
                }}
            />
        </div>
    )
}

export default Markdown