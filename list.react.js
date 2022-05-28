function List(props) {
    const onSelect = props.onSelect;

    const [data, setData] = React.useState(null);
    React.useEffect(() => {
        (async () => {
            const request = await fetch(window.location.href + `list.json`);
            const response = await request.json();
            setData(response);
        })();
    }, []);
    return (
        data == null ? (
            <div>Loading...</div>
        ) : (
            data.map(d => {
                return (
                    <div className="list-link-container">
                        <a className="list-link" onClick={() => {
                            onSelect(d);
                        }}>{d.name}</a>
                    </div>
                )
            })
        )
    )
}