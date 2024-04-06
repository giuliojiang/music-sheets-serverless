const domContainer = document.querySelector('#root');
const root = ReactDOM.createRoot(domContainer);

const password = 'abc';

function Content() {
    const [selectedSheet, setSelectedSheet] = React.useState(null);
    
    const onBack = React.useCallback(() => {
        setSelectedSheet(null);
    }, [setSelectedSheet]);

    return (
        selectedSheet == null ? (
            <List onSelect={setSelectedSheet}></List>) :
            (<Viewer name={selectedSheet.name} files={selectedSheet.files} onBack={onBack}></Viewer>)
    )
}

function Root() {
    const [passwordChecked, setPasswordChecked] = React.useState(false);
    const onChange = React.useCallback((event) => {
        if (event.target.value == password) {
            setPasswordChecked(true);
        }
    }, [setPasswordChecked]);
    return (
        passwordChecked ? (
            <Content />
        ) : (
            <input autoFocus placeholder="passcode" className="root-pswd" type="password" onChange={onChange}></input>
        )
    )
}

root.render(React.createElement(Root));
